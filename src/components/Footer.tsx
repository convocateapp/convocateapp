import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type RootStackParamList = {
  FichaJugador: undefined;
  ListaPartidos: undefined;
  PrincipalPerfil: undefined;
  CrearPartido: undefined;
};

const Footer: React.FC = () => {
  type FooterNavigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<FooterNavigationProp>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ListaPartidos')}>
        <Icon name="futbol-o" size={20} color="#45f500" />
        <Text style={styles.menuItemText}>Mis Partidos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FichaJugador')}>
        <Icon name="user" size={20} color="#45f500" />
        <Text style={styles.menuItemText}>Jugador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CrearPartido')}>
        <Icon name="plus-circle" size={20} color="#45f500" />
        <Text style={styles.menuItemText}>Crear Partido</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrincipalPerfil')}>
        <Icon name="user-circle" size={20} color="#45f500" />
        <Text style={styles.menuItemText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#45f500',
    marginTop: 5,
  },
});

export default Footer;