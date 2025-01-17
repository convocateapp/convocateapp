export class RequestRegisterUser {
    userName: string;
    email: string;
    password: string;
    name: string;
    lastName: string;
    apodo: string;

    constructor(userName: string, name: string) {
        this.userName = userName.trim().slice(-8); // Solo los últimos 8 caracteres
        this.email = "";
        this.password = "1234";
        this.name = name;
        this.lastName = "";
        this.apodo = "";
    }
}