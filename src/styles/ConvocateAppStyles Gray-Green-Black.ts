// Green gray font black
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dadada',
        color: '#000',
    },
    content: {
        flex: 1,
        padding: 16,
    },
	header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#343a40',
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#000',
    },
    infoContainer: {
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
	 infoText: { 
        fontSize: 16,
        marginBottom: 8,
        color: '#000',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ced4da',
        marginHorizontal: 5,
    },
    activeIndicator: {
        backgroundColor: '#495057',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    image: {
        width: 100,
        height: 100,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#000', // Cambiar el color del texto a blanco
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
        color: '#000', // Cambiar el color del texto a blanco
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    iconButtonText: {
        color: '#45f500',
        marginLeft: 5,
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#45f500',
        marginLeft: 5,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalScrollView: {
        width: '100%',
    },
    contactItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    contactText: {
        fontSize: 16,
    },
    jugadoresContainer: {
        flex: 1,
    },
    scrollView: {
        maxHeight: 450,
    },
    card: {
        backgroundColor: '#ffffff ', // Cambiar el color de fondo aquí
       // borderColor: '#45f500',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    confirmedCard: {
        borderLeftColor: '#45f500',
        borderLeftWidth: 5,
        backgroundColor:'#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderTopColor: '#a1a1a1',
        borderRightColor: '#a1a1a1',
        borderBottomColor: '#a1a1a1'
    },
    notConfirmedCard: {
        borderLeftColor: '#faf200',
        borderLeftWidth: 5,
        backgroundColor:'#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderTopColor: '#a1a1a1',
        borderRightColor: '#a1a1a1',
        borderBottomColor: '#a1a1a1'
        
    },
    injuredCard: {
        borderLeftColor: '#ff0000',
        borderLeftWidth: 5,
        backgroundColor:'#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderTopColor: '#a1a1a1',
        borderRightColor: '#a1a1a1',
        borderBottomColor: '#a1a1a1'
    },
    playerImage: {
        width: 50,
        height: 50,
        marginRight: 16,
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    cardText: {
        fontSize: 14,
        color: '#000',
    },
    arrowButton: {
        padding: 8,
        backgroundColor: 'transparent',
        borderRadius: 4,
    },
    
    footerContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#333',
    },
    legendText: {
        fontSize: 14,
        color: '#fff',
    },
    listContent: {
        flexGrow: 1,
        padding: 16,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        //borderColor: '#808080',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        color: '#000',
    },
    
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderBottomColor: '#a1a1a1',
        borderBottomWidth: 1,
        marginBottom: 20,
        color: '#575757',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    saveButtonContainer: {
        alignItems: 'flex-end',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignSelf: 'flex-end',
    },
   
    headerContainer: {
        width: '100%',
    },
    
    
    textArea: {
        height: 100, // Ajustar la altura para el campo de texto multilinea
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
         
      logoutCard: {
        borderColor: 'red',
        borderWidth: 1,
      },
      logoutText: {
        color: 'red',
      },
      iconButtonLong: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        width: '80%', 
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 1,
        marginLeft: 10,
    },
    halfInputContainer: {
        flex: 1,
    },
      
    
    // Agrega otros estilos globales aquí
});

export default styles;