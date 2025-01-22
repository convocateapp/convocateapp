import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Login from './src/screens/Login'; // Asegúrate de tener una pantalla Login
import Register from './src/screens/Register'; // Asegúrate de tener una pantalla Register

import { AuthProvider } from './src/context/AuthContext';
import FichaJugador from './src/screens/jugador/FichaJugador';
import CrearPartido from './src/screens/partidos/CrearPartido';
import FichaPartido from './src/screens/partidos/FichaPartido';
import ListaPartidos from './src/screens/partidos/ListaPartidos'; // Asegúrate de que la ruta es correcta
import ChangePassword from './src/screens/user/ChangePassword';
import EditUser from './src/screens/user/EditUser';
import PrincipalPerfil from './src/screens/user/PrincipalPerfil';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    
    <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ListaPartidos" component={ListaPartidos} />
        <Stack.Screen name="CrearPartido" component={CrearPartido} />
        <Stack.Screen name="FichaPartido" component={FichaPartido} />
        <Stack.Screen name="FichaJugador" component={FichaJugador} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="PrincipalPerfil" component={PrincipalPerfil} />
      </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;