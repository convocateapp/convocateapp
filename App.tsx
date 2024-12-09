import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Login from './src/screens/Login'; // Asegúrate de tener una pantalla Login
import Register from './src/screens/Register'; // Asegúrate de tener una pantalla Register
import CrearPartido from './src/screens/partidos/CrearPartido';
import ListaPartidos from './src/screens/partidos/ListaPartidos'; // Asegúrate de que la ruta es correcta

const Stack = createStackNavigator();

const App: React.FC = () => {
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