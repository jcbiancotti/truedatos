<template>
  <div class="home">
    
    <telon :hidden="hiddentelon"/>
    
    <!-- LISTA DE ENTIDADES -->

        <div class="row w-100 p-2 w-0">

            <div class="col-lg-4 mb-2" v-for="entidad of aEntidades" :key="entidad.clave">

                <div class="card mx-auto" style="width:18rem;">

                    <div class="card-header text-left" style="line-height:12px;background-color: var(--true-color-empresa);">
                        <p style="color:silver">entidad id: {{entidad.id}}</p>
                        <span v-if="entidad.tipo == 'L'" class="iconos inline-icon material-icons" style="color: var(--true-button-hover-color);">format_list_bulleted</span>
                        <span v-if="entidad.tipo == 'T'" class="iconos inline-icon material-icons" style="color: var(--true-button-hover-color);">margin</span>
                        <span v-if="entidad.tipo == 'Q'" class="iconos inline-icon material-icons" style="color: var(--true-button-hover-color);">manage_search</span>
                        <span v-if="entidad.tipo == 'I'" class="iconos inline-icon material-icons" style="color: var(--true-button-hover-color);">fact_check</span>
                    </div>
                    <div class="card-body text-justify" style="line-height : 12px;">

                        <p>Descripción: {{entidad.descripcion}}</p>
                        <p>tipo: {{entidad.tipo_lit}}</p>
                        <p>Entorno: {{entidad.entorno_lit}}</p>

                    </div>
                    
                    <div class="card-footer text-end">
                        <span @click="Editar(entidad.id)" class="iconos inline-icon btn-img material-icons" title="Editar esta entidad">edit</span>
                        <span @click="Clonar(entidad.id)" class="iconos inline-icon btn-img material-icons" title="Duplicar esta entidad">content_copy</span>
                        <span @click="Borrar(entidad.id)" class="iconos inline-icon btn-img material-icons" title="Borrar esta entidad">delete</span>
                    </div>

                </div>

            </div>

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
            tipos: [
                {id: 'L', literal: 'Lista de valores'},
                {id: 'T', literal: 'Tabla'},
                {id: 'Q', literal: 'Consulta SQL'},
                {id: 'I', literal: 'Selección para desplegable'}
            ],
            entornos: [
                {id: 'C', literal: 'CORE: común para todo el sistema'},
                {id: 'M', literal: 'MASTER: solo utilizable en funcionalidades de la empresa Master<'},
                {id: 'G', literal: 'GESTION: utilizable en las funcionalidades del cliente'}
            ],                  
            // Modelo de la entidad
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

            datos.leerLista("sys_modelo_datos", "true", ["clave","id", "descripcion","tipo","entorno"], "")
            .then((result) => {

                if(global.DEBUG)
                    console.log("leerEntidades", "datos devueltos datos.leerLista", result);

                if(result.success == 1 && result.status == 200) {

                    for(let x = 0; x < result.data.length; x++) {

                        let xtipo = this.tipos[this.tipos.findIndex(t => t.id === result.data[x].tipo)].literal;
                        let xentorno = this.entornos[this.entornos.findIndex(t => t.id === result.data[x].entorno)].literal;

                        console.log(xtipo, xentorno)

                        this.aEntidades.push({
                            clave:       result.data[x].clave,
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

  },
}
</script>
