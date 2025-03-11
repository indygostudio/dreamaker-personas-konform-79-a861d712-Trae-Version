import { supabase } from "@/integrations/supabase/client";
import { nativeBridge } from "@/lib/audio/nativeBridge";
import { databaseService } from "./databaseService";

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

// Audio context singleton
let audioContext: AudioContext | null = null;

/**
 * Service for managing audio devices and operations
 */
export const audioService = {
  /**
   * Initialize the audio context
   * @returns Whether the audio context was initialized
   */
  initializeAudio(): boolean {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing audio context:', error);
      return false;
    }
  },

  /**
   * Get the audio context
   * @returns The audio context or null if not initialized
   */
  getAudioContext(): AudioContext | null {
    return audioContext;
  },

  /**
   * Scan for available audio devices
   * @returns List of audio devices
   */
  async scanAudioDevices(): Promise<AudioDevice[]> {
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

      // Map devices to our format
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
      await this.storeAudioDevices(formattedDevices);

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
  },

  /**
   * Store audio devices in the database
   * @param devices Devices to store
   */
  async storeAudioDevices(devices: any[]): Promise<void> {
    try {
      for (const device of devices) {
        await databaseService.executeQuery(
          () => supabase
            .from('audio_device_info')
            .upsert(device, { onConflict: 'device_id' }),
          { errorMessage: `Error storing audio device: ${device.name}` }
        );
      }
    } catch (error) {
      console.error('Error storing audio devices:', error);
    }
  },

  /**
   * Scan for available MIDI devices
   * @returns List of MIDI devices
   */
  async scanMIDIDevices(): Promise<MIDIDevice[]> {
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
  },

  /**
   * Set up an audio device for input or output
   * @param deviceId Device ID to set up
   * @param isInput Whether the device is an input device
   * @returns Whether the setup was successful
   */
  async setupAudioDevice(deviceId: string, isInput: boolean): Promise<boolean> {
    try {
      // Try native bridge first
      const nativeResult = await nativeBridge.setupDevice(deviceId);
      if (nativeResult) return true;

      // Fallback to Web Audio API
      if (!audioContext) {
        this.initializeAudio();
        if (!audioContext) {
          throw new Error('Audio context could not be initialized');
        }
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
        } else {
          console.warn('Audio output device selection not supported in this browser');
        }
      }

      // Update last used timestamp in database
      await databaseService.executeQuery(
        () => supabase
          .from('audio_device_info')
          .update({ last_used: new Date().toISOString() })
          .eq('device_id', deviceId),
        { throwOnError: false }
      );

      return true;
    } catch (err) {
      console.error('Error setting up audio device:', err);
      return false;
    }
  },

  /**
   * Get recently used audio devices
   * @param limit Maximum number of devices to return
   * @param isInput Whether to get input or output devices
   * @returns List of recently used devices
   */
  async getRecentDevices(limit = 5, isInput?: boolean): Promise<AudioDevice[]> {
    try {
      let query = supabase
        .from('audio_device_info')
        .select('*')
        .order('last_used', { ascending: false })
        .limit(limit);
      
      if (isInput !== undefined) {
        query = query.eq('is_input', isInput);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(device => ({
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
      console.error('Error getting recent devices:', err);
      return [];
    }
  }
};