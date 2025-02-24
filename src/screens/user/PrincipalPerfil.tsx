import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import config from '../../config/config';
import { AuthContext } from '../../context/AuthContext';
import { RequestRegisterUser } from '../../models/requestRegisterUser';
import styles from '../../styles/ConvocateAppStyles'; // Importa los estilos globales

type RootStackParamList = {
  PrincipalPerfil: undefined;
  EditUser: undefined;
  ChangePassword: undefined;
};

type PrincipalPerfilScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PrincipalPerfil'
>;

const PrincipalPerfil: React.FC = () => {
  const { token, user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<PrincipalPerfilScreenNavigationProp>();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (token && user) {
        const requestUser = new RequestRegisterUser(user, ''); // Crear el objeto con el username
        const requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestUser)
        };

        try {
          const response = await fetch(config.bffauthgetuser, requestOptions);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          setProfileData(result);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [token, user]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.infoContainer}>
              <Text style={styles.title}>Perfil</Text>
              <Text style={styles.name}>{profileData.name} {profileData.lastname}</Text>
              <Text style={styles.username}>{profileData.username}</Text>
              <Text style={styles.role}>Rol: {profileData.role}</Text>
              <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('EditUser')}>
                <Icon name="person-add" size={24} color="#000" />
                <Text style={styles.title}>Editar usuario</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ChangePassword')}>
              <Icon name="lock-open-outline" size={24} color="#000" />
                <Text style={styles.title}>Cambiar contraseña</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.item}>
                  <Icon name="people-outline" size={24} color="#000"/>
                  <Text style={styles.title}>Asignar Rol</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.item, styles.logoutCard]} onPress={() => {/* Implementar lógica de cierre de sesión */}}>
                <Icon name="remove-circle-outline" size={24} color="red"/>
                <Text style={[styles.title, styles.logoutText]}>Cerrar sesión</Text>
              </TouchableOpacity>
          </View>
      </View>
      <Footer />
    </View>
  );
};

export default PrincipalPerfil;