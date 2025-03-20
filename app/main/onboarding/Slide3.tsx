import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

export default function Slide2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Listo para comenzar!</Text>
      <Text style={styles.subtitle}>Sigue estos pasos para comenzar a usar ChatGPT</Text>

      <Text style={styles.icon}>🚀</Text>
      <Text style={styles.instructionsTitle}>Instrucciones</Text>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>1. Crea una cuenta o inicia sesión</Text>
        <Text style={styles.instructionText}>2. Haz tu primera pregunta</Text>
        <Text style={styles.instructionText}>3. ¡Disfruta interactuando con ChatGPT!</Text>
      </View>

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => router.push('../chat')}
      >
        <Text style={styles.nextButtonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#343541', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 40 },
  icon: { fontSize: 30, color: 'white', marginBottom: 10 },
  instructionsTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  instructionsContainer: { width: '100%', alignItems: 'center' },
  instructionText: { backgroundColor: '#3C4043', color: 'white', padding: 15, borderRadius: 10, width: '100%', textAlign: 'center', marginBottom: 10 },
  nextButton: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 80, borderRadius: 30, marginTop: 20 },
  nextButtonText: { color: 'white', fontWeight: 'bold' }
});
