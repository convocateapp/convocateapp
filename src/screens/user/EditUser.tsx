import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import config from '../../config/config';
// Ensure that the correct path to AppNavigator is used and that it exports RootStackParamList
// import { RootStackParamList } from '../../navigation/AppNavigator'; // Commented out due to missing module

type RootStackParamList = {
    EditUser: undefined;
    ChangePassword: undefined;
};
const EditUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [apodo, setApodo] = useState('');
    const [message, setMessage] = useState('');

    
    type EditUserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditUser'>;
    
    const navigation = useNavigation<EditUserScreenNavigationProp>();

    const urlgetuser = config.bffauthgetuser;
    const urlupdateuser = config.bffauthupdateuser;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const user = await AsyncStorage.getItem('user');
                const response = await fetch(urlgetuser, {
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
                    setUsername(data.userName);
                    setEmail(data.email);
                    setName(data.name);
                    setLastName(data.lastName);
                    setApodo(data.apodo);
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    interface User {
        userName: string;
        email: string;
        password: string;
        name: string;
        lastName: string;
        apodo: string;
    }

    const handleUpdate = async () => {
        setMessage('');

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(urlupdateuser, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userName: username, email, password, name, lastName, apodo } as User)
            });

            if (response.ok) {
                setMessage('Perfil actualizado correctamente');
                Alert.alert('Perfil actualizado correctamente');
                setTimeout(() => navigation.navigate('EditUser'), 3000); // Redirigir a la pantalla principal después de 3 segundos
            } else {
                setMessage('Error al actualizar el perfil');
                Alert.alert('Error al actualizar el perfil');
            }
        } catch (error) {
            setMessage('Error en la conexión con la API');
            Alert.alert('Error en la conexión con la API');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Editar Usuario</Text>
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />

            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

            <Text style={styles.label}>Apodo</Text>
            <TextInput style={styles.input} value={apodo} onChangeText={setApodo} />

            {message ? <Text style={styles.message}>{message}</Text> : null}

            <Button title="Guardar" onPress={handleUpdate} />
            <Button title="Modificar Pass" onPress={() => navigation.navigate('ChangePassword')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#343a40',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        color: 'green',
    },
});

export default EditUser;