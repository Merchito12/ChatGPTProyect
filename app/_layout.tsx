import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from './context/authcontext/authcontext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* 
         <Slot> se encargará de renderizar lo que haya en (auth)/_layout.tsx 
         o (main)/_layout.tsx, según la ruta que se visite 
      */}
      <Slot />
    </AuthProvider>
  );
}
