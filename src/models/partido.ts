export class Partido {
    partidoId: number;
    fecha: string;
    hora: string;
    complejoId: number;
    numeroCancha: number;
    valorPersona: number;
    estadoPartidoId: number;
    fechaCreacion: string;
    userId: string;
    nombreComplejo: string;
    descEstadoPartido: string;
    valorCancha: string;
    tipoPartido: string;
    ubicacionComplejo: string;
    observacion: string;    

    constructor(
        partidoId: number,
        userId: string,
        fecha: string,
        hora: string,
        complejoId: number,
        numeroCancha: number,
        valorPersona: number,
        estadoPartidoId: number,
        fechaCreacion: string,
        nombreComplejo: string,
        descEstadoPartido: string,
        valorCancha: string,
        tipoPartido: string,
        ubicacionComplejo: string,
        observacion: string,
    ) {
        this.partidoId = partidoId,
        this.userId = userId;
        this.fecha = fecha;
        this.hora = hora;
        this.complejoId = complejoId;
        this.numeroCancha = numeroCancha;
        this.valorPersona = valorPersona;
        this.estadoPartidoId = estadoPartidoId;
        this.fechaCreacion = fechaCreacion;
        this.nombreComplejo = nombreComplejo;
        this.descEstadoPartido = descEstadoPartido;
        this.valorCancha = valorCancha;         
        this.tipoPartido = tipoPartido;
        this.ubicacionComplejo = ubicacionComplejo;
        this.observacion        =    observacion;
    }
}