import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

// Pantalla para sugerir usuarios con base en una búsqueda
const SuggestedUsersScreen = ({ route }) => {

  const { userId, givenName } = route.params; // Datos del usuario actual
  const navigation = useNavigation();

  // Estados para búsqueda, resultados, paginación y control de carga
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Cada vez que cambia el término de búsqueda, se reinicia la búsqueda
  useEffect(() => {
    buscarUsuarios(true);
  }, [searchTerm]);

  // Función para buscar usuarios (paginada)
  const buscarUsuarios = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    const nombreParam = encodeURIComponent(searchTerm); // Escapa espacios/caracteres especiales
    const pageParam = reset ? 0 : page;

    try {
      // Petición al backend para obtener usuarios según el término
      const res = await fetch(`${API_URL}/usuarios/buscar?nombre=${nombreParam}&page=${pageParam}&size=10`);
      const data = await res.json();

      // Para cada usuario, se determina su estado de relación con el actual
      const usuariosConEstado = await Promise.all(
        data.content.map(async (usuario) => {
          if (usuario.userId === userId) {
            return { ...usuario, estadoSeguidor: 'yo' }; // Eres tú mismo
          }

          // ¿Yo lo sigo?
          const resEstado = await fetch(`${API_URL}/seguidores/es-seguidor?seguidorId=${userId}&seguidoId=${usuario.userId}`);
          const yoLoSigo = await resEstado.json();

          // ¿Él me sigue?
          const resInverso = await fetch(`${API_URL}/seguidores/es-seguidor?seguidorId=${usuario.userId}&seguidoId=${userId}`);
          const elMeSigue = await resInverso.json();

          // Determinar estado mutuo
          if (yoLoSigo && elMeSigue) return { ...usuario, estadoSeguidor: 'seguido_mutuo' };
          if (yoLoSigo && !elMeSigue) return { ...usuario, estadoSeguidor: 'solicitud_enviada' };
          if (!yoLoSigo && elMeSigue) return { ...usuario, estadoSeguidor: 'solicitud_recibida' };
          return { ...usuario, estadoSeguidor: 'no_sigue' };
        })
      );

      // Si es búsqueda nueva, reemplaza; si es scroll, concatena
      if (reset) {
        setUsuarios(usuariosConEstado);
        setPage(1);
      } else {
        setUsuarios((prev) => [...prev, ...usuariosConEstado]);
        setPage((prev) => prev + 1);
      }

      // Si es la última página, ya no hay más que cargar
      setHasMore(!data.last);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Finaliza estado de carga
    }
  };

  // Acción para seguir a un usuario
  const seguirUsuario = async (seguidoId) => {
    await fetch(`${API_URL}/seguidores/seguir?seguidorId=${userId}&seguidoId=${seguidoId}`, {
      method: 'POST',
    });
    buscarUsuarios(true);  // Refrescar lista
  };

  // Acción para dejar de seguir a un usuario
  const dejarDeSeguir = async (seguidoId) => {
    await fetch(`${API_URL}/seguidores/dejar-de-seguir?seguidorId=${userId}&seguidoId=${seguidoId}`, {
      method: 'DELETE',
    });
    buscarUsuarios(true);
  };

  // Aceptar solicitud de seguimiento entrante
  const aceptarSolicitud = async (seguidorId) => {
    await fetch(`${API_URL}/seguidores/aceptar-solicitud?seguidorId=${seguidorId}&seguidoId=${userId}`, {
      method: 'PUT',
    });

    // Solo actualiza el estado del usuario aceptado
    setUsuarios(prevUsuarios =>
      prevUsuarios.map(user =>
        user.userId === seguidorId
          ? { ...user, estadoSeguidor: 'no_sigue' } // el usuario ya te sigue, tú aún no pero te sale sugerencia de seguir
          : user
      )
    );
  };

  // Botón de acción según el estado de la relación
  const renderBotonAccion = (item) => {
    switch (item.estadoSeguidor) {
      case 'yo':
        return <Text style={styles.accionText}>Es tu perfil</Text>;
      case 'seguido_mutuo':
        return (
          <View style={styles.botonDoble}>
            <TouchableOpacity onPress={() => dejarDeSeguir(item.userId)} style={styles.btnRojo}>
              <Text style={styles.btnText}>Dejar de seguir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => iniciarChat(item)} style={styles.btnChat}>
              <Text style={styles.btnText}>Chat</Text>
            </TouchableOpacity>
          </View>
        );
      case 'solicitud_enviada':
        return (
          <TouchableOpacity onPress={() => dejarDeSeguir(item.userId)} style={styles.btnNaranja}>
            <Text style={styles.btnText}>Cancelar solicitud</Text>
          </TouchableOpacity>
        );
      case 'solicitud_recibida':
        return (
          <TouchableOpacity onPress={() => aceptarSolicitud(item.userId)} style={styles.btnVerde}>
            <Text style={styles.btnText}>Aceptar</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity onPress={() => seguirUsuario(item.userId)} style={styles.btnVerde}>
            <Text style={styles.btnText}>Seguir</Text>
          </TouchableOpacity>
        );
    }
  };

  // Render de cada usuario en la lista
  const renderItem = ({ item }) => (
    <View style={styles.usuarioItem}>
      <Image source={{ uri: item.profileImageUrl }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.givenName}</Text>
        <View style={{ width: '100%' }}>
        {renderBotonAccion(item)}
        </View>
      </View>
    </View>
  );

  // Navegar a la pantalla de chat
  const iniciarChat = (usuario) => {
    navigation.navigate('ChatScreen', {
      givenName: usuario.givenName,  // Nombre del usuario con el que chateas
      userId: userId,  // Tu userId
      otherUserId: usuario.userId,  // El userId del usuario con el que vas a chatear
      username: route.params.givenName, // TU nombre
    });
  };

  return (
    <View style={styles.container}>
      {/* Input de búsqueda */}
      <TextInput
        placeholder="Buscar usuarios..."
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text);
          setPage(0);
          setHasMore(true);
        }}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {/* Lista de usuarios */}
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
        onEndReached={() => buscarUsuarios()}
        onEndReachedThreshold={0.3}
        ListFooterComponent={loading && <ActivityIndicator color="#33c4ff" />}
      />
    </View>
  );
};

// Estilos del componente personalizados
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#23272A' },
  input: {
    height: 40,
    backgroundColor: '#323639',  // Fondo input oscuro
    borderRadius: 20,
    paddingHorizontal: 20,
    color: '#DFDFDF',
    fontSize: 16,
    marginBottom: 10,
    shadowColor: '#33c4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  usuarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#33c4ff',
  },
  nombre: {
    fontWeight: 'bold',
    color: '#DFDFDF', 
  },
  btnVerde: {
    marginTop: 4,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnRojo: {
    marginTop: 4,
    backgroundColor: '#F10000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    width: '48%',

  },
  btnNaranja: {
    marginTop: 4,
    backgroundColor: '#F19100',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  botonDoble: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
    alignItems: 'center',
    flex: 1,
  },
  
  btnChat: {
    backgroundColor: '#6A1B9A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    width: '48%',

  },
  btnText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  accionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
});

export default SuggestedUsersScreen;
