import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import config from '../config/config';
import { RequestRegisterUser } from '../models/requestRegisterUser';

type RootStackParamList = {
    Header: undefined;
    EditUser: undefined;
    ChangePassword: undefined;
    Login: undefined;
    FichaJugador: { username: string };
};

const Header: React.FC = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);

    type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'Header'>;
    const navigation = useNavigation<HeaderNavigationProp>();

    useEffect(() => {
        const fetchUsername = async () => {
            const token = await AsyncStorage.getItem('token');
            const storedUsername = await AsyncStorage.getItem('user');
            //console.log('header token:', token);
            console.log('stored username:', storedUsername);

            if (token && storedUsername) {
                const requestUser = new RequestRegisterUser(storedUsername, ''); // Crear el objeto con el username
                console.log('requestUser:', requestUser);
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(requestUser)
                };

                try {
                    const response = await fetch(config.bffauthgetuser, requestOptions);
                    console.log('response:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = await response.json();
                    console.log('result:', result);
                    setUsername(result.userName);
                    setName(result.name); // Guardar el nombre en el estado
                } catch (error) {
                    console.error('Error fetching username:', error);
                }
            } else {
                console.log('Token or username not found');
            }
        };

        fetchUsername();
    }, []);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const navigateTo = (screen: keyof RootStackParamList) => {
        setMenuVisible(false);
        console.log('header username:', username);
        if (screen === 'FichaJugador') {
            navigation.navigate(screen, { username }); // Pasar el username como parámetro
        } else {
            navigation.navigate(screen);
        }
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.username}>{name}</Text>
            {menuVisible && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={menuVisible}
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.menu}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('EditUser')}>
                            <Text style={styles.menuItemText}>Editar Usuario</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('ChangePassword')}>
                            <Text style={styles.menuItemText}>Cambiar Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('FichaJugador')}>
                            <Text style={styles.menuItemText}>Ficha Jugador</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            AsyncStorage.clear();
                            navigation.navigate('Login');
                        }}>
                            <Text style={styles.menuItemText}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    menuButton: {
        padding: 10,
    },
    menuText: {
        fontSize: 24,
    },
    username: {
        fontSize: 18,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menu: {
        position: 'absolute',
        top: 50,
        left: 10, // Cambiado a la izquierda
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
    },
    menuItem: {
        padding: 10,
    },
    menuItemText: {
        fontSize: 16,
    },
});

export default Header;