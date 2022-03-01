import global from '@/utils/global'
import Swal from 'sweetalert2'
import axios from 'axios'
// import auth from '@/utils/auth'

export default {

    async popAlert(icono, titulo, confirmacion, cancelar, tiempo, textobotonOk) {

        // funciones.popAlert('error', 'UPS! Ha ocurrido un problema', false, false, 3000, '');

        if (confirmacion || cancelar)
            tiempo = null;
        
        let resultado = await Swal.fire({
            position: 'center',
            icon: icono,  // 'error', 'warning', 'success', 'question'
            title: titulo,
            showConfirmButton: confirmacion,
            showCancelButton: cancelar,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: textobotonOk,
            cancelButtonText: "Cancelar",
            timer: tiempo
        })
        return resultado.isConfirmed;
        
    },
    async generarPDFmuestra(pModelo) {

        if(global.DEBUG)
            console.log(pModelo);

        // localStorage.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0cnVlc29mdHdhcmVfZXNwYVx1MDBmMWEiLCJhdWQiOiJ0cnVlc29mdHdhcmVfZXNwYVx1MDBmMWEiLCJpYXQiOjE2NDMyMTc3MjcsImV4cCI6MTY0MzMwNDEyNywiZGF0YSI6eyJ1c2VyX2lkIjozfX0.45aJ-YwwNKvcjzndYIt7C9S-ndCICq8upAt9MYdK-IE";

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        // Componer el envío
        let envio = {
            "objeto": pModelo
        }
        let resultado = await axios.post(global.ENDPOINT_PATH + 'sistema/generarpdfvacio.php', envio, opciones);
            
        if(global.DEBUG)
            console.log("sistema.generarPDFmuestra", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },
    async getListaFuentes() {

        let Google_api_key = "AIzaSyBsPrBMGtuGI9yONrIChthSCvFTMeMWccE";

        let resultado = await axios.get('https://webfonts.googleapis.com/v1/webfonts?sort=ALPHA&key=' + Google_api_key);
        return resultado

    },
    generarUUID1() {
    var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    generarUUID2 (prefix, moreEntropy) {
        //  discuss at: http://locutus.io/php/uniqid/
        // original by: Kevin van Zonneveld (http://kvz.io)
        //  revised by: Kankrelune (http://www.webfaktory.info/)
        //      note 1: Uses an internal counter (in locutus global) to avoid collision
        //   example 1: var $id = uniqid()
        //   example 1: var $result = $id.length === 13
        //   returns 1: true
        //   example 2: var $id = uniqid('foo')
        //   example 2: var $result = $id.length === (13 + 'foo'.length)
        //   returns 2: true
        //   example 3: var $id = uniqid('bar', true)
        //   example 3: var $result = $id.length === (23 + 'bar'.length)
        //   returns 3: true
        if (typeof prefix === 'undefined') {
            prefix = ''
        }
        var retId
        var _formatSeed = function (seed, reqWidth) {
            seed = parseInt(seed, 10).toString(16) // to hex str
            if (reqWidth < seed.length) {
                // so long we split
                return seed.slice(seed.length - reqWidth)
            }
            if (reqWidth > seed.length) {
                // so short we pad
                return Array(1 + (reqWidth - seed.length)).join('0') + seed
            }
             return seed
        }
        var $global = (typeof window !== 'undefined' ? window : global)
        $global.$locutus = $global.$locutus || {}
        var $locutus = $global.$locutus
        $locutus.php = $locutus.php || {}
        if (!$locutus.php.uniqidSeed) {
            // init seed with big random int
            $locutus.php.uniqidSeed = Math.floor(Math.random() * 0x75bcd15)
        }
        $locutus.php.uniqidSeed++
        // start with prefix, add current milliseconds hex string
        retId = prefix
        retId += _formatSeed(parseInt(new Date().getTime() / 1000, 10), 8)
        // add seed hex string
        retId += _formatSeed($locutus.php.uniqidSeed, 5)
        if (moreEntropy) {
            // for more entropy we add a float lower to 10
            retId += (Math.random() * 10).toFixed(8).toString()
        }
        return retId
    },
    datosFuente(txtFuente, todas) {

        let aFuentes = [
            {valor:  0, texto: 'anton',         b: false, i: false},
            {valor:  1, texto: 'arvo',          b: true, i: true},
            {valor:  2, texto: 'audiowide',     b: false, i: false},
            {valor:  3, texto: 'bungee inline', b: false, i: false},
            {valor:  4, texto: 'cabin',         b: true, i: true},
            {valor:  5, texto: 'cookie',        b: false, i: false},
            {valor:  6, texto: 'courier',       b: true, i: true},
            {valor:  7, texto: 'dancing script',b: true, i: false},
            {valor:  8,	texto: 'elsie',         b: true, i: false},
            {valor:  9, texto: 'helvetica',     b: true, i: true},
            {valor: 10, texto: 'lato',          b: true, i: true},
            {valor: 11, texto: 'montserrat',    b: true, i: true},
            {valor: 12, texto: 'open sans',     b: true, i: true},
            {valor: 13, texto: 'oswald',        b: true, i: false},
            {valor: 14, texto: 'patua one',     b: false, i: false},
            {valor: 15, texto: 'pt sans',       b: true, i: true},
            {valor: 16, texto: 'roboto',        b: true, i: true},
            {valor: 17, texto: 'roboto slab',   b: true, i: false},    
            {valor: 18, texto: 'sofia',         b: false, i: false},
            {valor: 19, texto: 'symbol',        b: false, i: false},
            {valor: 20, texto: 'tangerine',     b: true, i: false},
            {valor: 21, texto: 'times',         b: true, i: true},
            {valor: 22, texto: 'titan one',     b: false, i: false},
            {valor: 23, texto: 'trash-hand',    b: false, i: false},
            {valor: 24, texto: 'trirong',       b: true, i: true},
            {valor: 25, texto: 'varela round',  b: false, i: false},
            {valor: 26, texto: 'vollkorn',      b: true, i: true},
            {valor: 27, texto: 'zapfdingbats',  b: false, i: false} 
        ]
        
        if (todas == true) {
            return aFuentes;
        } else {
            return aFuentes[aFuentes.findIndex(x => x.texto === txtFuente)];
        }

    },
    getPreview(pModeloCampos, pTexto) {

        let letra = '';
        let cTabla = '';
        let cCampo = '';
        let cTipo = 'C';
        let acumulando_tabla = false;
        let acumulando_campo = false;
        let txt = '';
        let ncampo = -1;

        for(let t=0; t < pTexto.length; t++) {

            letra = pTexto.substr(t, 1);

            if(letra == '[') {
                // comienza tabla
                acumulando_tabla = true;
            }
            if(letra == ']') {
                // final tabla y campo
                acumulando_tabla = false;
                acumulando_campo = false;

                ncampo = pModeloCampos.findIndex(x => x.tabla === cTabla && x.nombre === cCampo);
                if(ncampo != -1) {
                    cTipo = pModeloCampos[ncampo].tipo;
                    txt += this.getModelo(cTipo, pModeloCampos[ncampo].ancho);                        
                }

                cTabla = '';
                cCampo = '';
                cTipo = 'C';
                ncampo = -1;

            }                
            if(acumulando_tabla && letra == '.') {
                // comienza campo
                acumulando_tabla = false;
                acumulando_campo = true;
            }
            if(acumulando_tabla && letra != '[') {
                cTabla += letra;
            }
            if(acumulando_campo && letra != '.' && letra != ']') {
                cCampo += letra;
            }

            if(!acumulando_tabla && !acumulando_campo && letra != ']') {
                txt += letra;
            }

        }
        return txt;
        
    },
    getModelo(pTipo, pAncho) {

        let ttx = '';
        switch (pTipo) {
            case 'C':
                if (pAncho > 0) {
                    ttx = Array(pAncho + 1).join("X");
                }
                break;

            case 'N': 
                ttx = '-1.234';
                if (pAncho > 0) {
                    ttx += ',' + Array(pAncho + 1).join("0");
                }
                break;

            case 'M':
                ttx = '-1.234,56 €';
                break;

            case 'D':
                ttx = '01/01/2022';
                break;

            case 'T':
                ttx = '01/01/2022 14:30:15 hs';
                break;

            case 'H':
                ttx = '14:30:15 hs';   
                break;

        }
        return ttx;

    },
    async subirAdjunto(pRuta, pArchivo) {
        // sube un fichero al backend

        if(!localStorage.token) {
            return null;
        } else {

            let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

            let formData = new FormData();
            formData.append('file', pArchivo, pRuta + pArchivo['name']);

            var resultado = await axios.post(global.ENDPOINT_PATH + "sistema/recibeAdjuntos.php", formData, opciones);
            return resultado.data;

        }

    },
    async rutaAdjunto(pArchivo) {
        // pide la ruta del adjunto al backend

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        // Objeto consulta
        let consulta = 
        {
            "filename": pArchivo
        }  
        var resultado = await axios.post(global.ENDPOINT_PATH + "sistema/recuperaAdjunto.php", consulta, opciones);
        resultado.data.data[0] = global.ENDPOINT_PATH + resultado.data.data[0].substr(5);
        return resultado.data;


    },    
    formatNumber(valor, monetario, decimales) {

        let nuevo_valor = 0;

        // Quitar todos los puntos
        valor = valor.split('.').join('');

        // Sin coma, agregar ,00xxx
        let posComa = valor.indexOf(',');
        if ( posComa === -1) {
            nuevo_valor = valor;
            if (decimales > 0) {
                nuevo_valor += ',' + Array(decimales + 1).join("0");
                posComa = nuevo_valor.indexOf(',');
            } else {
                posComa = 0;
            }
        } else {
            let ndec = valor.substr(posComa + 1, decimales);
            nuevo_valor = valor.substr(0, posComa);
            if (decimales > 0) {
                nuevo_valor += ',' + ndec + Array(decimales - ndec.length + 1).join("0");
            }
        }
        
        // Poner un punto cada tres digitos
        let v = 0;
        let tmp = '';
        for (let t = posComa - 1; t >= 0; t--) {
            tmp = valor.substr(t, 1) + tmp;
            v++;
            if (v == 3 && t > 0) {
                tmp = '.' + tmp;
                v = 0;
            }
        }
        nuevo_valor = tmp + nuevo_valor.substr(posComa);

        if (monetario) {
            nuevo_valor += ' ' + monetario;
        }

        return nuevo_valor;

    },
    tablaErrores(pCodigo) {

        let litError = {};

        switch (pCodigo) {
            case 'e001':
                litError = { criticidad: 1, literal: "Falta indicar el dato" };
                break;
            case 'e002':
                litError = { criticidad: 2, literal: "Alerta" };
                break;            

        }
        return litError;
    },
    async parseSQL(pCadenaSQL) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        if(global.DEBUG)
            console.log("datos.parseSQL", "datos recibidos como parametros a enviar", pCadenaSQL);
        
        let envio = {
            cadena: pCadenaSQL
        }

        let resultado = await axios.post(global.ENDPOINT_PATH + 'sistema/parseSQL/parseSQL.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("funciones.parseSQL", "datos devueltos back", resultado);
    
        return resultado.data; 

    },
    async ejecutaQuery(pQuery, pFiltros) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        if(global.DEBUG)
            console.log("datos.ejecutaQuery", "datos recibidos como parametros a enviar", pQuery);
        
        // Objeto consulta
        let consulta = 
        {
            "operacion":"EXECUTE",
            "query":pQuery,
            "filtros":pFiltros
        }        
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', consulta, opciones);            
 
        if(global.DEBUG)
            console.log("funciones.parseSQL", "datos devueltos back", resultado);
    
        return resultado.data; 

    },
    



}

