import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      {/* El header se mostrará, pero lo puedes personalizar */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="chat" options={{ title: 'Chat' }} />
      {/* Podrías añadir las slides si quieres un stack screen para cada una */}
      <Stack.Screen name="onboarding/Slide1" options={{ title: 'Onboarding 1' }} />
      <Stack.Screen name="onboarding/Slide2" options={{ title: 'Onboarding 2' }} />
      <Stack.Screen name="onboarding/Slide3" options={{ title: 'Onboarding 3' }} />
    </Stack>
  );
}
