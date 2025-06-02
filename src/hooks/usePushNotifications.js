import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configuración básica de cómo se mostrarán las notificaciones si la app está abierta
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  
  // Hook personalizado para gestionar notificaciones push
  export function usePushNotifications() {
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        // Función interna que registra el dispositivo y obtiene el token
      const getPushToken = async () => {
          try {
              const token = await registerForPushNotificationsAsync();
              if (token) {
                  setExpoPushToken(token);
              }
          } catch (err) {
              console.error('Error obteniendo el token de push:', err);
              setError(err.message);
          }
      };

      getPushToken(); // Llama a la función al montar el componente
  }, []);
  // Devuelve el token y cualquier error ocurrido
  return { expoPushToken, error };
}

// Función auxiliar que gestiona permisos y obtiene el token de notificación
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) { // Asegura que se está en un dispositivo físico
    // Obtiene permisos existentes
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Si no está concedido, solicita permiso
      if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
      }

      // Si no se otorgan permisos, lanza error
      if (finalStatus !== 'granted') {
          throw new Error('¡Se necesitan permisos para recibir notificaciones!');
      }

      // Obtiene el token de push proporcionado por Expo
      token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    // Si no es un dispositivo físico (por ejemplo, un emulador), lanza error
      throw new Error('¡Debes usar un dispositivo físico para recibir notificaciones push!');
  }

  // Configura canal de notificaciones en Android (requerido)
  if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
      });
  }
  // Devuelve el token obtenido
  return token;
}

export default usePushNotifications;