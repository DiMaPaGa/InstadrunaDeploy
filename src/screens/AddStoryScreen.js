import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // libreria para acceder a la cámara y galería 
import { useNavigation } from '@react-navigation/native'; // libreria para navegar entre pantallas
import { Dimensions } from 'react-native'; // libreria para obtener el ancho de la pantalla
import { 
  STORIES_API_URL, 
  CLOUDINARY_UPLOAD_PRESET, 
  CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_UPLOAD_URL} from '@env';

const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - 60) / 3; // Tamaño de cada imagen para mostrar en grid

// Componente principal para crear una historia
const AddStoryScreen = ({ route }) => {
  const { userId } = route.params || {}; // ID numérico del usuario recibido por parámetros
  const navigation = useNavigation();
  const [images, setImages] = useState([]); // Almacena las URIs de las imágenes seleccionadas
  const [text, setText] = useState(''); // Texto (opcional)
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  // Verifica si se obtuvo el ID del usuario
  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "No se pudo obtener la información del usuario.");
      navigation.goBack(); // Vuelve atrás si no hay usuario
    }
  }, [userId]);

  // Solicita permisos para acceder a la galería
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permisos de galería:", status);
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la galería.');
      }
    })();
  }, []);
  
  // Permite seleccionar varias imagenes
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1
    });

    if (!result.canceled) {
      const selected = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...selected]);
    }
  };

  // Sube una imagen a Cloudinary
  const uploadToCloudinary = async (uri) => {
    const formData = new FormData();
    formData.append('file', { uri, name: 'image.jpg', type: 'image/jpeg' });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // Retorna la URL segura
  };

  // Maneja el envío de la historia
  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert('Error', 'Selecciona al menos una imagen');
      return;
    }

    setIsLoading(true);
    try {
      const uploadedUrls = await Promise.all(images.map(uploadToCloudinary));

      const payload = {
        usuarioId: String(userId),
        imagenes: uploadedUrls.map((url, index) => ({
          imagenUrl: url,
          texto: text || '',
          orden: index // Mantiene el orden de las imágenes
        }))
      };

      const res = await fetch(STORIES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const contentType = res.headers.get('content-type');
      
      if (res.ok) {
        let responseData = {};
        if (contentType && contentType.includes('application/json')) {
          responseData = await res.json();
          console.log('Respuesta JSON:', responseData);
        } else {
          const text = await res.text();
          console.log('Respuesta no JSON:', text);  // Si no es JSON, lo maneja como texto
        }
      
        Alert.alert('Éxito', 'Historia publicada');
        setImages([]); // Limpia campos
        setText('');
        navigation.navigate('Main', { userId });
      } else {
        const errorText = await res.text();
        console.error('Error en respuesta:', errorText);
        Alert.alert('Error', errorText || 'No se pudo subir la historia');
      }
        } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo subir la historia');
        } finally {
        setIsLoading(false); // Termina carga
        }
  };
  // Renderizado de la pantalla de creación de historia
  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Nueva Historia</Text>

      <TouchableOpacity onPress={pickImages} style={styles.uploadBtn}>
        <Text style={styles.uploadBtnText}>Seleccionar Imágenes</Text>
      </TouchableOpacity>

      <View style={styles.previewContainer}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.previewImage} resizeMode="cover"/>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Texto opcional (se aplicará a todas las imágenes)"
        placeholderTextColor="#AAA"
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Publicar Historia</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#23272A',
    flexGrow: 1,
  },
  header: {
    color: '#33c4ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadBtn: {
    backgroundColor: '#33c4ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  previewContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 15,
  marginBottom: 25,
  },
  previewImage: {
  width: imageSize,
  height: imageSize,
  margin: 5,
  borderRadius: 8,
  backgroundColor: '#333',
  },
  input: {
    backgroundColor: '#323639',
    color: '#DFDFDF',
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#33c4ff',
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default AddStoryScreen;
