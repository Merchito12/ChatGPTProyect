import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from './context/authcontext/authcontext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Slot para renderizar las rutas */}
      <Slot />
    </AuthProvider>
  );
}
