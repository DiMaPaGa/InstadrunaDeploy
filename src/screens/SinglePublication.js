import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const API_BASE_URL = 'http://51.120.11.157:8080/api'; // Reemplaza por tu URL base de la API

const SinglePublication = ({ route }) => {
  const navigation = useNavigation();
  const { id: publicacionId, userInfo } = route.params || {}; // Obtener el ID de la publicación
  const { userId, givenName, profileImageUrl } = userInfo || {}; // Datos del usuario autenticado

  const [publicacion, setPublicacion] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [comentario, setComentario] = useState("");
  const [comentarioPadreId, setComentarioPadreId] = useState(null);
  const [likes, setLikes] = useState([]);
  const [userLiked, setUserLiked] = useState(false);
  const [isActivePublicar, setIsActivePublicar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null); // Para guardar la información del autor de la publicación

  useEffect(() => {
    if (!publicacionId) return;

    const fetchData = async () => {
      try {
        // Obtener la publicación
        const pubRes = await fetch(`${API_BASE_URL}/publicaciones/${publicacionId}`);
        const pubData = await pubRes.json();
        setPublicacion(pubData);

        // Obtener el autor de la publicación (el usuario que la creó)
    
        setAuthor(pubData.autor);

        // Obtener los comentarios
        const comRes = await fetch(`${API_BASE_URL}/comentarios/publicacion/${publicacionId}`);
        const comData = await comRes.json();
        
        // Asegurarse de que comData sea un array
        if (Array.isArray(comData)) {
          setComentarios(comData);
        } else {
          setComentarios([]);  // Si no es un array, asignamos un array vacío
        }
        
        // Obtener los likes
        setLikes(pubData.likes || []);

        // Verificar si el usuario ya ha dado like
        setUserLiked(pubData.likes?.some((like) => like.userId === userId));
      } catch (error) {
        console.error("Error al cargar los datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicacionId, userId]);

  useEffect(() => {
    setIsActivePublicar(comentario.trim().length > 0);
  }, [comentario]);


  const handleComentarioSubmit = async () => {
    if (!comentario.trim()) return;

    const newComentario = { userId, publicacionId, comentario, comentarioPadreId: comentarioPadreId || null };

    try {
      const res = await fetch(`${API_BASE_URL}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComentario),
      });
      
      if (!res.ok) throw new Error("Error al agregar el comentario");
      
      const comentarioCreado = await res.json();
      
      // Actualizamos el estado de los comentarios
      setComentarios((prevComentarios) => [...prevComentarios, comentarioCreado]);

      // Limpiar el campo de comentario
      setComentario("");
      setComentarioPadreId(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error al crear comentario", error);
    }
  };


  // Función para gestionar el like (manteniéndola igual que en el primer código que me diste)
  const handleLike = async () => {
    const isLiked = likes.some((like) => like.userId === userId);
  
    if (isLiked) {
      try {
        const res = await fetch(`${API_BASE_URL}/likes/${userId}/${publicacionId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!res.ok) {
          console.error(`Error eliminando like: HTTP ${res.status}`);
          return;
        }
  
        setLikes((prev) => prev.filter((like) => like.userId !== userId));
        setUserLiked(false); // 👈 ACTUALIZA
      } catch (err) {
        console.error("Error eliminando like", err);
      }
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, publicacionId }),
        });
  
        const text = await res.text();
        if (!res.ok || !text) throw new Error("Error al agregar like");
  
        const data = JSON.parse(text);
        setLikes((prev) => [...prev, data]);
        setUserLiked(true); 
      } catch (err) {
        console.error("Error agregando like", err);
      }
    }
  };

  const handleEliminarComentario = async (comentarioId) => {
    try {
      await fetch(`${API_BASE_URL}/comentarios/${comentarioId}`, {
        method: "DELETE"
      });
      setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
    } catch (err) {
      console.error("Error eliminando comentario", err);
    }
  };

  const comentariosAgrupados = comentarios
  .filter(c => !c.comentarioPadreId)  // Filtramos solo los comentarios principales (sin comentarioPadreId)
  .map(c => ({
    ...c,
    respuestas: comentarios.filter(r => r.comentarioPadreId === c.id)  // Filtramos las respuestas para cada comentario
  }));


  const renderItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Image
        source={item.autorProfileImageUrl ? { uri: item.autorProfileImageUrl } : require("../../assets/images/iconUser.png")}
        style={styles.commentAvatar}
      />
      <View style={styles.commentText}>
        <Text style={styles.commentUser}>{item.autorName}</Text>
        <Text style={styles.commentContent}>{item.comentario}</Text>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <TouchableOpacity
            onPress={() => {
              setComentarioPadreId(item.id);
              setModalVisible(true);
            }}
          >
            <Text style={{ color: "#33c4ff", marginRight: 15 }}>Responder</Text>
          </TouchableOpacity>
          {item.userId === userId && (
            <TouchableOpacity onPress={() => handleEliminarComentario(item.id)}>
              <Text style={{ color: "#FF4C4C" }}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
  
        {/* Respuestas */}
        {item.respuestas && item.respuestas.length > 0 && item.respuestas.map((respuesta) => (
          <View key={respuesta.id} style={{ marginLeft: 20, marginTop: 10 }}>
            <Image
              source={respuesta.autorProfileImageUrl ? { uri: respuesta.autorProfileImageUrl } : require("../../assets/images/iconUser.png")}
              style={styles.commentAvatar}
            />
            <Text style={styles.commentUser}>{respuesta.autorName}</Text>
            <Text style={styles.commentContent}>{respuesta.comentario}</Text>
            {respuesta.userId === userId && (
              <TouchableOpacity onPress={() => handleEliminarComentario(respuesta.id)}>
                <Text style={{ color: "#FF4C4C", fontSize: 12 }}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
  
  
  if (loading) return <Text>Cargando publicación...</Text>;
  if (!publicacion) return <Text>Error al cargar la publicación.</Text>;

   return (
    <View style={styles.container}>

      {/* HEADER FIJO */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require("../../assets/images/returnBlue.png")} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.headerUserContainer}>
          <Image source={author && author.profileImageUrl ? { uri: author.profileImageUrl } : require("../../assets/images/iconUser.png")} style={styles.avatar} />
          <View style={styles.userTextContainer}>
            <Text style={styles.publishedBy}>Publicado por</Text>
            <Text style={styles.user_id}>{author ? author.givenName : ''}</Text>
          </View>
        </View>
      </View>

      {/* FLATLIST */}
      <FlatList
        ListHeaderComponent={
          <>
            <View style={{ height: 140 }} /> {/* Espacio para el header fijo */}
            <View style={styles.publicationContent}>
                <Image source={
                    publicacion.imageUrl
                      ? { uri: publicacion.imageUrl }
                      : require("../../assets/images/addpubB.png")
                  }
                  style={styles.publicationImage}
                />
              <View style={styles.likesContainer}>
                <TouchableOpacity onPress={handleLike}>
                  <Image
                    source={userLiked ? require("../../assets/images/FavoriteBlue.png") : require("../../assets/images/FavoriteBorder.png")}
                    style={styles.likeIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.likesText}>{likes.length} Me gusta</Text>
              </View>

              <View style={styles.publicationText}>
                <Text style={styles.title}>{publicacion.titulo}</Text>
                <Text style={styles.description}>{publicacion.comentario}</Text>
              </View>

              <Text style={styles.timeAgo}>
                Hace {Math.round((new Date() - new Date(publicacion.createdAt)) / (1000 * 60 * 60 * 24))} días
              </Text>
            </View>

            <Text style={styles.commentsTitle}>COMENTARIOS</Text>
          </>
        }
        data={comentariosAgrupados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noComments}>No hay comentarios</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addCommentButton}>
        <Image source={require("../../assets/images/anadirMensajeBlue.png")} style={styles.addCommentIcon} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comentarios:</Text>
            <TextInput
              style={styles.input}
              placeholder="Max 500 caracteres"
              maxLength={500}
              multiline
              value={comentario}
              onChangeText={setComentario}
              placeholderTextColor="#DFDFDF"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleComentarioSubmit}
                style={[styles.button, isActivePublicar && styles.buttonActive]}
              >
                <Text style={styles.buttonText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#323639",
    padding: 10,
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#323639",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  headerUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userTextContainer: {
    marginLeft: 15,
  },
  publishedBy: {
    fontSize: 11,
    color: "#8A8A8A",
  },
  user_id: {
    fontSize: 18,
    color: "#33c4ff",
    fontWeight: "bold",
  },
  publicationContent: {
    marginBottom: 10,
  },
  publicationImage: {
    width: screenWidth - 20,
    height: 300,
    borderRadius: 20,
    resizeMode: "cover",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  likeIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  likesText: {
    color: "#33c4ff",
    fontWeight: "bold",
  },
  publicationText: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#33c4ff",
  },
  description: {
    fontSize: 16,
    color: "#fff",
  },
  timeAgo: {
    fontSize: 14,
    color: "#8A8A8A",
    marginBottom: 15,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#33c4ff",
    marginVertical: 10,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentText: {
    flex: 1,
    marginLeft: 10,
  },
  commentUser: {
    fontWeight: "bold",
    color: "#33c4ff",
  },
  commentContent: {
    color: "#fff",
  },
  noComments: {
    color: "#fff",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  addCommentButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#323639",
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  addCommentIcon: {
    width: 30,
    height: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 15,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    color: "#33c4ff",
    marginBottom: 10,
  },
  input: {
    height: 100,
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    padding: 10,
    backgroundColor: "#555",
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#33c4ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SinglePublication;