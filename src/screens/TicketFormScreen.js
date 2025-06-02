import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView, View } from 'react-native';
import { useNavigation } from "@react-navigation/native"; // libreria para navegar entre pantallas
import * as ImagePicker from 'expo-image-picker'; // libreria para acceder a la cámara y galería
import * as FileSystem from 'expo-file-system'; 
import { Ionicons } from '@expo/vector-icons'; // libreria para los iconos
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME, API_URL } from '@env';


// Componente principal para crear un nuevo ticket/incidencia
const TicketFormScreen = ({ route }) => {
  // Datos del usuario actual pasados por navegación
  const { userId, givenName, email, picture } = route.params || {};

  const navigation = useNavigation();

  // Estados locales para el formulario y la imagen
  const [equipoClase, setEquipoClase] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  // Función para capturar imagen desde cámara
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  // Subir imagen a Cloudinary y devolver URL segura
const uploadImageToCloudinary = async (uri) => {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    const data = {
      file: `data:image/jpeg;base64,${base64}`,
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
    };
  
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    return result.secure_url;
  };
  
  // Seleccionar imagen desde cámara
  const handlePickImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Se necesita permiso para acceder a la cámara.");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: false });
    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };
  
  // Seleccionar imagen desde galería
  const handlePickImageFromLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Se necesita permiso para acceder a la galería.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5, base64: false });
    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };
  
  // Eliminar imagen seleccionada
  const handleRemoveImage = () => {
    setImageUri(null);
  };
  
  // Enviar el formulario para crear el ticket
  const handleCreateTicket = async () => {
    if (!equipoClase || !titulo || !descripcion) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true);

    let imageUrl = null;

    // Subir imagen si existe
    if (imageUri) {
      imageUrl = await uploadImageToCloudinary(imageUri);
    }

    // Construcción del objeto de ticket
    const ticketData = {
        autor: {
            userId,       
            email,        
            givenName,    
            profileImageUrl: picture  
          },
      equipoClase,
      titulo,
      descripcion,
      imagen: imageUrl || null,
      estado: 'EN_TRAMITE', // Estado inicial del ticket
    };


    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });

    const resText = await response.text();        
    console.log('Respuesta del servidor:', resText);

      if (response.ok) {
        Alert.alert('Éxito', 'Incidencia creada con éxito.');
        // Reset de formulario
        setEquipoClase('');
        setTitulo('');
        setDescripcion('');
        setImageUri(null);
        navigation.goBack(); // Volver a la pantalla anterior
      } else {
        Alert.alert('Error', 'No se pudo crear la incidencia.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al crear la incidencia.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>INCIDENCIA</Text>
       {/* Imagen interactiva */}
       <TouchableOpacity onPress={handlePickImageFromCamera}>
            {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imageIcon} />
            ) : (
            <Image source={require('../../assets/images/logoBlue.png')} style={styles.imageIcon} />
            )}
        </TouchableOpacity>

        {/* Botones secundarios de galería y eliminar */}
        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 20 }}>
            <TouchableOpacity onPress={handlePickImageFromLibrary} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Galería</Text>
            </TouchableOpacity>
            {imageUri && (
            <TouchableOpacity onPress={handleRemoveImage} style={styles.secondaryButton}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={[styles.secondaryButtonText, { marginLeft: 5 }]}>Eliminar</Text>
            </TouchableOpacity>
            )}
        </View>

      {/* Campo: Nº de equipo o clase */}
      <Text style={styles.label}> Nº del Equipo / Clase:</Text>
      <TextInput
        style={styles.input}
        value={equipoClase}
        onChangeText={setEquipoClase}
      />

      {/* Campo: Título (máx 40 caracteres) */}
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        placeholder="Máx. 40 Caracteres"
        placeholderTextColor="#DFDFDF"
        value={titulo}
        onChangeText={(text) => text.length <= 40 && setTitulo(text)}
      />

      {/* Campo: Descripción del problema (máx 250 caracteres) */}
      <Text style={styles.label}>Descripción del problema:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Máx. 250 Caracteres"
        placeholderTextColor="#DFDFDF"
        value={descripcion}
        onChangeText={(text) => text.length <= 250 && setDescripcion(text)}
        multiline
      />

      {/* Botón de enviar ticket */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleCreateTicket}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Enviando...' : 'ENVIAR'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Estilos del componente personalizados
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#23272A',
    padding: 25,
    paddingTop: 50,
    alignItems: 'center',
  },
  header: {
    fontFamily: 'Rajdhani_600SemiBold',
    color: '#33c4ff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageIcon: {
    width: 120,
    height: 120,
    marginBottom: "10%",
    marginTop: "8%",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#33c4ff',
  },
  label: {
    fontFamily: 'Rajdhani_400Regular',
    color: '#33c4ff',
    fontSize: 16,
    marginBottom: "3%",
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#323639',
    color: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: "8%",
    width: '100%',
  },
  textArea: {
    height: 180,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#23272A',
    borderColor: '#33c4ff',
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: "5%",
    width: '50%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#323639',
  },
  secondaryButton: {
    backgroundColor: '#323639',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default TicketFormScreen;
