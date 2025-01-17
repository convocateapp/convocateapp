import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header'; // Asegúrate de que la ruta sea correcta
import config from '../../config/config';
import { RootStackParamList } from '../../types'; // Asegúrate de que la ruta sea correcta
import { Partido } from './../../models/partido';

const ListaPartidos: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [data, setData] = useState<Partido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = await AsyncStorage.getItem('token'); // Recuperar el token directamente
            const user = await AsyncStorage.getItem('user');

            if (!token) {
                setError('Token no encontrado');
                setLoading(false);
                return;
            }

            if (!user) {
                setError('Usuario no encontrado');
                setLoading(false);
                return;
            }

            try {
                const partido = new Partido(
                    0, 
                    user, // Usar el userId del usuario logueado
                    new Date().toISOString(), 
                    new Date().toISOString(), 
                    1, 
                    1, 
                    10000, 
                    1, 
                    new Date().toISOString(), 
                    "Complejo Deportivo", 
                    "Pendiente",
                    "32000",
                    "Futbolito",
                    "Calle 123 # 45-67",
                    "camiseta roja"
                );
                const response = await fetch(config.bffpartidolistbyuser, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(partido)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.log('Error response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    const handleVerFicha = (partidoId: number) => {
        navigation.navigate('FichaPartido', { partidoId });
    };

    const renderItem = ({ item }: { item: Partido }) => (
        <TouchableOpacity style={styles.item} onPress={() => handleVerFicha(item.partidoId)}>
            <Text style={styles.title}>Fecha: {item.fecha} Hora: {item.hora}</Text>
            <Text style={styles.subtitle}>{item.nombreComplejo} - {item.descEstadoPartido}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.header}>Mis Partidos</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.partidoId.toString()}
            />
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CrearPartido')}>
                <Text style={styles.buttonText}>Crear Partido</Text>
            </TouchableOpacity>
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
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        borderColor: '#808080',
        borderWidth:1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ListaPartidos;