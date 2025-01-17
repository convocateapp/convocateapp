// AppNavigator.tsx (o donde configures tu navegador)
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Header from '../components/Header';
import FichaJugador from '../screens/jugador/FichaJugador';
import Login from '../screens/Login';
import ChangePassword from '../screens/user/ChangePassword';
import EditUser from '../screens/user/EditUser';

type RootStackParamList = ParamListBase & {
    Header: undefined;
    EditUser: undefined;
    ChangePassword: undefined;
    Login: undefined;
    FichaJugador: { username: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Header">
                <Stack.Screen name="Header" component={Header} />
                <Stack.Screen name="EditUser" component={EditUser} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="FichaJugador" component={FichaJugador} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;