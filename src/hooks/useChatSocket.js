import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { CHAT_SOCKET_URL } from '@env'; // URL del socket definida en variables de entorno

// Hook personalizado para manejar la conexión de socket para un chat
const useChatSocket = (userId, otherUserId, username) => {
  const [messages, setMessages] = useState([]); // Estado para almacenar los mensajes recibidos
  const socketRef = useRef(null); // Referencia persistente al socket para evitar reconexiones innecesarias

  // Inicializa la conexión al servidor de sockets con autenticación personalizada
  useEffect(() => {
    const socket = io(CHAT_SOCKET_URL, {
      auth: { userId, otherUserId, username },
    });

    // Guarda la referencia al socket en la referencia persistente
    socketRef.current = socket;

    // Evento cuando se conecta exitosamente al servidor
    socket.on('connect', () => {
      console.log('Conectado al chat');
    });

    // Escucha los mensajes entrantes desde el servidor
    socket.on('chat message', (msg, serverOffset, senderUsername) => {
      console.log(`[Cliente] Nuevo mensaje de ${senderUsername}: ${msg.message}`);

      // Actualiza el estado con el nuevo mensaje recibido
      setMessages((prevMessages) => [
        ...prevMessages,
        { msg, 
          user: senderUsername,
          timestamp: msg.timestamp, 
        },
      ]);
    });
    // Limpia la conexión al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [userId, otherUserId, username]); // Se vuelve a ejecutar si cambian estos valores

  // Función para enviar un mensaje a través del socket
  const sendMessage = (message) => {
    if (socketRef.current) {
      const messagePayload = {
        message,
        from: userId,
        to: otherUserId,
        username,
        timestamp: Date.now(), 
      };
      
  
      socketRef.current.emit('chat message', messagePayload);
    }
  };
  
  // Devuelve los mensajes y la función para enviar mensajes
  return { messages, sendMessage };
};

export default useChatSocket;
