<template>
<div>

    <form action @submit.prevent="cero">

        <table id="texto-tmp" class="texto-tmp">
            <tr>
                <td>
                    <span>Fuente:<truefuentes id="txtFuente" :valor="txtFuente" @getData="getData"/></span>
                </td>                                  
                <td>
                    <label class="content-input">
                        <input type="checkbox" v-model="txtEstilo" :disabled="!enbEstilo">Negrita
                        <i></i>
                        <MDBBadge notification v-if="!enbEstilo" color="danger" pill>NO</MDBBadge>
                    </label><br>  
                </td>
                <td>
                    <label class="content-input">
                        <input type="checkbox" v-model="txtItalica" :disabled="!enbItalica">It&aacute;lica
                        <i></i>
                        <MDBBadge notification v-if="!enbItalica" color="danger" pill>NO</MDBBadge>
                    </label>
                </td>
                <td>
                    <label class="content-input">
                        <input type="checkbox" v-model="txtSubrayado">Subrayado
                        <i></i>
                    </label>       
                </td>
                <td>
                    <span>Color del texto:<truecolor :color="txtColor" compo="txtColorEncabezado" :destino="poneColor"/></span>
                </td>
                <td>
                    <label for="tamanio">Tama&ntilde;o</label>
                    <input type="number" id="tamanio" min="1" :max="`${modelo.oHeader.height}`" v-model="txtTamanio">pt.
                </td>                                
            </tr>
            <tr>
                <td colspan="3">
                    <input type="text" class="form-control" id="txtTexto"
                        :class="{conerror : hayerror == 1, sinerror : hayerror == 0}"
                        v-model="txtTexto"
                        :style="`${'height:auto;font-family:' + txtFuente + ';font-weight:' + cssEstilo + ';font-style: ' + cssItalica + ';text-decoration:' + cssSubrayado + ';font-size:' + txtTamanio + 'pt;color:' + txtColor + ';background-color:' + txtBkColor}`" 
                        placeholder="Escribe aquí el texto que deseas incluir"
                    >
                    <p style="font-size: 8pt;">Para indicar que es un campo de una tabla debes encerrarlo entre corchetes. Por ejemplo: Fecha [facturas.fecha_factura]</p>
                </td>
                <td>
                    <label for="txtPos-y">Posici&oacute;n Y</label>
                    <input type="number" id="txtPos-y" min="0" :max="`${modelo.oHeader.height - txtTamanio}`" v-model="txtPosY">
                </td>
                <td>
                    <label for="txtPos-x">Posici&oacute;n X</label>
                    <input type="number" id="txtPos-x" min="0" :max="`${modelo.oMetadatos.ancho - 10}`" v-model="txtPosX">
                </td>
                <td>
                    <button class="btn float-center" @click="agregarTexto(modelo)">Guardar texto
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn float-center" @click="resetTexto()">Descartar
                        <i class="fas fa-undo-alt"></i>
                    </button>                                    
                </td>                            
            </tr>
        </table>

        <!-- <div class="table-responsive"> -->
        <div class="tableFixHead table-responsive">
        <table id="textos-encabezado" class="table table-hover">                            
            <thead class="thead-light">
                <tr>
                    <th scope="col">Visible</th>
                    <th scope="col">Texto</th>
                    <th scope="col">Acciones</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody style="height: 10px !important; overflow: scroll; ">

                <tr v-for="txt of modelo[objeto].textos" :key="txt.id">
                    <td scope="row">
                        <label class="content-input">
                            <input type="checkbox" v-model="txt.mostrar">
                            <i></i>
                        </label>                                                                              
                    </td>
                    <td scope="row">
                        <p
                            :style="`${'max-width:100%;height:auto;font-family:' + txt.fuente + ';font-weight:' + txt.cssestilo + ';font-style: ' + txt.cssitalica + ';text-decoration:' + txt.csssubrayado + ';font-size:' + txt.tamanio + 'pt;color:' + txt.color + ';background-color:' + txtBkColor}`" 
                        >
                        {{txt.texto}}</p>
                    </td>
                    <td scope="row">
                        <a @click="borrarTexto(txt.id)"> <i class="far fa-trash-alt fa-2x" style="color:silver" title="Eliminar este texto"></i> </a>
                    </td>
                    <td scope="row">
                        <a @click="editarTexto(txt.id)"> <i class="fa fa-edit fa-2x" style="color:silver" title="Editar este texto"></i> </a>
                    </td>                                
                </tr>

            </tbody>

        </table>
        </div>

    </form>

</div>
</template>

<script>
import global from '@/utils/global'
import funciones from '@/utils/funciones'
import truecolor from '@/components/visuales/trueColor'
import truefuentes from '@/components/visuales/truefuentes'
import {
    MDBBadge,
} from 'mdb-vue-ui-kit';

export default {
    name: 'Textos',
    data() {
        return {
            hayerror: 0,
            txtID: funciones.generarUUID2(),
            txtEstaba: false,
            txtMostrar: true,
            txtTexto: '',
            txtEstilo: false,
            enbEstilo: true,
            txtItalica: false,
            enbItalica: true,
            txtSubrayado: false,
            txtFuente: 'roboto',
            txtTamanio: 12,
            txtColor: '#000000',
            txtPosY: 10,
            txtPosX: 10,    
            
        }
    },
    components:{
        truecolor,
        truefuentes,
        MDBBadge,
    },
    props:{
        objeto: String,
        modelo: Object
    },
    methods: {
        cero(e) {
            e.preventDefault();
        },
        poneColor(componente, valor) {

           if(global.DEBUG)
                console.log('ponerColor Valor recibido del componente', componente, valor);

            if(componente == 'txtColorEncabezado')
                this.txtColor = valor;                
                

        },
        getData(quien, valor, b, i) {

            if(global.DEBUG)
                console.log('getData Valor recibido del componente', quien, valor, b, i);

            if(quien == 'txtFuente') {
                this.txtFuente = valor;
                this.enbEstilo = b;
                this.enbItalica = i;

                if(this.enbEstilo == false) {
                    this.txtEstilo = false;
                }
                if(this.enbEstilo == false) {
                    this.txtItalica = false;
                }

            }

            if(quien == 'txtEstilo')
                this.txtEstilo = valor;  
                        
            if(quien == 'txtItalica') 
                this.txtItalica = valor;  

            if(quien == 'txtSubrayado') 
                this.txtSubrayado = valor;  

 
        },
        getModelo() {
            return funciones.getModelo(this.campoTipo, this.campoAncho);
        },        
        agregarTexto(pObjeto) {
            
            if(this.txtTexto == '') {
                this.hayerror = 1;
                return                
            }
            
            this.txtPreview = funciones.getPreview(this.modelo.oCampos, this.txtTexto);

             let existe = pObjeto[this.objeto]['textos'].findIndex(x => x.id === this.txtID);

            if(existe == -1) {
                // No existe, se crea
                let idx = funciones.generarUUID2();

                pObjeto[this.objeto]['textos'].push({
                    id: idx, 
                    estaba: false, 
                    mostrar: true, 
                    texto: this.txtTexto, 
                    fuente: this.txtFuente,
                    tamanio: this.txtTamanio,
                    color: this.txtColor, 
                    estilo: this.txtEstilo, 
                    enbEstilo: this.enbEstilo,
                    italica: this.txtItalica, 
                    enbItalica: this.enbItalica,
                    subrayado: this.txtSubrayado, 
                    cssestilo: this.cssEstilo, 
                    cssitalica: this.cssItalica, 
                    csssubrayado: this.cssSubrayado,                     
                    posY: this.txtPosY, 
                    posX: this.txtPosX,
                    preview: this.txtPreview
                })

            } else {
                // Ya existe, se actualiza
                pObjeto[this.objeto]['textos'][existe].estaba = this.estaba; 
                pObjeto[this.objeto]['textos'][existe].mostrar = this.txtMostrar; 
                pObjeto[this.objeto]['textos'][existe].texto = this.txtTexto; 
                pObjeto[this.objeto]['textos'][existe].fuente = this.txtFuente;
                pObjeto[this.objeto]['textos'][existe].tamanio = this.txtTamanio;
                pObjeto[this.objeto]['textos'][existe].color = this.txtColor; 
                pObjeto[this.objeto]['textos'][existe].estilo = this.txtEstilo; 
                pObjeto[this.objeto]['textos'][existe].enbEstilo = this.enbEstilo; 
                pObjeto[this.objeto]['textos'][existe].italica = this.txtItalica; 
                pObjeto[this.objeto]['textos'][existe].enbItalica = this.enbItalica; 
                pObjeto[this.objeto]['textos'][existe].subrayado = this.txtSubrayado;
                pObjeto[this.objeto]['textos'][existe].cssestilo = this.cssEstilo; 
                pObjeto[this.objeto]['textos'][existe].cssitalica = this.cssItalica; 
                pObjeto[this.objeto]['textos'][existe].csssubrayado = this.cssSubrayado;                 
                pObjeto[this.objeto]['textos'][existe].posY = this.txtPosY; 
                pObjeto[this.objeto]['textos'][existe].posX = this.txtPosX;
                pObjeto[this.objeto]['textos'][existe].preview = this.txtPreview;
            }

            this.txtID = funciones.generarUUID2();
            this.hayerror = 0;
            this.resetTexto();

        },
        borrarTexto(pId) {

            funciones.popAlert('warning', 'Quieres eliminar este texto?', true, true, 8000, "Sí, bórralo!")
            .then((result) => {

                let tmp = [];
                if(result==true) {

                    tmp = this.modelo[this.objeto]['textos'].filter((tx) => {
                        return tx.id != pId; 
                    }) 

                    this.$emit("getData", "textos", this.objeto, tmp);

                    this.resetTexto();

                }

            })
        },
        editarTexto(pId) {

            let x = this.modelo[this.objeto]['textos'].findIndex(x => x.id === pId)

            // Cargar el texto para edición
            this.txtID = this.modelo[this.objeto]['textos'][x].id;
            this.txtEstaba = this.modelo[this.objeto]['textos'][x].estaba;
            this.txtMostrar = this.modelo[this.objeto]['textos'][x].mostrar;
            this.txtTexto = this.modelo[this.objeto]['textos'][x].texto; 
            this.txtFuente = this.modelo[this.objeto]['textos'][x].fuente;
            this.txtTamanio = this.modelo[this.objeto]['textos'][x].tamanio;
            this.txtColor = this.modelo[this.objeto]['textos'][x].color;
            this.txtEstilo = this.modelo[this.objeto]['textos'][x].estilo;
            this.txtItalica = this.modelo[this.objeto]['textos'][x].italica;
            this.txtSubrayado = this.modelo[this.objeto]['textos'][x].subrayado;
            this.txtPosY = this.modelo[this.objeto]['textos'][x].posY;
            this.txtPosX = this.modelo[this.objeto]['textos'][x].posX;
            this.txtPreview = this.modelo[this.objeto]['textos'][x].preview;

            let fte = funciones.datosFuente(this.txtFuente);
            this.enbEstilo = fte.b;
            this.enbItalica = fte.i;

            if(fte.b == false) {
                this.txtEstilo = false;
            }
            if(fte.i == false) {
                this.txtItalica = false;
            }

        },
        resetTexto() {

            this.txtID = funciones.generarUUID2();
            this.txtEstaba = false;
            this.txtMostrar = true;
            this.txtTexto = ''; 
            this.txtPosY = 10;
            this.txtPosX = 10;
            this.txtEstilo = false;
            this.enbEstilo = true;
            this.txtItalica = false;
            this.enbItalica = true;
            this.txtSubrayado = false;
            this.txtTamanio = 12;
            this.txtPreview = '';

            this.hayerror = 0;
            document.getElementById('txtTexto').focus();

        },
      


    },
    computed: {
        txtBkColor: {
            get() {
                return this.modelo[this.objeto].backcolor;
            }
        },
        cssEstilo: {
            get() {
                if(this.txtEstilo == true) {
                    return 'bold';
                } else {
                    return 'normal';
                }
            }
        },
        cssItalica: {
            get() {
                if(this.txtItalica == true) {
                    return 'italic';
                } else {
                    return 'normal';
                }
            }
        },
        cssSubrayado: {
            get() {
                if(this.txtSubrayado == true) {
                    return 'underline';
                } else {
                    return 'none';
                }
            }
        },        
    }


}
</script>

<style scoped>

    /* Para fijar el encabezado de la tabla y desplazar los registros */
    .tableFixHead          { overflow-y: auto; height: 500px; }
    .tableFixHead thead th { position: sticky; top: 0; }

    /* Just common table stuff. Really. */
    table  { border-collapse: collapse; width: 100%; }
    th, td { padding: 8px 16px; }
    th     { background:#eee; }

    #texto-tmp {
        border: 1px solid black;
        background-color: rgb(210,210,210);
        width: 100%;
    }
    #texto-tmp td {
        vertical-align: middle;
        padding: 5px;
        /* border: 1px solid black; */
        align-items: center;
    }
    .texto-tmp input[type="number"] {
        width: 80px;
        margin-left: 5px;
    }
 

</style>
