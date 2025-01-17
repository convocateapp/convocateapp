const config = {
    bffauthlogin: 'http://192.168.0.3:8090/bff-auth/v1/login',   
    bffauthregister: 'http://192.168.0.3:8090/bff-auth/v1/register', 
    bffauthchangepassword: 'http://192.168.0.3:8090/bff-auth/v1/changepassword',
    bffauthgetuser: 'http://192.168.0.3:8090/bff-auth/v1/getuser',
    bffauthupdateuser: 'http://192.168.0.3:8090/bff-auth/v1/updateuser',
    bffpartidolistbyuser: 'http://192.168.0.3:8082/ms-partido/v1/get-match-by-user',
    bffpartidocrearpartido: 'http://192.168.0.3:8085/bff-partido/v1/add-new-match',
    bffpartidogetmatchbyid: 'http://192.168.0.3:8085/bff-partido/v1/get-match-by-id',   
    bffpartidoaddplayermatch: 'http://192.168.0.3:8085/bff-partido/v1/add-player-match',  
    bffpartidogetjugadorid: 'http://192.168.0.3:8085/bff-partido/v1/get-jugador-id',
    bffPartidogetjugador: 'http://192.168.0.3:8085/bff-partido/v1/get-jugador',
    bffPartidoupdatejugador: 'http://192.168.0.3:8085/bff-partido/v1/actualizar-jugador',    
}
export default config;