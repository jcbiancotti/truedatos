<template>

<div class="inicio">

    <telon :hidden="hiddentelon"/>

    <div class="wrapper text-start">

        <!-- LISTA DE MODELOS DE DATOS -->
        <nav id="main-tree">
    
            <div class="card-body">

                <!-- NIVEL 0 -->
                <ul class="nivel0">

                    <div v-for="tipo of Tipos" :key="tipo.id">
                    <li>

                        <a :href="'#S' + tipo.id" data-bs-toggle="collapse" aria-expanded="false">
                            {{tipo.literal}} 
                        </a>                        

                        <!-- NIVEL 1 -->
                        <ul class="collapse nivel1" :id="'S' + tipo.id">

                            <!-- Opciones del submenu NIVEL 1 -->
                            <div v-for="item1 of aEntidades" :key="item1.id">
                            <li v-if="item1.tipo == tipo.id">

                                <p>
                                    <span class="iconos inline-icon btn-img material-icons" title="Versión activa!">radio_button_unchecked</span>
                                    {{item1.descripcion}}
                                    <span @click="Editar(item1.id)" class="iconos inline-icon btn-img material-icons">edit</span>
                                    <span @click="Borrar(item1.id)" class="iconos inline-icon btn-img material-icons">delete</span>
                                    <span @click="Clonar(item1.id)" class="iconos inline-icon btn-img material-icons">content_copy</span>
                                    
                                </p>

                            </li>
                            </div>

                        </ul>

                    </li>
                    </div>

                </ul>


            </div>

        </nav>

    </div>


</div>

</template>

<script>

import funciones from '@/utils/funciones'
import datos from '@/utils/datos'
import telon from '@/components/visuales/telon'

export default {
    name: 'Home',
    data(){
        return {
            hiddentelon: true,
            aEntidades: [],
            Tipos: [
                {id: 'L', literal: 'Listas de valores'},
                {id: 'T', literal: 'Tablas'},
                {id: 'Q', literal: 'Consultas SQL'},
                {id: 'I', literal: 'Selecciones para desplegable'}
            ],       
            entornos: [
                {id: 'C', literal: 'CORE: común para todo el sistema'},
                {id: 'M', literal: 'MASTER: solo utilizable en funcionalidades de la empresa Master<'},
                {id: 'G', literal: 'GESTION: utilizable en las funcionalidades del cliente'}
            ],                 
            // Modelo de la definicion            
            modelo: {
                oDatosGenerales: {
                    entidadId: '', 
                    tipo: '0',        // L: lista de valores  T: tabla   Q: Query  I: Selección para desplegable
                    descripcion: '',
                    entorno: '0',     // S: Sistema  C: Core, comun a todo el sistema  M: Master, para uso por la empresa Master  G: Gestion, para uso por el cliente empresario
                },
                oLista: [],
                oTabla: {
                    nombre: '',
                    oCampos: []
                },
                oQuery: {
                    cadenaSQL: '',
                    oFiltros: []
                },
                oSelectable: {
                    idQuery: '',
                    campo_codigo: '',
                    campo_valor: '',
                    campo_descripcion: ''     
                }
            },

        }
    },
    components:{
        telon,

    },
    methods: {
    leerEntidades() {

        try {

            this.aEntidades = [];

            this.hiddentelon = false;

            datos.leerLista("sys_modelo_datos", "true", ["id", "descripcion","tipo","entorno"], "")
            .then((result) => {

                if(global.DEBUG)
                    console.log("leerEntidades", "datos devueltos datos.leerLista", result);

                if(result.success == 1 && result.status == 200) {

                    for(let x = 0; x < result.data.length; x++) {

                        let xtipo = this.Tipos[this.Tipos.findIndex(t => t.id === result.data[x].tipo)].literal;
                        let xentorno = this.entornos[this.entornos.findIndex(t => t.id === result.data[x].entorno)].literal;

                        console.log(xtipo, xentorno)

                        this.aEntidades.push({
                            id:          result.data[x].id,
                            descripcion: result.data[x].descripcion,
                            tipo:        result.data[x].tipo,
                            tipo_lit:    xtipo,
                            entorno:     result.data[x].entorno,
                            entorno_lit: xentorno
                        });
                        
                    }

                }

            }).finally(() => {
                this.hiddentelon = true;
            });

        } catch(error) {
            console.log(error)
        }


    },
    Editar(pId) {
        this.$router.push("/editEntidad/" + pId)
    },
    Borrar(pId) {

        funciones.popAlert('warning', 'Quieres borrar la definición de esta entidad?', true, true, 8000, "Sí, bórrala!")
        .then((result) => {

            if(result==true) {

                try {

                    this.hiddentelon = false;

                    datos.borrarEntidad("id='" + pId + "'")
                    .then((result) => {

                        if(result.success == 1 && result.status == 200) {
                            funciones.popAlert('success', 'Entidad eliminada!', false, false, 3000, "Ok")
                            .then(() => {
                                this.leerEntidades();
                            })

                        } else {
                            funciones.popAlert('error', 'No se ha podido eliminar la entidad en este momento', true, false, 8000, "Ok")
                        }

                    }).finally(() => {
                        this.hiddentelon = true;
                    })
                    
                } catch (error) {
                    console.log(error);
                }
                
            }

        })

    },
    Clonar(pId) {

        funciones.popAlert('question', 'Quieres hacer una copia de la definición de esta entidad?', true, true, 8000, "Sí, cópiala")
        .then((result) => {

            if(result==true) {

                this.hiddentelon = false;   

                try {

                    datos.leerLista('sys_modelo_datos', "id='" + pId + "'", ['objeto'], '')
                    .then((result) => {

                        if(result.success == 1 && result.status == 200) {

                            this.modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                            let tmp = this.modelo;
                        
                            tmp.oDatosGenerales.entidadId = funciones.generarUUID2();
                            tmp.oDatosGenerales.descripcion = "Copia de " + this.modelo.oDatosGenerales.descripcion;

                            let almacenar = {
                                id:          tmp.oDatosGenerales.entidadId, 
                                descripcion: tmp.oDatosGenerales.descripcion, 
                                tipo:        tmp.oDatosGenerales.tipo,
                                entorno:     tmp.oDatosGenerales.entorno, 
                                objeto:      JSON.stringify(this.modelo, null, '\t')
                            };
                            datos.grabarEntidad(almacenar)                            
                            .then(() => {

                                funciones.popAlert("success", "Nueva entidad creada!", false, false, 3000, "ok")
                                .then(() => {
                                    this.leerEntidades();
                                });

                            })

                        }

                    }).finally(() => {
                        this.hiddentelon = true;
                    })

                } catch(error) {
                    console.log(error);
                }

            }

        })

    },

  },
  mounted() {
    this.leerEntidades();

  }

}
</script>
