import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authcontext/authcontext';
import { db } from '../utils/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore/lite';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Formato de correo inválido');
      return;
    }

    if (password.length <= 6) {
      setError('La contraseña debe tener más de 6 caracteres');
      return;
    }

    try {
      const userCredential = await signup(email, password);
      const uid = userCredential.user.uid;

      await addDoc(collection(db, 'users'), {
        uid: uid,
        email: email,
        created_at: new Date(),
      });

      router.replace('../main/dashboard');
    } catch (err) {

      setError('Error al registrarse, intente de nuevo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Registrarse" onPress={handleSignup} />
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
});
