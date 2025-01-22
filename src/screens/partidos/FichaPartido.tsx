import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Contacts from 'expo-contacts'; // Importar expo-contacts
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Button, Modal, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../components/Footer';
import config from '../../config/config';
import { RequestGetJugadorId } from '../../models/requestGetJugadorId';
import { RequestRegisterUser } from '../../models/requestRegisterUser'; // Importar la clase RequestRegisterUser

const FichaPartido = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { partidoId } = route.params as { partidoId: number };
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showContainer1, setShowContainer1] = useState<boolean>(true);
    const [contacts, setContacts] = useState<any[]>([]); // Cambiar el tipo a any[]
    const [modalVisible, setModalVisible] = useState<boolean>(false); // Definir el estado modalVisible
    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        const fetchTokenAndUser = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            setToken(storedToken);
            setUser(storedUser);
        };

        fetchTokenAndUser();
    }, []);

    const fetchData = async () => {
        if (token && user) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ partidoId: partidoId.toString(), userId: user })
            };

            try {
                const response = await fetch(config.bffpartidogetmatchbyid, requestOptions);
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
    }, [token, user, partidoId]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx > 50) {
                    setShowContainer1(true);
                } else if (gestureState.dx < -50) {
                    setShowContainer1(false);
                }
            },
            onPanResponderRelease: () => {
                Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            },
        })
    ).current;

    const handleAddPlayers = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access contacts was denied');
            return;
        }

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
            setContacts(data);
            setModalVisible(true);
        }
    };

    const handleSelectContact = async (contact: any) => {
        console.log('Contacto seleccionado:', contact);

        const telefono = contact.phoneNumbers[0].number.replace(/\D/g, ''); // Eliminar caracteres no numéricos
        const userNameNew = telefono.slice(-8); // Solo los últimos 8 caracteres

        const getUserOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userNameNew })
        };

        try {
            const getjugadoridResponse = await fetch(`${config.bffpartidogetjugadorid}`, getUserOptions);

            if (getjugadoridResponse.status === 200) {
                const jugadorData = await getjugadoridResponse.json();
                const jugador = {
                    jugadorId: jugadorData.jugadorId,
                    partidoId: partidoId,
                    estadoJugadorPartidoId: 1,
                    nombreJugador: contact.name,
                    userId: contact.phoneNumbers[0].number.toString().replace(/\s+/g, '').slice(-8),
                };

                await fetch(config.bffpartidoaddplayermatch, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(jugador)
                });

                fetchData(); // Invocar nuevamente el método get-match-by-id
            } else {
                const registerUser = new RequestRegisterUser(telefono, contact.name);

                const registerOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(registerUser)
                };

                const registerResponse = await fetch(`${config.bffauthregister}`, registerOptions);
               
                if (registerResponse.status === 200) {
                    
                    const requestGetJugadorId = new RequestGetJugadorId(userNameNew);
                    const getJugadorIdOptions = {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(requestGetJugadorId)
                    };
                  //  console.log('== requestGetJugadorId: ', requestGetJugadorId.UserName);
                    const responsegetjugadorid = await fetch(`${config.bffpartidogetjugadorid}`, getJugadorIdOptions);   
                    const jugadorData = await responsegetjugadorid.json();
                    const jugador = {
                        jugadorId: jugadorData.jugadorId,  
                        partidoId: partidoId,
                        estadoJugadorPartidoId: 1,
                        nombreJugador: contact.name,
                        userId: userNameNew
                    };
                   
                    await fetch(config.bffpartidoaddplayermatch, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(jugador)
                    });

                    fetchData(); // Invocar nuevamente el método get-match-by-id
                } else {
                    throw new Error(`HTTP error! status: ${registerResponse.status}`);
                }
            }
        } catch (error) {
            console.error('Error handling contact:', error);
        }

        setModalVisible(false);
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>; // Mostrar el mensaje de error

    const partido = data.partido;
    const jugadores = data.jugadores;

    return (
        <View style={styles.container}>

            <Animated.View {...panResponder.panHandlers} style={[pan.getLayout()]}>
                {showContainer1 ? (
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}><Text style={styles.boldText}>Tipo Partido:</Text> {partido.tipoPartido}</Text>
                        <Text style={styles.infoText}><Text style={styles.boldText}>Fecha:</Text> {partido.fecha}</Text>
                        <Text style={styles.infoText}><Text style={styles.boldText}>Hora:</Text> {partido.hora}</Text>
                        <Text style={styles.infoText}><Text style={styles.boldText}>Complejo:</Text> {partido.nombreComplejo}</Text>
                        <Text style={styles.infoText}><Text style={styles.boldText}>N°Cancha:</Text> {partido.numeroCancha}</Text>
                    </View>
                ) : (
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}><Text style={styles.boldText}>Partido Id:</Text> {partido.partidoId}</Text>
                        <Text style={styles.infoText}><Text style={styles.boldText}>Estado:</Text> {partido.descEstadoPartido.trim()}</Text>
                        <Text style={styles.infoText}><Text style={styles.boldText}>Ubicación:</Text> {partido.ubicacionComplejo}</Text>
                        <Text style={styles.infoText}><Text style={styles.boldText}>Observación:</Text> {partido.observacion}</Text>
                    </View>
                )}
            </Animated.View>
            <View style={styles.indicatorContainer}>
                <View style={[styles.indicator, showContainer1 && styles.activeIndicator]} />
                <View style={[styles.indicator, !showContainer1 && styles.activeIndicator]} />
            </View>
            <Button title="Agregar Jugadores" onPress={handleAddPlayers} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Seleccionar Contactos</Text>
                        <ScrollView style={styles.modalScrollView}>
                            {contacts.map((contact, index) => (
                                <TouchableOpacity key={index} style={styles.contactItem} onPress={() => handleSelectContact(contact)}>
                                    <Text style={styles.contactText}>{contact.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            <View style={styles.jugadoresContainer}>
                <Text style={styles.subHeader}>Convocados ({jugadores.filter((jugador: any) => jugador.estadoJugador === '1').length} de {jugadores.length})</Text>
                <ScrollView style={styles.scrollView}>
                    {jugadores.map((jugador: any, index: number) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{jugador.nombreJugador}</Text>
                                <Text style={styles.cardText}>{jugador.descEstadoJugadorPartido}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <Footer />
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
    subHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#495057',
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
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#495057',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#212529',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ced4da',
        marginHorizontal: 5,
    },
    activeIndicator: {
        backgroundColor: '#495057',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalScrollView: {
        width: '100%',
    },
    contactItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    contactText: {
        fontSize: 16,
    },
    jugadoresContainer: {
        flex: 1,
    },
    scrollView: {
        maxHeight: 450,
    },
    card: {
        backgroundColor: '#ffffff',
        borderColor: '#ced4da',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
    },
    cardText: {
        fontSize: 14,
        color: '#6c757d',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FichaPartido;