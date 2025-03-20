import React, { useEffect, useState } from 'react';
import {View,Text,TextInput,FlatList,TouchableOpacity,StyleSheet,SafeAreaView,KeyboardAvoidingView,Platform} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore/lite';
import { db } from '../utils/FirebaseConfig'; // Ajusta la ruta según tu carpeta
import { APIResponse } from '../interfaces/Responses';
import { Message } from '../interfaces/AppInterfaces';
import { useAuth } from '../context/authcontext/authcontext';

const SUGERENCIAS = ['Dime tus 10 canciones favoritas','Cual es tu album favorito?','Recomiéndame una cancion que me de felicidad','Cuéntame un chiste corto','¿Porque terminaste con tu ex?','Haz una cancion de regueton',];

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatTitle, setChatTitle] = useState('Bienvenid@');
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchChat = async () => {
      try {
        const chatRef = doc(db, 'chats', String(id));
        const snapshot = await getDoc(chatRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setChatTitle(data?.title || 'Sin título');
          setMessages(data?.messages || []);
        } else {
          console.log('Chat no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener chat:', error);
      }
    };
    fetchChat();
  }, [id]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('./chat');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const updateChatInFirestore = async (userMessage?: Message, botMessage?: Message) => {
    if (!id) return;
    try {
      const chatRef = doc(db, 'chats', String(id));
      const snapshot = await getDoc(chatRef);
      if (!snapshot.exists()) {
        console.log('Chat no encontrado');
        return;
      }

      const data = snapshot.data();
      const oldMessages = data?.messages || [];
      const newMessages: Message[] = [];
      if (userMessage) newMessages.push(userMessage);
      if (botMessage) newMessages.push(botMessage);

      if (oldMessages.length === 0 && userMessage) {
        const newTitle = userMessage.text.slice(0, 5);
        await updateDoc(chatRef, {
          title: newTitle,
          messages: arrayUnion(...newMessages)
        });
        setChatTitle(newTitle);
      } else {
        await updateDoc(chatRef, {
          messages: arrayUnion(...newMessages)
        });
      }
    } catch (error) {
      console.error('Error actualizando chat:', error);
    }
  };

  const getResponse = async () => {
    if (!userPrompt.trim()) return;

    const originalPrompt = userPrompt;
    const userMessage: Message = {
      text: originalPrompt,
      sender_by: 'Me',
      date: new Date(),
      state: 'viewed'
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserPrompt('');

    try {
      setIsLoading(true);

      const promptferxxo = `Respondeme como si fueras feid: ${originalPrompt}`;
      const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC3CGhhZXZ1TwFNK6aCb4xlg0ARfgBv96Q';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptferxxo }] }]
        })
      });

      const data: APIResponse = await response.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response';

      const botMessage: Message = {
        text: botText,
        sender_by: 'Bot',
        date: new Date(),
        state: 'recived'
      };

      await updateChatInFirestore(userMessage, botMessage);
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log('Error en la petición:', error);
      const errorBotMessage: Message = {
        text: 'Error fetching response.',
        sender_by: 'Bot',
        date: new Date(),
        state: 'recived'
      };
      await updateChatInFirestore(userMessage, errorBotMessage);
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender_by === 'Me';
    return (
      <View style={[styles.msgContainer, isUser ? styles.userMsg : styles.botMsg]}>
        <Text style={styles.msgText}>{item.text}</Text>
      </View>
    );
  };

  const handleSuggestionPress = (suggestion: string) => setUserPrompt(suggestion);

  const handleQuestionPress = () => router.push('./onboarding/Slide1');
  const handleSignUpPress = () => router.push('../auth/login');
  const handleMenuPress = () => router.push('./dashboard');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        {/* ---------- ENCABEZADO ---------- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{chatTitle}</Text>
          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={handleQuestionPress} style={styles.iconContainer}>
              <Text style={styles.iconText}>?</Text>
            </TouchableOpacity>
            {currentUser ? (
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.signUpText}>Cerrar sesión</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSignUpPress}>
                <Text style={styles.signUpText}>Sign up</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleMenuPress} style={styles.iconContainer}>
              <Text style={styles.iconText}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------- LISTA DE MENSAJES ---------- */}
        <View style={styles.messagesContainer}>
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContent}
          />
        </View>

        {/* ---------- ZONA INFERIOR: SUGERENCIAS + INPUT ---------- */}
        <View style={styles.bottomContainer}>
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={SUGERENCIAS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu pregunta"
              placeholderTextColor="#999"
              value={userPrompt}
              onChangeText={setUserPrompt}
            />
            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
              onPress={getResponse}
              disabled={isLoading}
            >
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  // Encabezado
  header: { flexDirection: 'row', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 6, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#EDEDED' },
  headerTitle: { color: '#000000', fontSize: 18, fontWeight: '600' },
  rightButtons: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { paddingHorizontal: 6 },
  iconText: { color: '#000000', fontSize: 18 },
  signUpText: { color: '#FFFFFF', backgroundColor: '#000000', fontSize: 12, fontWeight: 'bold', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, marginHorizontal: 4 },
  // Lista de mensajes
  messagesContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  messagesContent: { paddingHorizontal: 10, paddingVertical: 8 },
  msgContainer: { marginVertical: 4, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, maxWidth: '80%' },
  userMsg: { alignSelf: 'flex-end', backgroundColor: '#EDEDED' },
  botMsg: { alignSelf: 'flex-start', backgroundColor: '#F7F7F7' },
  msgText: { color: '#333', fontSize: 14 },
  // Zona inferior
  bottomContainer: { backgroundColor: '#FFFFFF' },
  suggestionsContainer: { paddingVertical: 6, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EDEDED', backgroundColor: '#FFFFFF' },
  suggestionItem: { backgroundColor: '#F2F2F2', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 4 },
  suggestionText: { color: '#333', fontSize: 13 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 6, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EDEDED' },
  textInput: { flex: 1, backgroundColor: '#F7F7F7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, color: '#333', fontSize: 14 },
  sendButton: { backgroundColor: '#000000', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginLeft: 6 },
  sendButtonDisabled: { backgroundColor: '#CCC' },
  sendButtonText: { color: '#FFF', fontWeight: '600', fontSize: 14 }
});
