import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../components/Footer';
import config from '../../config/config';
import { AuthContext } from '../../context/AuthContext';
import { RequestRegisterUser } from '../../models/requestRegisterUser';

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
      <View style={styles.content}>
        <Text style={styles.name}>{profileData.name} {profileData.lastname}</Text>
        <Text style={styles.username}>{profileData.username}</Text>
        <Text style={styles.role}>Rol: {profileData.role}</Text>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EditUser')}>
          <Text style={styles.cardText}>Editar usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.cardText}>Cambiar contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Asignar Rol</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.logoutCard]} onPress={() => {/* Implementar lógica de cierre de sesión */}}>
          <Text style={[styles.cardText, styles.logoutText]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#343a40',
  },
  username: {
    fontSize: 18,
    marginBottom: 16,
    color: '#495057',
  },
  role: {
    fontSize: 18,
    marginBottom: 16,
    color: '#495057',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 18,
    color: '#007bff',
  },
  logoutCard: {
    borderColor: 'red',
    borderWidth: 1,
  },
  logoutText: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PrincipalPerfil;