import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

// Esta es la pantalla de login
const LoginScreen = ({ promptAsync, request }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/google.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Inicia sesión con tu cuenta de Google</Text>

      {/* Botón para iniciar sesión con Google */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => promptAsync()} // Activar el flujo de Google
        disabled={!request}
      >
        <Text style={styles.loginText}>Continuar con Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1e1e1e",
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 30,
    tintColor: "#33c4ff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#868686",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
