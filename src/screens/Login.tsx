import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import config from '../config/config';
import { RootStackParamList } from '../types'; // Asegúrate de que la ruta sea correcta

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const url = config.bffauthlogin;

    // Función para extraer el token del string JSON
    const extractToken = (tokenString: string): string | null => {
        try {
            const parsed = JSON.parse(tokenString);
            return parsed.token;
        } catch (e) {
            console.error('Error parsing token JSON:', e);
            return null;
        }
    };

    const handleLogin = async () => {
        setError('');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 200) {
                const data = await response.json();
                const token = extractToken(data.token); // Usar la función para extraer el token
                // console.log('Login -> Token:', token);
                if (token) {
                    // Almacenar solo el token
                    await AsyncStorage.setItem('token', token);
                    // Almacenar el valor del cuadro de texto username en el AsyncStorage
                    await AsyncStorage.setItem('user', username);
                    navigation.navigate('ListaPartidos');
                } else {
                    setError('No se pudo obtener el token');
                }
            } else {
                setError('No tiene acceso');
            }
        } catch (error) {
            setError('Error en la conexión con la API');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ConvocateApp</Text>
            <Image source={require('../../assets/images/icon/ConvocateApp-balon011.jpg')} style={styles.image} />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Iniciar Sesión" onPress={handleLogin} />
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>¿No tienes una cuenta? Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Segoe Print, sans-serif',
        marginBottom: 16,
    },
    image: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
    link: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 16,
    },
});

export default Login;