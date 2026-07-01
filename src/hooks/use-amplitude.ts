import { useContext } from 'react';
import { AmplitudeContext } from '@/context/amplitude';

export function useAmplitudeContext() {
  const context = useContext(AmplitudeContext);
  if (context === undefined) {
    throw new Error('useAmplitudeContext must be used within a AmplitudeContextProvider');
  }
  return context;
}
