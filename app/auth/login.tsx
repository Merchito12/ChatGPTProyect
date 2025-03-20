import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authcontext/authcontext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    setError(false);
    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      await login(email, password);
      router.replace('../main/dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error && <Text style={styles.errorText}>Datos incorrectos</Text>}

      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Ingresar" onPress={handleLogin} />
      <TouchableOpacity onPress={() => router.push('./signup')} style={styles.signupLink}>
        <Text style={styles.signupText}>¿No tienes cuenta?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1E1E1E'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#FFF',
    textAlign: 'center'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  },
  inputError: {
    borderWidth: 2,
    borderColor: 'red'
  },
  signupLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    color: '#FFF',
    textDecorationLine: 'underline'
  }
});
