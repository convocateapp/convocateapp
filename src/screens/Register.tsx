import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import config from '../config/config';
import { RootStackParamList } from '../types'; // Asegúrate de que la ruta sea correcta

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [apodo, setApodo] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const url = config.bffauthregister;

    const handleRegister = async () => {
        setMessage('');
        console.log(username + ' ' + email + ' ' + password + ' ' + name + ' ' + lastName + ' ' + apodo);
        console.log('url: ' + url);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName: username, email : email, password: password, name: name, lastName: lastName, apodo: apodo }),
            });
            console.log('response.status: ' + response.status);
            if (response.status === 200) {
                setMessage('Usuario creado correctamente');
                setTimeout(() => navigation.navigate('Login'), 3000); // Redirigir a la pantalla de login después de 3 segundos
            } else {
                setMessage('Error al crear el usuario');
            }
        } catch (error) {
            console.log('Error en la conexión con la API: ' + (error as any).message);
            setMessage('Error en la conexión con la API: ' + (error as any).message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ConvocateApp</Text>
            <Text style={styles.subtitle}>Registrarse</Text>
            <TextInput
                style={styles.input}
                placeholder="Usuario / Teléfono"
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
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Apodo"
                value={apodo}
                onChangeText={setApodo}
            />
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <Button title="Registrarse" onPress={handleRegister} />
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
    subtitle: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    message: {
        color: 'blue',
        textAlign: 'center',
        marginBottom: 12,
    },
});

export default Register;