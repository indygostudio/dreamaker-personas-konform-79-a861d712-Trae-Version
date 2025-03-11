import { supabase } from "@/integrations/supabase/client";
import { nativeBridge } from "./nativeBridge";

export interface AudioDevice {
  id: string;
  name: string;
  deviceId: string;
  isInput: boolean;
  isOutput: boolean;
  isDefault: boolean;
  sampleRates: number[];
  bufferSizes: number[];
  channelCount: number;
}

export interface MIDIDevice {
  id: string;
  name: string;
  isInput: boolean;
  isOutput: boolean;
}

// Initialize audio context with user interaction to comply with browser policies
let audioContext: AudioContext | null = null;

export const initializeAudio = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
    return true;
  }
  return false;
};

export const getAudioContext = () => audioContext;

export const scanAudioDevices = async (): Promise<AudioDevice[]> => {
  try {
    // First try native bridge
    await nativeBridge.scanDevices();

    // Fallback to Web Audio API
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      throw new Error('Media devices API not supported');
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => 
      device.kind === 'audioinput' || device.kind === 'audiooutput'
    );

    // Map devices to our format and store in database
    const formattedDevices = audioDevices.map(device => ({
      device_id: device.deviceId,
      name: device.label || `Audio Device ${device.deviceId.slice(0, 4)}`,
      is_input: device.kind === 'audioinput',
      is_output: device.kind === 'audiooutput',
      is_default: device.deviceId === 'default',
      sample_rates: [44100, 48000, 88200, 96000], // Common sample rates
      buffer_sizes: [128, 256, 512, 1024], // Common buffer sizes
      channel_count: 2, // Default to stereo
      last_used: new Date().toISOString()
    }));

    // Store devices in database using upsert with device_id constraint
    for (const device of formattedDevices) {
      const { error } = await supabase
        .from('audio_device_info')
        .upsert(device, {
          onConflict: 'device_id'
        });
      
      if (error) console.error('Error storing device:', error);
    }

    return formattedDevices.map(device => ({
      id: device.device_id,
      deviceId: device.device_id,
      name: device.name,
      isInput: device.is_input,
      isOutput: device.is_output,
      isDefault: device.is_default,
      sampleRates: device.sample_rates,
      bufferSizes: device.buffer_sizes,
      channelCount: device.channel_count
    }));
  } catch (err) {
    console.error('Error scanning audio devices:', err);
    return [];
  }
};

export const scanMIDIDevices = async (): Promise<MIDIDevice[]> => {
  try {
    if (!navigator.requestMIDIAccess) {
      throw new Error('Web MIDI API not supported');
    }

    const midiAccess = await navigator.requestMIDIAccess();
    const devices: MIDIDevice[] = [];

    // Get input devices
    midiAccess.inputs.forEach(input => {
      devices.push({
        id: input.id,
        name: input.name || `MIDI Input ${input.id.slice(0, 4)}`,
        isInput: true,
        isOutput: false
      });
    });

    // Get output devices
    midiAccess.outputs.forEach(output => {
      devices.push({
        id: output.id,
        name: output.name || `MIDI Output ${output.id.slice(0, 4)}`,
        isInput: false,
        isOutput: true
      });
    });

    return devices;
  } catch (err) {
    console.error('Error scanning MIDI devices:', err);
    return [];
  }
};

export const setupAudioDevice = async (deviceId: string, isInput: boolean): Promise<boolean> => {
  try {
    // Try native bridge first
    const nativeResult = await nativeBridge.setupDevice(deviceId);
    if (nativeResult) return true;

    // Fallback to Web Audio API
    if (!audioContext) {
      throw new Error('Audio context not initialized');
    }

    if (isInput) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId }
        }
      });
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(audioContext.destination);
    } else {
      const audioElement = document.createElement('audio');
      if ('setSinkId' in audioElement) {
        await (audioElement as any).setSinkId(deviceId);
      }
    }

    return true;
  } catch (err) {
    console.error('Error setting up audio device:', err);
    return false;
  }
};
