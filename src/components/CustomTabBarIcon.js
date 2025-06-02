import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// Componente funcional que muestra un ícono de barra de pestañas personalizado
const CustomTabBarIcon = ({ focused, activeIcon, inactiveIcon, label }) => (
  <View style={styles.iconContainer}>
    {/* Muestra el ícono activo o inactivo según si está enfocado */}
    <Image source={focused ? activeIcon : inactiveIcon} style={styles.icon} />
    {/* Muestra la etiqueta del ícono. Aplica estilos distintos si está enfocado */}
    <Text 
      style={[styles.iconLabel, focused ? styles.iconLabelActive : styles.iconLabelInactive]} 
      numberOfLines={1}>
      {label || 'Sin etiqueta'} {/* Muestra texto predeterminado si no se proporciona etiqueta */}
    </Text>
  </View>
);

// Validación de las propiedades
CustomTabBarIcon.propTypes = {
  focused: PropTypes.bool.isRequired, // Indica si el ícono está seleccionado
  activeIcon: PropTypes.any.isRequired, // Imagen para el estado activo
  inactiveIcon: PropTypes.any.isRequired, // Imagen para el estado inactivo
  label: PropTypes.string.isRequired, // Texto que se mostrará debajo del ícono
};

// Estilos para el componente
const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 2,
  },
  iconLabel: {
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
    width: 60,
  },
  iconLabelActive: {
    color: '#33c4ff',
  },
  iconLabelInactive: {
    color: '#868686',
  },
});

export default CustomTabBarIcon;