import React, { useEffect } from 'react';
import { View, Image, Text } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  // Navegar automáticamente después de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('./main/chat');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (// Pantalla de inicio: logo y nombre 
    <View
      style={{ backgroundColor: "#343541", flex: 1, justifyContent: "center", alignItems: "center", }}>
     
     <Image source={require('../assets/images/Icono.png')}
        style={{width: 150,height: 150,marginBottom: 30,}}/>
      <Text style={{color: 'white', fontSize: 28,fontWeight: 'bold',marginBottom: 50}}>ChatGPT</Text>
    </View>
  );
}
