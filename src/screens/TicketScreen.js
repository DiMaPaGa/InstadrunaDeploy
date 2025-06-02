import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Dimensions, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_URL } from '@env'; 

// Obtener dimensiones de pantalla para estilos responsivos
const { width, height } = Dimensions.get("window");

// Componente principal de la pantalla de tickets
const TicketScreen = () => {

  // Extraer datos del usuario desde los parámetros de la ruta
  const { userId ='', givenName='', email='', picture='' } = useRoute().params || {};
  const navigation = useNavigation();

  // Estados para almacenar los tickets y estado de carga
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);


  // Función para obtener los tickets desde el backend
  const fetchTickets = async () => {
    try {
      setLoading(true); // Mostrar loader
      const response = await fetch(`${API_URL}/tickets/usuario/${userId}/ordenados`);
      if (!response.ok) {
        throw new Error("Error al obtener los tickets");
      }
      const ticketsData = await response.json(); // Parsear respuesta
      setTickets(ticketsData); // Actualizar estado
    } catch (error) {
      console.error(error); // Mostrar error si ocurre
    } finally {
      setLoading(false); // Ocultar loader
    }
  };

  // Cargar tickets cuando se monta el componente
  useEffect(() => {
    if (userId) {
      fetchTickets();
    }
  }, [userId]);

  // Recargar tickets al volver a la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchTickets(); 
    });

    return unsubscribe; // Limpiar el listener
  }, [navigation]);

  // Función para obtener el estilo de cada estado de ticket
  const getStateStyle = (state) => {
    switch (state) {
      case "EN_TRAMITE":
        return styles.enTramite;
      case "DENEGADO":
        return styles.denegada;
      case "SOLUCIONADO":
        return styles.solucionado;
      default:
        return {};
    }
  };

  // Renderizado de cada tarjeta de ticket en la lista
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
        <View style={styles.ticketCard}>
          <Text style={styles.ticketTitle}>{item.titulo}</Text>
          <Text style={[styles.ticketState, getStateStyle(item.estado)]}>{item.estado}</Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
  {/* Título "INCIDENCIAS" */}
  <View style={styles.incidentsTitleContainer}>
    <Text style={styles.incidentsTitleText}>INCIDENCIAS</Text>
  </View>

  {/* Indicador de carga o lista de tickets */}
  {loading ? (
    <ActivityIndicator size="large" color="#33c4ff" />
  ) : (
    <FlatList
      data={tickets}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.flatListContent}
      ListFooterComponent={<View style={{ height: height * 0.1 }} />} 
    />
  )}

  {/* Botón para crear un nuevo ticket */}
  <TouchableOpacity
    style={styles.createTicketButton}
    onPress={() => navigation.navigate("TicketFormScreen", { userId, givenName, email, picture })}
  >
    <Image
      source={require("../../assets/images/ticket.png")}
      style={styles.createTicketIcon}
    />
  </TouchableOpacity>
</SafeAreaView>
  );
};

// Estilos para el componente personalizados
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#23272A", padding: width * 0.05 },
  incidentsTitleContainer: {
    width: width * 0.9, 
    paddingVertical: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incidentsTitleText: {
    fontFamily: "AsapCondensed-Bold",
    textTransform: "uppercase", 
    fontSize: width * 0.08, 
    color: "#33c4ff",
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: "#323639",
    padding: width * 0.05,
    borderRadius: 20,
    marginBottom: height * 0.02,
  },
  ticketTitle: {
    fontFamily: "AsapCondensed-Bold",
    textTransform: "uppercase", 
    fontSize: width * 0.05,
    lineHeight: height * 0.03,
    color: "#33c4ff", 
    marginHorizontal: 15,
  },
  ticketState: {
    fontFamily: "AsapCondensed-Regular",
    textTransform: "uppercase", 
    fontSize: width * 0.04,
    lineHeight: height * 0.025,
    display: "flex",
    alignItems: "center",
    textAlign: "justify",
    marginHorizontal: 15,
  },
  enTramite: {
    color: "#F19100", 
  },
  denegada: {
    color: "#F10000", 
  },
  solucionado: {
    color: "#33c4ff", 
  },
  createTicketButton: {
    position: "absolute",
    bottom: height * 0.1,
    right: width * 0.05,
    backgroundColor: "transparent",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  createTicketIcon: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
  },
  flatListContent: {
    paddingTop: height * 0.12,
    paddingBottom: height * 0.2,
  },
});

export default TicketScreen;
