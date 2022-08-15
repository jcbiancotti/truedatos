import global from '@/utils/global'
import axios from 'axios'
import store from '@/store'

export default {

    async getUserLogged() {

        if(!localStorage.token) {

            // No existe token
            if(global.DEBUG)
                console.log("getUserLogged", "No existe token en las variables de sesion");
            
            store.commit('marcaLogged', false);
            store.commit('marcaFullName', ''); 

            return null;

        } else {

            // Existe un token. Comprobar que es válido
            let resultado = await axios.post(global.ENDPOINT_PATH + "auth/user_info.php", {}, { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} });

            if(resultado.data.success == 1 && resultado.data.status == 200){

                // Token válido, devuelve datos del usuario
                if(global.DEBUG)
                    console.log("auth.getUserLogged", "Token valido, devuelve datos del usuario", resultado.data, resultado.data.data.nombre);
                
                store.commit('marcaLogged', true);
                store.commit('marcaFullName', resultado.data.data.nombre); 

                return resultado.data;

            } else {

                // Token NO válido, borra las variables de sesion y devuelve null
                if(global.DEBUG)
                    console.log("getUserLogged", "Token NO valido, borra variables de sesion y devuelve null", resultado, "Token:", localStorage.token);
                
                store.commit('marcaLogged', false);
                store.commit('marcaFullName', ''); 

                this.deleteUserLogged();
                return null;

            }

        }

    },
    deleteUserLogged() {

        if(global.DEBUG)
            console.log("deleteUserLogged", "Borrando todas las variables de sesion");

        localStorage.clear();
        store.commit('marcaLogged', false);
        store.commit('marcaFullName', ''); 

    },
    async login(pUsuario, pPassword) {

        if(global.DEBUG)
            console.log("login", "Parametros recibidos para hacer login", pUsuario, pPassword);

        const envio = { correo: pUsuario, contrasenia: pPassword };
        let retorno = await axios.post(global.ENDPOINT_PATH + "auth/login.php", envio);

        if(global.DEBUG)
            console.log("login", "Respuesta recibida desde back", retorno);  
        
        return retorno.data;
    
    }



}