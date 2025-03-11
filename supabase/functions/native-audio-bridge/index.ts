
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ROOM = 'native_audio_bridge'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebRTCMessage {
  type: 'offer' | 'answer' | 'ice_candidate';
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

interface AudioDeviceMessage {
  type: 'scan_devices' | 'load_plugin' | 'setup_device';
  deviceId?: string;
  pluginPath?: string;
  format?: 'vst' | 'au';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""
  
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected websocket connection", { 
      status: 400,
      headers: corsHeaders 
    })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  console.log("WebSocket connection established")

  socket.onopen = () => {
    console.log("Client connected")
  }

  socket.onmessage = async (event) => {
    try {
      const message: WebRTCMessage | AudioDeviceMessage = JSON.parse(event.data)
      console.log("Received message:", message)

      switch (message.type) {
        case 'offer':
        case 'answer':
        case 'ice_candidate':
          // Forward WebRTC signaling messages to the native host
          socket.send(JSON.stringify(message))
          break

        case 'scan_devices':
          // Native host will scan and return device list
          socket.send(JSON.stringify({
            type: 'devices_found',
            devices: [] // To be populated by native host
          }))
          break

        case 'load_plugin':
          if (!message.pluginPath || !message.format) {
            throw new Error('Missing plugin info')
          }
          // Native host will load plugin
          socket.send(JSON.stringify({
            type: 'plugin_loaded',
            path: message.pluginPath
          }))
          break

        case 'setup_device':
          if (!message.deviceId) {
            throw new Error('Missing device ID')
          }
          // Native host will setup audio device
          socket.send(JSON.stringify({
            type: 'device_setup',
            deviceId: message.deviceId
          }))
          break

        default:
          console.error('Unknown message type:', message.type)
      }
    } catch (err) {
      console.error('Error handling message:', err)
      socket.send(JSON.stringify({
        type: 'error',
        message: err.message
      }))
    }
  }

  socket.onerror = (e) => console.error('WebSocket error:', e)
  socket.onclose = () => console.log('Client disconnected')

  return response
})
