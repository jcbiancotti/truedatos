import global from '@/utils/global'
import axios from 'axios'

export default {

    async existe (pCorreo) {

        // Comprueba si el correo existe en la tabla de usuarios
        // correo: correo@ejemplo.com

        if(global.DEBUG)
            console.log("datos.existe", "parametros", pCorreo);

        // No requiere el token
        let resultado = await axios.post(global.ENDPOINT_PATH + "auth/existe.php", {'correo': pCorreo});

        if(global.DEBUG)
            console.log("datos.existe", "datos devueltos back", resultado);

        return resultado.data;

    },
    async leerLista(pTabla, pClave, pModelo, pOrden) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        // Objeto consulta
        let consulta = 
        {
            "operacion":"READ",
            "tabla":pTabla,
            "clave":pClave,
            "modelo":pModelo,
            "orden":pOrden
        }        
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', consulta, opciones);
            
        if(global.DEBUG)
            console.log("datos.leerLista", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },
    async grabarHeadDocumento(pObjeto) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"ADD",
            "tabla":'sys_head_documentos',
            "modelo": ["id", "titulo", "version", "activa"],
            "objeto": pObjeto
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.grabarHeadDocumento", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },
    async grabarDocumento(pObjeto) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"ADD",
            "tabla":'sys_documentos',
            "modelo": ["id", "objeto"],
            "objeto": pObjeto
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.grabarDocumento", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },
    async actualizarHeadDocumento(pClave, pObjeto) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"UPDATE",
            "tabla": 'sys_head_documentos',
            "clave": pClave,
            "modelo": ["id", "titulo", "version", "activa"],
            "objeto": pObjeto
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.actualizarHeadDocumento", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },
    async actualizarDocumento(pClave, pObjeto) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"UPDATE",
            "tabla": 'sys_documentos',
            "clave": pClave,
            "modelo": ["id", "objeto"],
            "objeto": pObjeto
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.actualizarDocumento", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },
    async borrarDocumento(pClave) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"DELETE",
            "tabla": 'sys_head_documentos',
            "clave": pClave,
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        envio = {
            "operacion":"DELETE",
            "tabla": 'sys_documentos',
            "clave": pClave,
        }    
        resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.borrarDocumento", "datos devueltos back", resultado);
    
        return resultado.data; 

    },
    async comprobarSQL(pCadena, pFiltros) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        if(global.DEBUG)
            console.log("datos.comprobarSQL", "datos recibidos como parametros a enviar", pCadena, pFiltros);
        
        let envio = {
            cadena: pCadena,
            filtros: pFiltros
        }

        let resultado = await axios.post(global.ENDPOINT_PATH + 'sistema/validarSQL.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.comprobarSQL", "datos devueltos back", resultado);
    
            return resultado.data; 
            
    },
    async grabarEntidad(pObjeto) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"ADD",
            "tabla":'sys_modelo_datos',
            "modelo": ["id", "descripcion", "tipo", "entorno", "objeto"],
            "objeto": pObjeto
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.grabarEntidad", "datos devueltos back", resultado);
    
        return resultado.data; 
    },
    async actualizarEntidad(pClave, pObjeto) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"UPDATE",
            "tabla": 'sys_modelo_datos',
            "clave": pClave,
            "modelo": ["id", "descripcion", "tipo", "entorno", "objeto"],
            "objeto": pObjeto
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.actualizarEntidad", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },    
    async borrarEntidad(pClave) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token } };

        let envio = {
            "operacion": "DELETE",
            "tabla": 'sys_modelo_datos',
            "clave": pClave,
        }
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if (global.DEBUG)
            console.log("datos.borrarDocumento", "datos devueltos back", resultado);
    
        return resultado.data;

    },


}