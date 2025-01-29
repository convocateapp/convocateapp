import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../components/Footer';
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
                // Ordenar los partidos por fecha de forma descendente
                const sortedData = result.sort((a: Partido, b: Partido) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
                setData(sortedData);
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

    const renderItem = ({ item }: { item: Partido }) => {
        let itemStyle = styles.item;
        if (item.descEstadoPartido === 'Confirmado') {
            itemStyle = { ...styles.item, ...styles.confirmedCard };
        } else if (item.descEstadoPartido === 'Pendiente') {
            itemStyle = { ...styles.item, ...styles.notConfirmedCard };
        } else {
            itemStyle = { ...styles.item, ...styles.injuredCard };
        }

        return (
            <TouchableOpacity style={itemStyle} onPress={() => handleVerFicha(item.partidoId)}>
                <Text style={styles.title}>Fecha: {item.fecha} Hora: {item.hora}</Text>
                <Text style={styles.subtitle}>{item.nombreComplejo} - {item.descEstadoPartido}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.legendContainer}>
                <Text style={styles.legendText}>Confirmado: <Text style={{ color: '#45f500' }}>●</Text></Text>
                <Text style={styles.legendText}>Pendiente: <Text style={{ color: '#faf200' }}>●</Text></Text>
                <Text style={styles.legendText}>Otro estado: <Text style={{ color: '#ff0000' }}>●</Text></Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.partidoId.toString()}
                contentContainerStyle={styles.listContent}
            />
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#484848',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#333',
    },
    legendText: {
        fontSize: 14,
        color: '#fff',
    },
    listContent: {
        flexGrow: 1,
        padding: 16,
    },
    item: {
        backgroundColor: '#484848',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        borderColor: '#808080',
        borderWidth: 1,
    },
    confirmedCard: {
        borderColor: '#45f500',
        borderTopWidth: 2,
    },
    notConfirmedCard: {
        borderColor: '#faf200',
        borderTopWidth: 2,
    },
    injuredCard: {
        borderColor: '#ff0000',
        borderTopWidth: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
    },
});

export default ListaPartidos;