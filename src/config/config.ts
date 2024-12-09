const config = {
    bffauthlogin: 'http://192.168.1.83:8090/bff-auth/v1/login',   
    bffauthregister: 'http://192.168.1.83:8090/bff-auth/v1/register', 
    bffauthchangepassword: 'http://192.168.1.83:8090/bff-auth/v1/changepassword',
    bffauthgetuser: 'http://192.168.1.83:8090/bff-auth/v1/getuser',
    bffauthupdateuser: 'http://192.168.1.83:8090/bff-auth/v1/updateuser',
    bffpartidolistbyuser: 'http://192.168.1.83:8082/ms-partido/v1/get-match-by-user',
    bffpartidocrearpartido: 'http://192.168.1.83:8085/bff-partido/v1/add-new-match',
};

export default config;