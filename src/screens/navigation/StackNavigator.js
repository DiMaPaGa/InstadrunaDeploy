import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../LoginScreen';
import SinglePublication from '../SinglePublication';
import TicketFormScreen from '../TicketFormScreen';
import ChatScreen from '../ChatScreen';
import TabNavigator from './TabNavigator'; 
import StoryViewer from '../StoryViewer';  
import AddStoryScreen from '../AddStoryScreen';  

// Crea una pila de navegación (stack)
const Stack = createNativeStackNavigator();

// Componente principal que define las rutas de navegación
const StackNavigator = ({ userInfo, onLogout, promptAsync, request }) => {
  return (
    <NavigationContainer>
      {/* Define el stack de pantallas. Oculta los headers por defecto */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Si el usuario no ha iniciado sesión, muestra la pantalla de login */}
        {!userInfo ? (
          <Stack.Screen name="Login">
            {() => <LoginScreen promptAsync={promptAsync} request={request} />}
          </Stack.Screen>
        ) : (
          <>
            {/* Si el usuario está autenticado, carga la navegación principal por tabs */}
            <Stack.Screen name="Main">
              {() => <TabNavigator userInfo={userInfo} onLogout={onLogout} />}
            </Stack.Screen>

             {/* Pantalla para ver historias */}
             <Stack.Screen name="StoryViewer">
              {({ route, navigation }) => (
                <StoryViewer 
                  route={route} 
                  navigation={navigation} 
                  userInfo={userInfo} />
              )}
            </Stack.Screen>

            {/* Pantalla para agregar una historia */}
            <Stack.Screen name="AddStoryScreen">
              {({ route, navigation }) => (
                <AddStoryScreen 
                  route={route} 
                  navigation={navigation} 
                  userInfo={userInfo} />
              )}
            </Stack.Screen>

            {/* Pantalla para ver una publicación específica */}
            <Stack.Screen name="SinglePublication">
              {({ route, navigation }) => (
                <SinglePublication
                  route={route}
                  navigation={navigation}
                  userInfo={userInfo}
                />
              )}
            </Stack.Screen>

            {/* Pantalla para crear un ticket */}
            <Stack.Screen name="TicketFormScreen">
              {({ route, navigation }) => (
                <TicketFormScreen
                  route={route}
                  navigation={navigation}
                  userInfo={userInfo}
                />
              )}
            </Stack.Screen>

            {/* Pantalla para chatear */}
            <Stack.Screen name="ChatScreen">
              {({ route, navigation }) => (
                <ChatScreen
                  route={route}
                  navigation={navigation}
                  userInfo={userInfo}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
