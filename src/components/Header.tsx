import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config/config';
import { RootStackParamList } from '../types'; // Asegúrate de que la ruta sea correcta

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [name, setName] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const url = config.bffauthgetuser;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const user = await AsyncStorage.getItem('user');
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userName: user,
                        password: "",
                        email: "",
                        name: "",
                        lastName: "",
                        apodo: ""
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setName(data.name);
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <Text style={styles.title}>ConvocateApp</Text>
                <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.userName}>Usuario: {name}</Text>
            </View>
            {menuOpen && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Modificar Perfil</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#fff',
        zIndex: 1000,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        minHeight: 100,
    },
    headerContent: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        margin: 0,
        fontFamily: 'Segoe Print, sans-serif',
        color: 'black',
        fontSize: 24,
    },
    menuButton: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        cursor: 'pointer',
        color: 'black',
    },
    menuIcon: {
        fontSize: 24,
    },
    userName: {
        color: 'black',
        marginLeft: 10,
    },
    menu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    menuItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    menuItemText: {
        textDecorationLine: 'none',
        color: 'inherit',
    },
});

export default Header;