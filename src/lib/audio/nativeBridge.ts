import { supabase } from "@/integrations/supabase/client";
import { Plugin, PluginPreset } from "./pluginScanner";

interface PluginMessage {
  type: 'scan_plugins' | 'load_plugin';
  paths?: string[];
  pluginPath?: string;
  format?: 'vst' | 'au';
}

interface AudioDeviceMessage {
  type: 'scan_devices' | 'setup_device';
  deviceId?: string;
}

class NativeAudioBridge {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private messageHandlers: Map<string, Function> = new Map();
  private connected = false;
  private messageQueue: any[] = [];

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      const projectRef = 'eybrmzbvvckdlvlckfms';
      const signaling = new WebSocket(
        `wss://${projectRef}.functions.supabase.co/native-audio-bridge`
      );

      // Create WebRTC peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Create data channel for messages
      this.dataChannel = this.peerConnection.createDataChannel('audio-bridge', {
        ordered: false, // Allow out-of-order delivery for lower latency
        maxRetransmits: 0 // Don't retransmit lost packets
      });

      this.dataChannel.onopen = () => {
        console.log('WebRTC data channel opened');
        this.connected = true;
        this.processQueue();
      };

      this.dataChannel.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received from native bridge:', message);
          
          const handler = this.messageHandlers.get(message.type);
          if (handler) {
            handler(message);
          }
        } catch (err) {
          console.error('Error handling native bridge message:', err);
        }
      };

      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          signaling.send(JSON.stringify({
            type: 'ice_candidate',
            candidate: event.candidate
          }));
        }
      };

      // Handle signaling messages
      signaling.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'offer':
            await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await this.peerConnection?.createAnswer();
            await this.peerConnection?.setLocalDescription(answer);
            signaling.send(JSON.stringify({
              type: 'answer',
              answer
            }));
            break;

          case 'ice_candidate':
            if (message.candidate) {
              await this.peerConnection?.addIceCandidate(new RTCIceCandidate(message.candidate));
            }
            break;
        }
      };

      signaling.onerror = (error) => {
        console.error('Signaling WebSocket error:', error);
        this.connected = false;
      };

      signaling.onclose = () => {
        console.log('Signaling connection closed, attempting reconnect...');
        this.connected = false;
        setTimeout(() => this.connect(), 5000);
      };

    } catch (err) {
      console.error('Error setting up WebRTC connection:', err);
      this.connected = false;
      setTimeout(() => this.connect(), 5000);
    }
  }

  public sendMessage(message: PluginMessage | AudioDeviceMessage) {
    if (this.connected && this.dataChannel?.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  private processQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  public onMessage(type: string, handler: Function) {
    this.messageHandlers.set(type, handler);
  }

  public async scanDevices() {
    this.sendMessage({ type: 'scan_devices' });
  }

  public async loadPlugin(pluginPath: string, format: 'vst' | 'au'): Promise<boolean> {
    return new Promise((resolve) => {
      this.onMessage('plugin_loaded', () => resolve(true));
      this.onMessage('error', () => resolve(false));
      
      this.sendMessage({
        type: 'load_plugin',
        pluginPath,
        format
      });
    });
  }

  public async setupDevice(deviceId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.onMessage('device_setup', () => resolve(true));
      this.onMessage('error', () => resolve(false));
      
      this.sendMessage({
        type: 'setup_device',
        deviceId
      });
    });
  }
}

// Export singleton instance
export const nativeBridge = new NativeAudioBridge();
