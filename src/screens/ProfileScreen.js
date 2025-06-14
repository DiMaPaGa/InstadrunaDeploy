import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // libreria para navegar entre pantallas
import * as ImagePicker from 'expo-image-picker'; // libreria para acceder a la cámara y galería

import { 
  CLOUDINARY_UPLOAD_PRESET, 
  CLOUDINARY_CLOUD_NAME, 
  API_URL 
} from '@env';

// Componente principal de la pantalla de perfil
const ProfileScreen = ({ route, onLogout }) => {
  // Extraemos datos del usuario pasados por navegación
  const { userId, givenName, email, profileImageUrl } = route.params || {};

  // Estados para gestionar la vista
  const [viewLikes, setViewLikes] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(profileImageUrl || null);
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seguidores, setSeguidores] = useState(0);
  const [seguidos, setSeguidos] = useState(0);

  const navigation = useNavigation();

  // Solicitar permisos al iniciar la pantalla
  useEffect(() => {
    const getPermissions = async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    };
    getPermissions();
  }, []);

  // Mostrar menú para elegir entre cámara o galería
  const handleImagePick = async () => {
    // Mostrar un Alert para elegir entre cámara o galería
    Alert.alert(
      "Selecciona una opción",
      "Elige una opción para subir tu foto de perfil:",
      [
        {
          text: "Cámara",
          onPress: () => pickImageFromCamera(),
        },
        {
          text: "Galería",
          onPress: () => pickImageFromGallery(),
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  // Seleccionar imagen desde galería
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        await uploadImageToCloudinary(result.assets[0].uri);
      } else {
        Alert.alert('Acción cancelada', 'No se seleccionó ninguna imagen.');
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error', 'No se pudo abrir la galería.');
    }
  };

  // Tomar foto con la cámara
  const pickImageFromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        await uploadImageToCloudinary(result.assets[0].uri);
      } else {
        Alert.alert('Acción cancelada', 'No se tomó ninguna foto.');
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      Alert.alert('Error', 'No se pudo abrir la cámara.');
    }
  };

  // Subir imagen a Cloudinary
  const uploadImageToCloudinary = async (imageUri) => {
    const formData = new FormData();
    formData.append('file', { uri: imageUri, name: 'image.jpg', type: 'image/jpeg' });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const imageUrl = data.secure_url;
      await updateProfileImage(imageUrl);
    } catch (error) {
      Alert.alert('Error', 'No se pudo subir la imagen.');
    }
  };

  // Actualizar imagen en el backend
  const updateProfileImage = async (imageUrl) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_picture: imageUrl }),
      });

      if (response.ok) {
        setProfileImage(imageUrl);
        navigation.setParams({ profileImageUrl: imageUrl });
        fetchUserData(); // Recargar los datos del usuario después de la actualización
      } else {
        Alert.alert('Error', 'No se pudo actualizar la imagen del perfil.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar la imagen.');
    }
  };

  // Obtener datos del usuario y sus publicaciones
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);

      // Obtener info del usuario
      const userResponse = await fetch(`${API_URL}/usuarios/${userId}`);
      const userData = await userResponse.json();
  
      if (userData.profileImageUrl) {
        setProfileImage(userData.profileImageUrl);
        navigation.setParams({ profileImageUrl: userData.profileImageUrl });
      }
  
      // Obtener publicaciones
      const postsResponse = await fetch(`${API_URL}/publicaciones/user/${userId}`);
      const postsData = await postsResponse.json();
      if (Array.isArray(postsData)) {
        setPosts(postsData.reverse());
      }
  
      // Obtener publicaciones que le gustaron
      const likedPostsResponse = await fetch(`${API_URL}/publicaciones/likes/${userId}`);
      const likedPostsData = await likedPostsResponse.json();
      if (Array.isArray(likedPostsData)) {
        setLikedPosts(likedPostsData.reverse());
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
    } finally {
      setLoading(false);
    }
  }, [userId, navigation]);

  // Obtener conteo de seguidores y seguidos
  const obtenerConteos = async () => {
    try {
      const [resSeguidores, resSeguidos] = await Promise.all([
        fetch(`${API_URL}/seguidores/contar-seguidores/${userId}?estado=ACEPTADO`),
        fetch(`${API_URL}/seguidores/contar-seguidos/${userId}?estado=ACEPTADO`)
      ]);
  
      const totalSeguidores = await resSeguidores.json();
      const totalSeguidos = await resSeguidos.json();
  
      setSeguidores(totalSeguidores);
      setSeguidos(totalSeguidos);
    } catch (error) {
      console.error("Error al obtener los conteos:", error);
    }
  };
  
  // Cargar datos cada vez que se enfoca esta pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
      obtenerConteos();
    });
    return unsubscribe;
  }, [fetchUserData, navigation]);

  // Mostrar spinner mientras carga
  if (loading) {
    return <ActivityIndicator size="large" color="#33c4ff" />;
  }

  // Render de la pantalla principal del perfil
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/images/iconUser.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.stats}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>Publicaciones</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statNumber}>{seguidores}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statNumber}>{seguidos}</Text>
          <Text style={styles.statLabel}>Siguiendo</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => setShowLogout(!showLogout)}>
        <Text style={styles.username}>{givenName}</Text>
      </TouchableOpacity>
      {showLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.email}>{email}</Text>

      <View style={styles.filterButtons}>
        <TouchableOpacity onPress={() => setViewLikes(false)}>
          <Image source={require('../../assets/images/ViewPub.png')} style={[styles.icon, !viewLikes && styles.activeIcon]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewLikes(true)}>
          <Image source={require('../../assets/images/PubGustan.png')} style={[styles.icon, viewLikes && styles.activeIcon]} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={viewLikes ? likedPosts : posts}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SinglePublication', {
                id: item.id,
                userInfo: { userId, givenName, profileImage },
              })
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContentContainer}
      />
    </View>
  );
};

// Estilos personalizados
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#23272A', padding: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 },
  profileImage: { width: 80, height: 80, borderRadius: 50, borderWidth: 3, borderColor: '#33c4ff' },
  stats: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#DFDFDF' },
  statLabel: { fontSize: 12, color: '#868686' },
  username: { textAlign: 'left', paddingHorizontal: '5%', fontSize: 20, fontWeight: 'bold', color: '#33c4ff' },
  email: { textAlign: 'left', paddingHorizontal: '5%', fontSize: 14, color: '#868686', textDecorationLine: 'underline' },
  filterButtons: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  icon: { width: 30, height: 30, marginHorizontal: 20 },
  postImage: { width: 120, height: 120, margin: 2, borderWidth: 1, borderColor: '#DFDFDF' },
  activeIcon: { tintColor: '#33c4ff' },
  flatListContentContainer: { paddingBottom: '15%' },
  logoutButton: { backgroundColor: '#ff4d4d', padding: 10, borderRadius: 5, marginTop: 10, alignSelf: 'center' },
  logoutText: { color: '#DFDFDF', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;





