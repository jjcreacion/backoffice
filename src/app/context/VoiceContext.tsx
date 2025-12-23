"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Device, Call } from '@twilio/voice-sdk';

interface VoiceContextType {
  device: Device | null;
  currentCall: Call | null;
  isReady: boolean;
  initDevice: (agentId: string) => Promise<void>;
  makeCall: (number: string) => void;
  hangup: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<Device | null>(null);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initDevice = useCallback(async (agentId: string) => {
    if (device) return; 

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VOICE_SERVICE_URL}/call/token?agentId=${agentId}`);
      const token = await response.text();

      const newDevice = new Device(token, {
        logLevel: 'debug',
        codecPreferences: [Device.Codec.Opus, Device.Codec.PCMU],
      });

      newDevice.on('registered', () => {
        setIsReady(true);
        console.log('Twilio Device Registered');
      });

      newDevice.on('error', (error) => {
        console.error('Twilio Device Error:', error);
      });

      await newDevice.register();
      setDevice(newDevice);
    } catch (err) {
      console.error('Failed to init Twilio:', err);
    }
  }, [device]);

  const makeCall = useCallback((number: string) => {
    if (device && isReady) {
      const call = device.connect({ params: { To: number } });
      
      call.then((c) => {
        setCurrentCall(c);
        c.on('disconnect', () => setCurrentCall(null));
      });
    }
  }, [device, isReady]);

  const hangup = useCallback(() => {
    if (device) {
      device.disconnectAll();
      setCurrentCall(null);
    }
  }, [device]);

  return (
    <VoiceContext.Provider value={{ device, currentCall, isReady, initDevice, makeCall, hangup }}>
      {children}
    </VoiceContext.Provider>
  );
}

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within a VoiceProvider');
  return context;
};