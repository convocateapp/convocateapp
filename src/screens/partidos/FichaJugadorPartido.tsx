import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import config from '../../config/config';

const defaultImage = require('../../../assets/images/icon/ConvocateApp-jugadornn.png');

type RootStackParamList = {
    FichaJugadorPartido: { jugadorId: number, partidoId: number, user: string };
};

const FichaJugadorPartido = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'FichaJugadorPartido'>>();
    const { jugadorId, partidoId, user } = route.params;
    const [token, setToken] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };

        fetchToken();
    }, []);

    const fetchData = async () => {
        if (token) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ jugadorId })
            };

            try {
                const response = await fetch(`${config.bffPartidogetjugador}`, requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, jugadorId]);

    const handleConfirmPlayer = async () => {
        if (token) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jugadorId: jugadorId,
                    partidoId: partidoId,
                    estadoJugadorPartidoId: 1,
                    nombreJugador: "", //data.nombreJugador,
                    userId: user,
                }),
            };

            try {
                const response = await fetch(config.bffPartidoconfirmjugador, requestOptions);
                const result = await response.json();
                console.log('=== handleConfirmPlayer response: ', result);
                if (response.ok) {
                    Alert.alert('Éxito', 'Jugador confirmado correctamente');
                } else {
                    throw new Error(result.title || 'Error al confirmar jugador');
                }
            } catch (error) {
                console.error('Error confirming player:', error);
                Alert.alert('Error', (error as Error).message);
            }
        }
    };

    const handleDeletePlayer = async () => {
        if (token) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jugadorId: jugadorId,
                    partidoId: partidoId,
                    estadoJugadorPartidoId: 2,
                    nombreJugador: data.nombreJugador,
                    userId: data.userId,
                }),
            };

            try {
                const response = await fetch(config.bffPartidodeletejugador, requestOptions);
                const result = await response.json();
                console.log('=== handleDeletePlayer response: ', result);
                if (response.ok) {
                    Alert.alert('Éxito', 'Jugador eliminado correctamente');
                } else {
                    throw new Error(result.title || 'Error al eliminar jugador');
                }
            } catch (error) {
                console.error('Error deleting player:', error);
                Alert.alert('Error', (error as Error).message);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const options = { day: '2-digit' as const, month: '2-digit' as const, year: 'numeric' as const };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <View style={styles.infoContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={data.fotoPrincipal ? { uri: data.fotoPrincipal } : defaultImage} style={styles.image} />
                    </View>
                    <Text style={styles.label}>Jugador ID</Text>
                    <Text style={styles.value}>{data.jugadorId}</Text>

                    <Text style={styles.label}>Nombres</Text>
                    <Text style={styles.value}>{data.nombres}</Text>

                    <Text style={styles.label}>Teléfono</Text>
                    <Text style={styles.value}>{data.telefono}</Text>

                    <Text style={styles.label}>ID Estado</Text>
                    <Text style={styles.value}>{data.idEstado}</Text>

                    <Text style={styles.label}>Fecha Nacimiento</Text>
                    <Text style={styles.value}>{formatDate(data.fechaNacimiento)}</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{data.email}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPlayer}>
                        <Icon name="checkmark-circle" size={20} color="#45f500" />
                        <Text style={styles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePlayer}>
                        <Icon name="trash" size={20} color="#45f500" />
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#484848',
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    infoContainer: {
        marginBottom: 16,
        backgroundColor: '#484848',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    image: {
        width: 100,
        height: 100,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#fff', // Cambiar el color del texto a blanco
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
        color: '#fff', // Cambiar el color del texto a blanco
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#45f500',
        marginLeft: 5,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
export default FichaJugadorPartido;