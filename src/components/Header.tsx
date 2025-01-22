import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import config from '../config/config';
import { AuthContext } from '../context/AuthContext';
import { RequestRegisterUser } from '../models/requestRegisterUser';

const Header: React.FC = () => {
  const { token, user } = useContext(AuthContext);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
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
          setName(result.name); // Guardar el nombre en el estado
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
    };

    fetchUsername();
  }, [token, user]);

  return (
    <View style={styles.header}>
      <Text style={styles.username}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  username: {
    fontSize: 18,
  },
});

export default Header;