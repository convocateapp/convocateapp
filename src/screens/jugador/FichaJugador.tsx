import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import config from '../../config/config';

// Importar la imagen predeterminada utilizando require
const defaultImage = require('../../../assets/images/icon/ConvocateApp-jugadornn.png');

type RootStackParamList = {
    FichaJugador: { username: string };
};

const FichaJugador = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'FichaJugador'>>();
    const { username } = route.params; // Obtener el username de los parámetros de la ruta

    const [token, setToken] = useState<string | null>(null);
    const [jugadorId, setJugadorId] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fotoPrincipal, setFotoPrincipal] = useState<string | null>(null);
    const [idEstado, setIdEstado] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState(username); // Inicializar con el username recibido
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };

        fetchToken();
    }, []);

    const fetchJugadorData = async () => {
        if (token) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username }) // Enviar el username en el cuerpo de la solicitud
            };

            try {
                console.log('===== FichaJugador =====' + ' userName:' + username);
                const response = await fetch(`${config.bffpartidogetjugadorid}`, requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                const { jugadorId, userName } = result;
                setJugadorId(jugadorId);
                setUserName(userName);

                // Segunda llamada a la API con el jugadorId obtenido
                const jugadorResponse = await fetch(`${config.bffPartidogetjugador}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ jugadorId })
                });

                if (!jugadorResponse.ok) {
                    throw new Error(`HTTP error! status: ${jugadorResponse.status}`);
                }

                const jugadorData = await jugadorResponse.json();
                setNombres(`${jugadorData.nombres} ${jugadorData.apellidos}`);
                setApellidos(jugadorData.apellidos);
                setTelefono(jugadorData.telefono);
                setFotoPrincipal(jugadorData.fotoPrincipal);
                setIdEstado(jugadorData.idEstado);
                setFechaIngreso(jugadorData.fechaIngreso);
                setFechaNacimiento(jugadorData.fechaNacimiento);
                setEmail(jugadorData.email);
                setUserName(jugadorData.userName);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchJugadorData();
    }, [token]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (result.assets && result.assets.length > 0) {
                const base64Image = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
                setFotoPrincipal(`data:image/jpeg;base64,${base64Image}`);
            }
        }
    };

    const saveJugadorData = async () => {
        if (token) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jugadorId,
                    nombres,
                    apellidos,
                    telefono,
                    fotoPrincipal,
                    idEstado,
                    fechaIngreso,
                    fechaNacimiento,
                    email,
                    userName
                })
            };

            try {
                const response = await fetch(`${config.bffPartidoupdatejugador}`, requestOptions);
                if (!response.ok) {
                    if (response.status === 400) {
                        const errorData = await response.json();
                        throw new Error(`Error 400: ${errorData.message}`);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                const result = await response.json();
                Alert.alert('Éxito', 'Datos guardados correctamente');
                // Actualizar los campos con los datos guardados
                setNombres(`${result.nombres} ${result.apellidos}`);
                setApellidos(result.apellidos);
                setTelefono(result.telefono);
                setFotoPrincipal(result.fotoPrincipal);
                setIdEstado(result.idEstado);
                setFechaIngreso(result.fechaIngreso);
                setFechaNacimiento(result.fechaNacimiento);
                setEmail(result.email);
                setUserName(result.userName);
            } catch (error) {
                Alert.alert('Error', (error as Error).message);
            }
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>; // Mostrar el mensaje de error

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Ficha Jugador</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Foto</Text>
                <View style={styles.imageContainer}>
                    <Image source={fotoPrincipal ? { uri: fotoPrincipal } : defaultImage} style={styles.image} />
                </View>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Cargar Imagen</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Jugador ID</Text>
                <TextInput style={styles.input} value={jugadorId} onChangeText={setJugadorId} />

                <Text style={styles.label}>Nombres</Text>
                <TextInput style={styles.input} value={nombres} onChangeText={setNombres} />

                <Text style={styles.label}>Teléfono</Text>
                <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} />

                <Text style={styles.label}>ID Estado</Text>
                <TextInput style={styles.input} value={idEstado} onChangeText={setIdEstado} />

                <Text style={styles.label}>Fecha Nacimiento</Text>
                <TextInput style={styles.input} value={fechaNacimiento} onChangeText={setFechaNacimiento} />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} />

                <TouchableOpacity style={styles.saveButton} onPress={saveJugadorData}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    infoContainer: {
        marginBottom: 16,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
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
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    image: {
        width: 100,
        height: 100,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FichaJugador;