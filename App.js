import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StackNavigator from "./src/screens/navigation/StackNavigator"; 
import LoginScreen from "./src/screens/LoginScreen";
import usePushNotifications from "./src/hooks/usePushNotifications";
import {
  API_URL,
  USER_API_URL,
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID
} from '@env';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  const { expoPushToken } = usePushNotifications();

  // UseEffect para registrar el dispositivo una vez que tenemos el token de notificación y el usuario
  useEffect(() => {
    if (expoPushToken && userInfo?.userId) {
      registerDeviceWithBackend(userInfo.userId); // Registrar dispositivo con el expoPushToken
    } else {
      console.warn("El expoPushToken o el ID del usuario aún no están disponibles.");
    }
  }, [expoPushToken, userInfo]); // Asegúrate de que se ejecute cuando expoPushToken o userInfo cambien

  // Manejo de la respuesta de autenticación de Google
  useEffect(() => {
    handleAuthResponse(response);
  }, [response]);

  // Cargar usuario local de AsyncStorage
  useEffect(() => {
    const checkUser = async () => {
      const user = await getLocalUser();
      if (user) {
        setUserInfo(user);
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  // Función para obtener el usuario desde AsyncStorage
  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    const parsed = JSON.parse(data);
    console.log("Usuario recuperado de AsyncStorage:", parsed);
    if (!parsed.userId || !parsed.givenName) {
      console.warn("Usuario local inválido:", parsed);
      return null;
    }
    return parsed;
  };

  // Función para registrar un usuario con el backend
  const registerUserWithBackend = async (user) => {
    try {
      console.log("Enviando solicitud POST a backend...");
      console.log("Datos del usuario:", {
        userId: user.id,
        email: user.email,
        givenName: user.given_name,
        profileImageUrl: user.picture,
      });

      const response = await fetch(`${USER_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          givenName: user.given_name,
          profileImageUrl: user.picture,
        }),
      });

      console.log("Respuesta del backend:", response);
      if (!response.ok) {
        throw new Error(`Error al registrar usuario: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Usuario registrado:', responseData);

      return responseData;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al registrar usuario: ' + error.message); // Alerta en la app para ver el error
    }
  };

  // Función para registrar el dispositivo con el backend
  const registerDeviceWithBackend = async (userId) => {
    try {
      // Primero, comprobamos si hay un expoPushToken
      if (!expoPushToken) {
        console.log("No hay expoPushToken, no se puede registrar el dispositivo.");
        return;
      }

      console.log("userId:", userId);
      console.log("expoPushToken:", expoPushToken);
      // Hacer una llamada POST para registrar el dispositivo
      const response = await fetch(`${API_URL}/dispositivos/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          expoPushId: expoPushToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al registrar dispositivo:", errorText);
        throw new Error(`Error al registrar dispositivo: ${errorText}`);
      }

      const deviceData = await response.json();
      console.log('Dispositivo registrado:', deviceData);


    } catch (error) {
      console.error('Error al registrar dispositivo:', error.message);
      alert('Error al registrar dispositivo: ' + error.message);
    }
  };

  
  // Manejo de la respuesta de la autenticación de Google
  const handleAuthResponse = async (response) => {
    if (response?.type === "success") {
      const token = response.authentication.accessToken;
      const user = await getUserInfo(token);

      // Registra el usuario primero
      const adaptedUser = await registerUserWithBackend(user);
      console.log("Usuario adaptado:", adaptedUser);

      // Guarda el usuario en AsyncStorage y en el estado
      await AsyncStorage.setItem("@user", JSON.stringify(adaptedUser));
      setUserInfo(adaptedUser);

      // Ahora que userInfo está disponible, registra el dispositivo
      await registerDeviceWithBackend(adaptedUser.userId);
    }
  };

  // Función para obtener la información del usuario desde la API de Google
  const getUserInfo = async (token) => {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  };

  // Función para cerrar sesión y eliminar el usuario del almacenamiento
  const handleLogout = async () => {
    await AsyncStorage.removeItem("@user");
    setUserInfo(null);
  };

  // Si la aplicación está cargando, muestra un indicador de carga
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <>
      {userInfo ? (
        <StackNavigator
          userInfo={userInfo}
          onLogout={handleLogout}
          promptAsync={promptAsync}
          request={request}
        />
      ) : (
        <LoginScreen promptAsync={promptAsync} request={request} />
      )}
    </>
  );
}
