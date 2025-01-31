import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Contacts from 'expo-contacts';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Button, Image, Modal, PanResponder, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { RequestGetJugadorId } from '../../models/requestGetJugadorId';
import { RequestRegisterUser } from '../../models/requestRegisterUser';
import styles from '../../styles/ConvocateAppStyles'; // Importa los estilos globales
import config from './../../config/config'; // Asegúrate de importar tu configuración

type RootStackParamList = {
    FichaJugadorPartido: { jugadorId: number, partidoId: number, user: string };
    ListaPartidos: undefined;
    CrearPartido: { partidoId: number };
    PrincipalPerfil: undefined;
    FichaPartido: { partidoId: number };
    Login: undefined;
    Register: undefined;
    EditUser: undefined;
    ChangePassword: undefined;
};

const FichaPartido = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const { partidoId } = route.params as { partidoId: number };
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showContainer1, setShowContainer1] = useState<boolean>(true);
    const [contacts, setContacts] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
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
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
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
            const getjugadoridResult = await getjugadoridResponse.json();
            
            if (getjugadoridResponse.status === 200) {
                const jugador = {
                    jugadorId: getjugadoridResult.jugadorId,
                    partidoId: partidoId,
                    estadoJugadorPartidoId: 1,
                    nombreJugador: contact.name,
                    userId: contact.phoneNumbers[0].number.toString().replace(/\s+/g, '').slice(-8),
                };

                const addPlayerResponse = await fetch(config.bffpartidoaddplayermatch, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(jugador)
                });
                const addPlayerResult = await addPlayerResponse.json();
                
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
                const registerResult = await registerResponse.json();
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
                    const responsegetjugadorid = await fetch(`${config.bffpartidogetjugadorid}`, getJugadorIdOptions);   
                    const jugadorData = await responsegetjugadorid.json();
                    const jugador = {
                        jugadorId: jugadorData.jugadorId,  
                        partidoId: partidoId,
                        estadoJugadorPartidoId: 1,
                        nombreJugador: contact.name,
                        userId: userNameNew
                    };
                   
                    const addPlayerResponse = await fetch(config.bffpartidoaddplayermatch, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(jugador)
                    });
                    const addPlayerResult = await addPlayerResponse.json();
                    fetchData(); 
                } else {
                    throw new Error(`HTTP error! status: ${registerResponse.status}`);
                }
            }
        } catch (error) {
            console.error('Error handling contact:', error);
        }

        setModalVisible(false);
    };

    const handleConfirmMatch = () => {
        // Lógica para confirmar o modificar el partido
        alert('Partido confirmado o modificado');
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    const partido = data.partido;
    const jugadores = data.jugadores;

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleAddPlayers}>
                        <Icon name="person-add" size={24} color="#45f500" />
                        <Text style={styles.iconButtonText}>Agregar Jugadores</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleConfirmMatch}>
                        <Icon name="checkmark-circle" size={24} color="#45f500" />
                        <Text style={styles.iconButtonText}>Confirmar Partido</Text>
                    </TouchableOpacity>
                </View>
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
                        {jugadores.map((jugador: any, index: number) => {
                         return (
                                <View key={index} style={[
                                    styles.card,
                                    jugador.descEstadoJugadorPartido === 'Confirmado' ? styles.confirmedCard :
                                    jugador.descEstadoJugadorPartido === 'No confirmado' ? styles.notConfirmedCard :
                                    jugador.descEstadoJugadorPartido === 'Lesion' ? styles.injuredCard : null
                                ]}>
                                    <Image source={require('../../../assets/images/icon/ConvocateApp-jugadornn.png')} style={styles.playerImage} />
                                    <View style={styles.cardBody}>
                                        <Text style={styles.cardTitle}>{jugador.nombreJugador}</Text>
                                        <Text style={styles.cardText}>{jugador.descEstadoJugadorPartido}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => user && navigation.navigate('FichaJugadorPartido', { jugadorId: jugador.jugadorId, partidoId, user })}>
                                        <Icon name="chevron-forward" size={24} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
            <View style={styles.footerContainer}>
                <Footer />
            </View>
        </View>
    );
};

export default FichaPartido;