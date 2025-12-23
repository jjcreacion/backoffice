"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  const initializing = useRef(false);

  const initDevice = useCallback(async (agentId: string) => {
    if (typeof window === 'undefined' || device || initializing.current) return;

    initializing.current = true;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VOICE_SERVICE_URL}/call/token?agentId=${agentId}`);
      
      if (!response.ok) throw new Error('Error al obtener el token del servidor');

      const data = await response.json();
      
      const token = typeof data === 'object' ? data.token : data;

      if (!token || typeof token !== 'string') {
        throw new Error('El formato del token recibido es inválido');
      }

      console.log('Token recibido y procesado correctamente');

      // --- INICIALIZACIÓN DEL DISPOSITIVO ---
      const newDevice = new Device(token, {
        logLevel: 'debug',
        codecPreferences: ['opus', 'pcmu'] as any,
        enableIceRestart: true,
      });

      // Eventos de registro
      newDevice.on('registered', () => {
        setIsReady(true);
        console.log(' Twilio Device registrado para el agente:', agentId);
      });

      newDevice.on('unregistered', () => {
        setIsReady(false);
        console.log(' Twilio Device desconectado');
      });

      newDevice.on('error', (twError) => {
        console.error(' Twilio Error:', twError.message, twError.code);
        if (twError.code === 31204 || twError.code === 31205) {
          setIsReady(false);
        }
      });

      // Registrar el dispositivo
      newDevice.register();
      setDevice(newDevice);

    } catch (err) {
      console.error('Failed to init Twilio:', err);
    } finally {
      initializing.current = false;
    }
  }, [device]);

  const makeCall = useCallback((number: string) => {
    if (device && isReady) {
      // Limpiar llamadas previas si existen
      if (currentCall) currentCall.disconnect();

      console.log(`Iniciando llamada a: ${number}`);
      const callPromise = device.connect({ params: { To: number } });

      Promise.resolve(callPromise).then((call) => {
        setCurrentCall(call);

        call.on('disconnect', () => {
          console.log('Llamada finalizada (disconnect)');
          setCurrentCall(null);
        });

        call.on('reject', () => {
          console.log('Llamada rechazada');
          setCurrentCall(null);
        });

        call.on('error', (error) => {
          console.error('Error en la llamada:', error);
          setCurrentCall(null);
        });
      });
    }
  }, [device, isReady, currentCall]);

  const hangup = useCallback(() => {
    if (device) {
      device.disconnectAll();
      setCurrentCall(null);
    }
  }, [device]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (device) {
        device.destroy();
      }
    };
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