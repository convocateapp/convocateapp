import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../context/AuthContext';

type RootStackParamList = {
  FichaJugador: undefined;
  ListaPartidos: undefined;
  PrincipalPerfil: undefined;
};

const Footer: React.FC = () => {
  const { token, user } = useContext(AuthContext);
  type FooterNavigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<FooterNavigationProp>();

 // console.log('====  footer user:', user);
  
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FichaJugador')}>
        <Icon name="user" size={20} color="#007bff" />
        <Text style={styles.menuItemText}>Jugador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ListaPartidos')}>
        <Icon name="futbol-o" size={20} color="#007bff" />
        <Text style={styles.menuItemText}>Partidos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrincipalPerfil')}>
        <Icon name="user-circle" size={20} color="#007bff" />
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
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 5,
  },
});

export default Footer;