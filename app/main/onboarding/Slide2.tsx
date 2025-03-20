import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

export default function Slide1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a ChatGPT pues parce</Text>
      <Text style={styles.subtitle}>Haz cualquier pregunta, recibe tu respuesta</Text>

      <Text style={styles.icon}>🌞</Text>
      <Text style={styles.examplesTitle}>Capacidades</Text>

      <View style={styles.examplesContainer}>
        <Text style={styles.exampleText}>“Recuerda lo que el usuario dijo anteriormente en la conversación”</Text>
        <Text style={styles.exampleText}>“Permite al usuario proporcionar correcciones de seguimiento”</Text>
        <Text style={styles.exampleText}>“Entrenado para rechazar solicitudes inapropiadas”</Text>
      </View>

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => router.push('/main/onboarding/Slide3')}
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#343541', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 40 },
  icon: { fontSize: 30, color: 'white', marginBottom: 10 },
  examplesTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  examplesContainer: { width: '100%', alignItems: 'center' },
  exampleText: { backgroundColor: '#3C4043', color: 'white', padding: 15, borderRadius: 10, width: '100%', textAlign: 'center', marginBottom: 10 },
  nextButton: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 80, borderRadius: 30, marginTop: 20 },
  nextButtonText: { color: 'white', fontWeight: 'bold' }
});
