// src/types.ts
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ListaPartidos : undefined;
    CrearPartido: undefined;
    FichaPartido: { partidoId: number };
    FichaJugador: { username: string };
        ChangePassword:undefined;
        EditUser:undefined;   
    // Agrega otras rutas aquí si es necesario
  };