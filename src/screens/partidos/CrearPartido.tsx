import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import config from '../../config/config';
import styles from '../../styles/ConvocateAppStyles'; // Importa los estilos globales

type RootStackParamList = {
    FichaPartido: { partidoId: string };
    ListaPartidos: undefined;
};

const CrearPartido: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [tipoPartido, setTipoPartido] = useState('0'); // Estado para Tipo Partido
    const [nombreComplejo, setNombreComplejo] = useState('');
    const [descEstadoPartido, setDescEstadoPartido] = useState('Pendiente'); // Asignar valor "Pendiente"
    const [ubicacionComplejo, setUbicacionComplejo] = useState('');
    const [valorCancha, setValorCancha] = useState('');
    const [numeroCancha, setNumeroCancha] = useState('');
    const [observacion, setObservacion] = useState('');

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        setDescEstadoPartido('Pendiente'); // Asegurarse de que el valor sea "Pendiente"
    }, []);

    const handleConfirmDate = (date: Date) => {
        setFecha(date.toISOString().split('T')[0]);
        setDatePickerVisibility(false);
    };

    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        const fechaHora = `${fecha}T${hora}:00.000Z`; // Combina fecha y hora en un solo campo

        const partido = {
            fecha: fechaHora,
            hora: fechaHora,
            numeroCancha: parseInt(numeroCancha, 10),
            userId: user,
            valorCancha,
            tipoPartido,
            ubicacionComplejo,
            nombreComplejo,
            observacion
        };

        console.log('partido fecha:', partido.fecha);
        console.log('partido hora:', partido.hora);

        try {
            const response = await fetch(config.bffpartidocrearpartido, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(partido)
            });

            // Agregar más información de depuración
            console.log('Response status:', response.status);
            const responseBody = await response.text();
            console.log('Response body:', responseBody);

            if (!response.ok) {
                throw new Error(`Error al crear el partido: ${response.status} - ${responseBody}`);
            }

            if (responseBody) {
                const result = JSON.parse(responseBody);
                console.log('PartidoId:', result.partidoId);
                navigation.navigate('FichaPartido', { partidoId: result.partidoId }); // Navegar a FichaPartidos con el partidoId
            } else {
                console.log('Respuesta vacía del servidor');
                Alert.alert('Éxito', 'El partido se ha creado correctamente, pero no se recibió un ID de partido.');
                navigation.navigate('ListaPartidos'); // Navegar a ListaPartidos si no se recibe un ID de partido
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', `Error al crear el partido: ${(error as Error).message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <View style={styles.infoContainer}>
                    <Text style={styles.header}>Crear Partido</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={tipoPartido}
                            style={styles.picker}
                            onValueChange={(itemValue) => setTipoPartido(itemValue)}
                        >
                            <Picker.Item label="Seleccionar Tipo Partido" value="0" />
                            <Picker.Item label="Baby Futbol" value="1" />
                            <Picker.Item label="Futbolito" value="2" />
                            <Picker.Item label="Futbol" value="3" />
                        </Picker>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.halfInputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Fecha (YYYY-MM-DD)"
                                value={fecha}
                                editable={false}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Hora (HH:MM)"
                            value={hora}
                            onChangeText={setHora}
                        />
                    </View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Número de Cancha"
                            value={numeroCancha}
                            onChangeText={setNumeroCancha}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Valor Cancha"
                            value={valorCancha}
                            onChangeText={setValorCancha}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del Complejo"
                        value={nombreComplejo}
                        onChangeText={setNombreComplejo}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Ubicación Complejo"
                        value={ubicacionComplejo}
                        onChangeText={setUbicacionComplejo}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Observación"
                        value={observacion}
                        onChangeText={setObservacion}
                        multiline={true}
                        numberOfLines={4}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Icon name="add-circle" size={20} color="#45f500" />
                            <Text style={styles.buttonText}>Crear Partido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.footerContainer}>
                <Footer />
            </View>
        </View>
    );
};

export default CrearPartido;