import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import Header from '../components/Header';
import FichaJugador from '../screens/jugador/FichaJugador';
import Login from '../screens/Login';
import CrearPartido from '../screens/partidos/CrearPartido';
import FichaJugadorPartido from '../screens/partidos/FichaJugadorPartido';
import FichaPartido from '../screens/partidos/FichaPartido';
import ListaPartidos from '../screens/partidos/ListaPartidos';
import Register from '../screens/Register';
import ChangePassword from '../screens/user/ChangePassword';
import EditUser from '../screens/user/EditUser';
import PrincipalPerfil from '../screens/user/PrincipalPerfil';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="ListaPartidos" component={ListaPartidos} options={{ header: () => <Header /> }} />
                <Stack.Screen name="CrearPartido" component={CrearPartido} options={{ header: () => <Header /> }} />
                <Stack.Screen name="FichaPartido" component={FichaPartido} options={{ header: () => <Header /> }} />
                <Stack.Screen name="FichaJugador" component={FichaJugador} options={{ header: () => <Header /> }} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ header: () => <Header /> }} />
                <Stack.Screen name="EditUser" component={EditUser} options={{ header: () => <Header /> }} />
                <Stack.Screen name="PrincipalPerfil" component={PrincipalPerfil} options={{ header: () => <Header /> }} />
                <Stack.Screen name="FichaJugadorPartido" component={FichaJugadorPartido} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});

export default AppNavigator;