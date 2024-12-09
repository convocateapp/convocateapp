import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import config from '../../config/config';
import { RootStackParamList } from '../../types'; // Adjust the path as necessary

const CrearPartido: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [tipoPartido, setTipoPartido] = useState('0'); // Estado para Tipo Partido
    const [nombreComplejo, setNombreComplejo] = useState('');
    const [descEstadoPartido, setDescEstadoPartido] = useState('Pendiente'); // Asignar valor "Pendiente"
    const [ubicacion, setUbicacion] = useState('');
    const [valorCancha, setValorCancha] = useState('');

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    useEffect(() => {
        setDescEstadoPartido('Pendiente'); // Asegurarse de que el valor sea "Pendiente"
    }, []);

    const handleConfirmDate = (date: Date) => {
        setFecha(date.toISOString().split('T')[0]);
        setDatePickerVisibility(false);
    };

    const handleConfirmTime = (time: Date) => {
        setHora(time.toTimeString().split(' ')[0].substring(0, 5));
        setTimePickerVisibility(false);
    };

    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        const fechaHora = `${fecha}T${hora}:00.000Z`; // Combina fecha y hora en un solo campo

        const partido = {
            partidoId: 0,
            fecha: fechaHora,
            hora: fechaHora,
            complejoId: 1, // Valor fijo para complejoId
            numeroCancha: 10,
            valorPersona: 0,
            estadoPartidoId: 1,
            fechaCreacion: fechaHora,
            userId: user,
            valorCancha: "10000",
            tipoPartido : tipoPartido,
            ubicacionComplejo: "ubicacion",
            nombreComplejo:"otro",
            observacion: "nuev obs"
            
        };

        console.log('partido fecha:', partido.fecha);
        console.log('partido hora:', partido.hora);
        console.log('partido complejoId:', partido.complejoId);
        console.log('url :', config.bffpartidocrearpartido);
        console.log('token:', token);
        console.log('user:', user);   
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

            if (!response.ok) {
                const errorText = await response.text();
                    console.log('Error response:', errorText);
                  //  throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                throw new Error('Error al crear el partido');
            }

            navigation.navigate('ListaPartidos'); // Navegar de vuelta a la lista de partidos
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Error al crear el partido');
        }
    };

    const handleRepetirAnterior = async () => {
        // Lógica para repetir el último partido creado
        // Puedes implementar esta función según tus necesidades
        Alert.alert('Repetir Anterior', 'Funcionalidad no implementada');
    };

    return (
        <View style={styles.container}>
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
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Fecha (YYYY-MM-DD)"
                    value={fecha}
                    editable={false}
                />
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={() => setDatePickerVisibility(false)}
            />
            <TouchableOpacity onPress={() => setTimePickerVisibility(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Hora (HH:MM)"
                    value={hora}
                    editable={false}
                />
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={() => setTimePickerVisibility(false)}
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre del Complejo"
                value={nombreComplejo}
                onChangeText={setNombreComplejo}
            />
            <TextInput
                style={styles.input}
                placeholder="Ubicación Complejo"
                value={ubicacion}
                onChangeText={setUbicacion}
            />
            <TextInput
                style={styles.input}
                placeholder="Valor Cancha"
                value={valorCancha}
                onChangeText={setValorCancha}
            />
            <TextInput
                style={styles.input}
                placeholder="Estado del Partido"
                value={descEstadoPartido}
                editable={false} // Hacer el campo no editable
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Crear Partido</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRepetirAnterior}>
                <Text style={styles.buttonText}>Repetir Convocatoria Anterior</Text>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    pickerContainer: {
        height: 50, // Aumentar la altura para asegurar que el contenido sea visible
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        justifyContent: 'center',
    },
    picker: {
        height: 50, // Aumentar la altura para asegurar que el contenido sea visible
        width: '100%',
        color: 'black', // Asegúrate de que el texto sea visible
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

export default CrearPartido;