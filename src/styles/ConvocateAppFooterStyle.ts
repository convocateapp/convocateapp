import { StyleSheet } from 'react-native';

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

  export default styles;