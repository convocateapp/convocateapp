import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
//import ConvocateAppJugadorNN from '../../../assets/images/icon/ConvocateApp-jugadornn.png'; // Importar la imagen predeterminada
import { useFetch } from '../../hooks/useFetch'; // Ajusta la ruta según la estructura de tu proyecto
import { Partido } from '../../models/partido';

const FichaPartido = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { partidoId } = route.params as { partidoId: number };
    const [mensaje, setMensaje] = useState('');
    const [filter, setFilter] = useState('todos'); // Estado para el filtro

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const fetchTokenAndUser = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            setToken(storedToken);
            setUser(storedUser);
        };

        fetchTokenAndUser();
    }, []);

    const url = "" ; //config.UrlObtenerConvocatoriaPartido; // Usar la URL desde la configuración

    useEffect(() => {
        console.log('FichaPartido url:', url);
        console.log('FichaPartido Token:', token);
        console.log("FichaPartido partidoId y user " + partidoId + " " + user);
    }, [url, token, partidoId, user]);

    const partido = new Partido(
        partidoId, 
        user || '', // Usar el userId del usuario logueado
        new Date().toISOString(), 
        new Date().toISOString(), 
        1, 
        1, 
        10000, 
        1, 
        new Date().toISOString(), 
        "Complejo Deportivo", 
        "Pendiente"
    );

    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(partido)
    };

    const { data, error, loading } = useFetch(url, options);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error.message}</Text>; // Mostrar el mensaje de error

    const handleVolver = () => {
        navigation.goBack(); // Navegar hacia atrás en el historial
    };

    const actualizarEstadoJugador = async (jugadorId: number, estadoJugadorPartidoId: number, nombreJugador: string) => {
        const urlActualizar = "" ; //config.UrlActualizarJugadorPartido; // URL para actualizar el estado del jugador
        const body = {
            jugadorId,
            partidoId,
            estadoJugadorPartidoId,
            nombreJugador,
            userId: user
        };

        try {
            const response = await fetch(urlActualizar, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado del jugador');
            }

            setMensaje('Se ha realizado la confirmación');
            setTimeout(() => setMensaje(''), 5000); // Limpiar el mensaje después de 5 segundos
            navigation.goBack(); // Navegar hacia atrás en el historial para actualizar la lista de jugadores
        } catch (error) {
            setMensaje('No fue posible confirmar, intente nuevamente.');
            setTimeout(() => setMensaje(''), 5000); // Limpiar el mensaje después de 5 segundos
            console.error('Error:', error);
        }
    };

    // Determinar el estado del jugador para mostrar el botón correspondiente
    const estadoJugador = data.jugadores.some((jugador: any) => jugador.estadoJugador === '1') ? '1' : '2';

    // Filtrar jugadores según el filtro seleccionado
    const jugadoresFiltrados = data.jugadores.filter((jugador: any) => {
        if (filter === 'todos') return true;
        if (filter === 'confirmados') return jugador.estadoJugador === '1';
        if (filter === 'no_confirmados') return jugador.estadoJugador !== '1';
        return true;
    });

    // Calcular la cantidad de jugadores confirmados y el total de convocados
    const cantidadConfirmados = data.jugadores.filter((jugador: any) => jugador.estadoJugador === '1').length;
    const cantidadTotal = data.jugadores.length;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ficha Partido</Text>
            {estadoJugador === '1' ? (
                <Button 
                    title="Rechazar"
                    color="red"
                    onPress={() => {
                        const jugador = data.jugadores.find((j: any) => j.estadoJugador === '1');
                        actualizarEstadoJugador(jugador.jugadorId, 2, jugador.nombreJugador);
                    }}
                />
            ) : (
                <Button 
                    title="Confirmar"
                    color="green"
                    onPress={() => {
                        const jugador = data.jugadores.find((j: any) => j.estadoJugador !== '1');
                        actualizarEstadoJugador(jugador.jugadorId, 1, jugador.nombreJugador);
                    }}
                />
            )}
            {mensaje && <Text style={styles.alert}>{mensaje}</Text>}
            <View style={styles.infoContainer}>
                <Text><strong>Fecha :</strong> {data.fechaPartido}</Text>
                <Text><strong>Hora :</strong> {data.horaPartido}</Text>
                <Text><strong>Complejo :</strong> {data.nombreComplejo}</Text>
                <Text><strong>N°Cancha :</strong> {data.numeroCancha}</Text>
                <Text><strong>Valor :</strong> {data.valor}</Text>
                <Text><strong>Estado :</strong> {data.estadoPartido.trim()}</Text>
            </View>
            <View style={styles.jugadoresContainer}>
                <Text style={styles.header}>Convocados ({cantidadConfirmados} de {cantidadTotal})</Text>
                <ScrollView style={styles.scrollView}>
                    {jugadoresFiltrados.map((jugador: any, index: number) => (
                        <View key={index} style={styles.card}>
                         
                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{jugador.nombreJugador}</Text>
                                <Text style={styles.cardText}>{jugador.descEstadoJugadorPartido}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <Button title="Volver" onPress={handleVolver} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    alert: {
        color: 'blue',
        marginBottom: 16,
    },
    infoContainer: {
        marginBottom: 16,
    },
    jugadoresContainer: {
        flex: 1,
    },
    scrollView: {
        maxHeight: 450,
    },
    card: {
        backgroundColor: 'white',
        color: 'grey',
        borderColor: 'green',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 8,
        borderRadius: 8,
    },
    image: {
        height: 70,
        width: 70,
        borderRadius: 8,
        marginRight: 8,
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 14,
        color: 'grey',
    },
});

export default FichaPartido;