import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import config from '../../config/config';
import { RootStackParamList } from '../../types'; // Asegúrate de que la ruta sea correcta

const ChangePassword: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const url = config.bffauthchangepassword; // Usar la URL desde la configuración

    const handlePasswordChange = async () => {
        setMessage('');

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, currentPassword, newPassword })
            });

            if (response.ok) {
                setMessage('Contraseña cambiada correctamente');
               // setTimeout(() => navigation.navigate('Home'), 3000); // Redirigir a la pantalla principal después de 3 segundos
            } else {
                setMessage('Error al cambiar la contraseña');
            }
        } catch (error) {
            setMessage('Error en la conexión con la API');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cambiar Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="ID de Usuario"
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña Actual"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Nueva Contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <Button title="Cambiar Contraseña" onPress={handlePasswordChange} />
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

export default ChangePassword;