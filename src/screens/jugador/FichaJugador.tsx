import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../../src/context/AuthContext';
import Footer from '../../components/Footer'; // Adjust the path as necessary
import Header from '../../components/Header'; // Adjust the path as necessary
import config from '../../config/config';

// Importar la imagen predeterminada utilizando require
const defaultImage = require('../../../assets/images/icon/ConvocateApp-jugadornn.png');

type RootStackParamList = {
    FichaJugador: { username: string };
};

const FichaJugador = () => {
    const { token, user: username } = useContext(AuthContext); // Obtener token y username del AuthContext
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'FichaJugador'>>();

    const [jugadorId, setJugadorId] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fotoPrincipal, setFotoPrincipal] = useState<string | null>(null);
    const [idEstado, setIdEstado] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState(username); // Inicializar con el username recibido del contexto
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                setFechaNacimiento(formatDate(jugadorData.fechaNacimiento));
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
                setFechaNacimiento(formatDate(result.fechaNacimiento));
                setEmail(result.email);
                setUserName(result.userName);
            } catch (error) {
                Alert.alert('Error', (error as Error).message);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const options = { day: '2-digit' as const, month: '2-digit' as const, year: 'numeric' as const };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>; // Mostrar el mensaje de error

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.infoContainer}>
                <View style={styles.imageRow}>
                    <Image source={fotoPrincipal ? { uri: fotoPrincipal } : defaultImage} style={styles.image} />
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Icon name="image" size={20} color="#45f500" />
                        <Text style={styles.buttonText}>Cargar Imagen</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Jugador ID</Text>
                <Text style={styles.value}>{jugadorId}</Text>

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

                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={saveJugadorData}>
                        <Icon name="save" size={20} color="#45f500" />
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footerContainer}>
                <Footer />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    saveButtonContainer: {
        alignItems: 'flex-end',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: '#45f500',
        marginLeft: 5,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    footerContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
});
export default FichaJugador;