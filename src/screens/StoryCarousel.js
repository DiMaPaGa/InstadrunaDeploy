import React from 'react';
import { ScrollView, TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';

// Componente del carrusel de historias con scroll horizontal
const StoryCarousel = ({ stories, onStoryPress, onAddStoryPress, currentUser}) => {
      return (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.carousel}
          contentContainerStyle={styles.carouselContent}
        >
            {/* Botón de "Añadir historia" al inicio */}
        {currentUser && (
          <TouchableOpacity onPress={onAddStoryPress} style={styles.storyItem}>
            <View style={styles.imageWrapper}>
              <Image
                source={require('../../assets/images/addb.png')
                }
                style={styles.storyImage}
              />
            </View>
            <Text style={styles.userName}>Tu historia</Text>
          </TouchableOpacity>
        )}

        {/* Historias del resto de usuarios */}
          {stories.map((story, index) => {
          console.log('Story en el carousel:', story); // Añade esto temporalmente
          return (
            <TouchableOpacity 
              key={story.id || index} 
              onPress={() => onStoryPress(story.id)}
              style={styles.storyItem}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={
                    story.autor?.profileImageUrl
                      ? { uri: story.autor.profileImageUrl }
                      : require('../../assets/images/iconUser.png')
                  }
                  style={styles.storyImage}
                />
              </View>
    
              <Text style={styles.userName}>
                {story.autor?.givenName || 'Anónimo'}
              </Text>
            </TouchableOpacity>
  );
})}
        </ScrollView>
      );
    };
    
    // Estilos del componente personalizados
    const styles = StyleSheet.create({
        carousel: {
          marginTop: 20,
          paddingHorizontal: 10,
        },
        noStories: {
          textAlign: 'center',
          color: '#ccc',
          fontSize: 14,
          paddingVertical: 10,
        },
        carouselContent: {
          flexDirection: 'row',  
          paddingVertical: 5,    
        },
        storyItem: {
          alignItems: 'center',
          marginRight: 15,
          marginLeft: 2, 
        },
        imageWrapper: {
          borderWidth: 3,
          borderColor: '#33c4ff',
          borderRadius: 40,
          padding: 2,
        },
        storyImage: {
          width: 70,
          height: 70,
          borderRadius: 35,
        },
        userName: {
          textAlign: 'center',
          fontSize: 12,
          color: '#ccc',
          marginTop: 5,
          maxWidth: 80,
        },
      });
      
      export default StoryCarousel;