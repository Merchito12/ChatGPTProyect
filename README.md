# Proyecto replica de CHATGPT

## Descripción
Este proyecto es una aplicación basada en ChatGPT que utiliza la API de Gemini para generar respuestas de IA en tiempo real dentro de un entorno de chat. La aplicación se desarrolla con **React**, **Expo Go** y **Expo Router**. Se conecta a **Firebase** para la gestión de usuarios y almacenamiento de datos, y utiliza contextos para envolver al aplicativo con la información de autenticación y estado global.

## Características
- **Interfaz de Chat Interactiva**: La aplicación permite al usuario interactuar con un modelo de IA mediante un chat en tiempo real, obteniendo respuestas generadas por la API de Gemini.
- **Autenticación de Usuarios**: Los usuarios pueden registrarse, iniciar sesión y gestionar su cuenta a través de Firebase Authentication.
- **Base de Datos en Firebase**: La información del usuario, como mensajes y configuraciones, se almacena en **Firebase Firestore**.
- **Contextos Globales**: Se implementaron contextos para gestionar el estado de la autenticación y la información relevante para la aplicación.
- **Navegación con Expo Router**: Se utilizó Expo Router para la navegación entre diferentes pantallas dentro de la aplicación.

## Tecnologías Utilizadas
- **React**: La biblioteca principal para la construcción de la interfaz de usuario.
- **Expo Go**: El entorno de desarrollo para crear y probar aplicaciones móviles con React Native.
- **Expo Router**: Sistema de navegación para manejar las rutas de la aplicación de manera eficiente.
- **API de Gemini**: Se usa para obtener respuestas de inteligencia artificial para el chat.
- **Firebase**: Plataforma que proporciona servicios de autenticación y base de datos en tiempo real.
- **Context API**: Utilizada para manejar el estado global, como la información del usuario autenticado.
