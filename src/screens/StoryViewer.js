import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // libreria para navegar entre pantallas
import { Ionicons } from '@expo/vector-icons'; // libreria para los iconos

// Obtener dimensiones de pantalla
const { width, height } = Dimensions.get('window');

// Duración por defecto de cada historia en milisegundos
const STORY_DURATION = 3000;

// Componente principal para la vista de la historia seleccionada
const StoryViewer = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { story } = route.params ?? {}; // Historia recibida por parámetros

  const flatListRef = useRef(null); // Referencia a la FlatList para controlar el scroll
  const [currentIndex, setCurrentIndex] = useState(0); // Índice actual de la historia mostrada
  const [isPaused, setIsPaused] = useState(false); // Controla si el temporizador está pausado

  // Animaciones para la barra de progreso y transiciones
  const progress = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageFadeAnim = useRef(new Animated.Value(1)).current;

  // Animación de entrada del encabezado (autor, título)
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Control del temporizador para pasar a la siguiente imagen automáticamente
  useEffect(() => {
    if (!story || !Array.isArray(story.imagenesUrls) || story.imagenesUrls.length <= 1) return;
  
    let animation;
  
    if (!isPaused) {
      progress.setValue(0);
  
      animation = Animated.timing(progress, {
        toValue: 1,
        duration: STORY_DURATION,
        useNativeDriver: false,
      });
  
      // Al finalizar la animación, pasar a la siguiente imagen
      animation.start(({ finished }) => {
        if (finished && !isPaused) {
          const nextIndex = (currentIndex + 1) % story.imagenesUrls.length;
          setCurrentIndex(nextIndex);
          flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }
      });
    }
  
    return () => {
      if (animation) {
        animation.stop(); // Detener animación al desmontar o actualizar
      }
    };
  }, [currentIndex, isPaused, story]);

  // Animación de fundido entre imágenes al cambiar de índice
  useEffect(() => {
    imageFadeAnim.setValue(0);
    Animated.timing(imageFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  // Regresa a la pantalla anterior
  const handleBack = () => navigation.goBack();

  // Si no hay historia cargada, mostrar mensaje de error
  if (!story) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró la historia.</Text>
        <TouchableOpacity onPress={handleBack} style={styles.button}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Texto principal de la imagen como título
  const titleText = story.imagenesUrls[0]?.texto || '';

  // Renderizado de la vista
  return (
    <View style={styles.fullScreen}>
      {/* Botón de volver */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color="#33c4ff" />
      </TouchableOpacity>

      {/* Cabecera con autor y título */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: story.autor?.profileImageUrl }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>{titleText}</Text>
          <Text style={styles.author}>Publicado por {story.autor?.givenName}</Text>
        </View>
      </Animated.View>

      {/* Barras de progreso visual para cada imagen */}
      <View style={styles.progressContainer}>
        {story.imagenesUrls.map((_, index) => {
          const widthInterpolate = index === currentIndex
            ? progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              })
            : index < currentIndex ? '100%' : '0%';

          return (
            <View key={index} style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: widthInterpolate },
                ]}
              />
            </View>
          );
        })}
      </View>

      {/* Carrusel horizontal con las imágenes de la historia */}
      <FlatList
        ref={flatListRef}
        data={story.imagenesUrls}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          if (!isPaused) {
            setCurrentIndex(newIndex); // Solo actualizar el índice si no está pausado
          }
        }}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: item.imagenUrl }}
            style={[styles.carouselImage, { opacity: imageFadeAnim }]}
          />

          {/* Zona izquierda para retroceder imagen */}
          <Pressable
            onPressIn={() => setIsPaused(true)}
            onPressOut={() => setIsPaused(false)}
            onPress={() => {
              if (currentIndex > 0) {
                const prevIndex = currentIndex - 1;
                setCurrentIndex(prevIndex);
                flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
              }
            }}
            style={styles.leftZone}
          />

          {/* Zona derecha para avanzar imagen */}
          <Pressable
            onPressIn={() => setIsPaused(true)}
            onPressOut={() => setIsPaused(false)}
            onPress={() => {
              if (currentIndex < story.imagenesUrls.length - 1) {
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
              }
            }}
            style={styles.rightZone}
          />
        </View>
        )}
      />
    </View>
  );
};

// Estilos del componente personalizados
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 60, 
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#ccc',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 90,
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 5,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#33c4ff',
  },
  imageContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width,
    height,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  leftZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '50%',
    zIndex: 10,
  },
  rightZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '50%',
    zIndex: 10,
  },
});

export default StoryViewer;