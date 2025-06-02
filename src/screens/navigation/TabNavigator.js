import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types'; // Importamos PropTypes para la validación

// Importa las pantallas
import HomeScreen from '../HomeScreen';
import TicketScreen from '../TicketScreen';
import ProfileScreen from '../ProfileScreen';
import AddPublicationScreen from '../AddPublicationScreen';
import SuggestedUsersScreen from '../SuggestedUsersScreen'; 


// Componente personalizado para los íconos de la barra de navegación inferior
import CustomTabBarIcon from '../../components/CustomTabBarIcon';

// Crea una instancia del bottom tab navigator
const Tab = createBottomTabNavigator();

// Componente principal del TabNavigator
const TabNavigator = ({ userInfo, onLogout }) => {
  // Protección extra por si userInfo no está disponible
  if (!userInfo) return null; 
  
  // Extrae los datos del usuario que se pasan a todas las pantallas
  const { givenName, userId, profileImageUrl, email } = userInfo;

  return (
  
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false, // Oculta los nombres de las pestañas
        headerShown: false, // Oculta los headers superiores
        tabBarStyle: styles.tabBar, // Estilos personalizados de la barra de navegación
      }}
    >
      {/* Pantalla principal (Home) */}
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              activeIcon={require('../../../assets/images/publicacionesBlue.png')}
              inactiveIcon={require('../../../assets/images/publicacionesgris.png')}
              label="Home"
            />
          ),
        }}
      >
        {() => (
          <HomeScreen
            route={{
              params: { givenName, profileImageUrl, userId, email}  // Pasamos los valores en route.params
            }}
            onLogout={onLogout}  // Pasamos onLogout
          />
        )}
      </Tab.Screen>

      {/* Pantalla para agregar una publicación */}
      <Tab.Screen
        name="Add"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              activeIcon={require('../../../assets/images/addb.png')}
              inactiveIcon={require('../../../assets/images/addgris.png')}
              label="Agregar"
            />
          ),
        }}
      >
        {() => (
          <AddPublicationScreen
            route={{
              params: { givenName, profileImageUrl, userId, email }  // Pasamos el id correctamente aquí
            }}
          />
        )}
      </Tab.Screen>
      
      {/* Pantalla de ajustes o formulario de tickets */}
      <Tab.Screen
        name="Ajustes"
        component={TicketScreen}
        initialParams={{ userId, givenName, email, profileImageUrl }}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              activeIcon={require('../../../assets/images/AjustesBlue.png')}
              inactiveIcon={require('../../../assets/images/ajustesgris.png')}
              label="Ticket"
            />
          ),
        }}
      />

    {/* Pantalla de perfil del usuario */}
    <Tab.Screen
      name="Perfil"
      options={{
        tabBarIcon: ({ focused }) => (
          <CustomTabBarIcon
            focused={focused}
            activeIcon={require('../../../assets/images/PerfilBlue.png')}
            inactiveIcon={require('../../../assets/images/PerfilGris.png')}
            label="Perfil"
          />
        ),
      }}
    >
      {() => (
        <ProfileScreen
          route={{
            params: { userId, givenName, email, profileImageUrl },
          }}
          onLogout={onLogout}
        />
      )}
    </Tab.Screen>

    {/* Pantalla de usuarios sugeridos */}
    <Tab.Screen
        name="People"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              activeIcon={require('../../../assets/images/PeopleBlue.png')} // Cambia por el ícono de sugerencias
              inactiveIcon={require('../../../assets/images/PeopleGris.png')} // Cambia por el ícono de sugerencias gris
              label="People"
            />
          ),
        }}
      >
        {() => (
        <SuggestedUsersScreen
          route={{
            params: { userId, givenName, email, profileImageUrl },
          }}
          onLogout={onLogout}
        />
      )}
      </Tab.Screen>
        
    </Tab.Navigator>
  );
};

// Validación de las propiedades de TabNavigator
TabNavigator.propTypes = {
  userInfo: PropTypes.shape({
    userId: PropTypes.string,
    email: PropTypes.string,
    givenName: PropTypes.string,
    profileImageUrl: PropTypes.string,
  }),
  onLogout: PropTypes.func,
  promptAsync: PropTypes.func,
  request: PropTypes.object,
};

// Estilos personalizados para la barra de navegación inferior
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#23272A',
    height: 75,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 0,
    paddingTop: 10,
  },
});

export default TabNavigator;

