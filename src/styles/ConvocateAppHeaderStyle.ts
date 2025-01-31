import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      width: '100%',
      backgroundColor: '#000', // Degradado de izquierda a derecha
      borderBottomColor: '#45f500',
      borderBottomWidth: 3,
    },
    appName: {
      fontSize: 18,
      color: '#ffffff',
    },
    usernameContainer: {
      flex: 1,
      alignItems: 'flex-end',
      
    },
    username: {
      fontSize: 18,
      color: '#ffffff',
    },
  });

  export default styles;