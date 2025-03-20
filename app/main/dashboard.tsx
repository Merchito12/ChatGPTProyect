import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authcontext/authcontext';
import { db } from '../utils/FirebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore/lite';

interface ChatData {
  id: string;
  title: string;
  userId: string;
  messages?: any[];
  created_at?: any;
}

export default function Dashboard() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [chats, setChats] = useState<ChatData[]>([]);

  // Cargar los chats asociados al usuario
  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      try {
        const q = query(
          collection(db, 'chats'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const userChats: ChatData[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatData[];

        setChats(userChats);
      } catch (error) {
        console.error('Error al obtener chats:', error);
      }
    };

    fetchChats();
  }, [currentUser]);

  // Crear un nuevo chat y redirigir a la pantalla de chat
  const handleNewChat = async () => {
    if (!currentUser) return;

    try {
      // Crea el chat con título "Nuevo Chat" (luego se actualizará cuando se envíe el primer mensaje)
      const docRef = await addDoc(collection(db, 'chats'), {
        title: 'Nuevo Chat',
        userId: currentUser.uid,
        messages: [],
        created_at: new Date(),
      });
      console.log('Chat creado con ID:', docRef.id);

      // Actualiza la lista local (opcional) y redirige al chat recién creado
      setChats(prev => [
        ...prev,
        {
          id: docRef.id,
          title: 'Nuevo Chat',
          userId: currentUser.uid,
          messages: [],
          created_at: new Date(),
        },
      ]);
      router.push(`./chat?id=${docRef.id}`);
    } catch (error) {
      console.error('Error al crear chat:', error);
    }
  };

  // Cerrar sesión y redirigir a la pantalla de login
  const handleLogout = async () => {
    await logout();
    router.replace('./chat');
  };

  // Redirigir al formulario de registro
  const handleSignUp = () => {
    router.push('../auth/login'); // Asegúrate de que esta ruta esté configurada
  };

  const renderChatItem = ({ item }: { item: ChatData }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => {
        // Navegar a la pantalla de Chat, pasando el ID del chat
        router.push(`./chat?id=${item.id}`);
      }}
    >
      <Text style={styles.chatTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      {currentUser ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Bienvenido: {currentUser?.email}
            </Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Botón para crear chat */}
          <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
            <Text style={styles.newChatText}>Crear Nuevo Chat</Text>
          </TouchableOpacity>

          {/* Lista de chats */}
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
          />
        </>
      ) : (
        <>
          {/* Botón para ir a la pantalla de registro */}
          <TouchableOpacity style={styles.newChatButton} onPress={handleSignUp}>
            <Text style={styles.newChatText}>Log In</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E1E', paddingTop: 40, paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  headerText: { color: 'white', fontSize: 16, marginBottom: 10 },
  logoutButton: { backgroundColor: '#444', padding: 10, borderRadius: 5, alignSelf: 'flex-start' },
  logoutText: { color: '#FFF' },
  newChatButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5, marginBottom: 20 },
  newChatText: { color: '#FFF', textAlign: 'center', fontSize: 16 },
  chatItem: { backgroundColor: '#2C2C2C', padding: 15, borderRadius: 5, marginVertical: 5 },
  chatTitle: { color: 'white', fontSize: 16 }
});
