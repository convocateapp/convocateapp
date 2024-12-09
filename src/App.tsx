import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from './screens/Login';
import Register from './screens/Register';
import CrearPartido from './screens/partidos/CrearPartido';
import ListaPartidos from './screens/partidos/ListaPartidos'; // Asegúrate de que la ruta es correcta

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ListaPartidos" component={ListaPartidos} />
        <Stack.Screen name="CrearPartido" component={CrearPartido} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;