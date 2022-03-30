<template>
<div class="container-fluid">

    <button class="btn" @click="tree=[];desarmarJSON(treemodelo, '0000')">Cargar datos</button>

    <div id="treeview" style="border: 1px solid black;margin-top:10px;">

        <!-- NIVEL CERO -->
        <ul id="NIVEL0" class="list-unstyled components"> 
        <div v-for="item of tree" :key="item.idx">

            <li class="text-start" v-if="item.padre == '0000'"> 
                <p v-if="item.tipo != 'object' && item.tipo != 'array'" style="margin: 0px;">
                    <span class="material-icons" style="font-size: 14px !important;">remove</span>
                    <span style="color:silver;">{{item.clave}}</span>
                    <span class="material-icons" style="font-size: 14px !important;">east</span>
                    {{item.valor}}
                </p>                
                <a v-if="item.tipo == 'object' || item.tipo == 'array'" :href="'#S' + item.idx" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
                    <span v-if="item.tipo == 'object'" class="material-icons" style="font-size: 14px !important;">category</span>
                    <span v-if="item.tipo == 'array'" class="material-icons" style="font-size: 14px !important;">more_horiz</span>
                    {{item.clave}}
                </a>

                <!-- NIVEL 1 -->
                <ul class="collapse list-unstyled" :id="'S' + item.idx">

                    <!-- Opciones del submenu NIVEL 1 -->
                    <div v-for="item1 of tree" :key="item1.idx">
                    <li v-if="item1.padre == item.idx">
                        <p v-if="item1.tipo != 'object' && item1.tipo != 'array'" style="margin: 0px;margin-left:30px;">
                            <span class="material-icons" style="font-size: 14px !important;">remove</span>
                            <span style="color:silver;">{{item1.clave}}</span>
                            <span class="material-icons" style="font-size: 14px !important;">east</span>
                            {{item1.valor}}
                        </p>
                        <a v-if="item1.tipo == 'object' || item1.tipo == 'array'" :href="'#SS' + item1.idx" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle" style="margin: 0px;margin-left:30px;">
                            <span v-if="item1.tipo == 'object'" class="material-icons" style="font-size: 14px !important;">category</span>
                            <span v-if="item1.tipo == 'array'" class="material-icons" style="font-size: 14px !important;">more_horiz</span>
                            {{item1.clave}}
                        </a>

                        <!-- NIVEL 2 -->
                        <ul class="collapse list-unstyled" :id="'SS' + item1.idx">

                            <!-- Opciones del submenu NIVEL 2 -->
                            <div v-for="item2 of tree" :key="item2.idx">
                            <li v-if="item2.padre == item1.idx">
                                <p v-if="item2.tipo != 'object' && item2.tipo != 'array'" style="margin: 0px;margin-left:60px;">
                                    <span class="material-icons" style="font-size: 14px !important;">remove</span>
                                    <span style="color:silver;">{{item2.clave}}</span>
                                    <span class="material-icons" style="font-size: 14px !important;">east</span>
                                    {{item2.valor}}
                                </p>
                                <a v-if="item2.tipo == 'object' || item2.tipo == 'array'" :href="'#SSS' + item2.idx" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle" style="margin: 0px;margin-left:60px;">
                                    <span v-if="item2.tipo == 'object'" class="material-icons" style="font-size: 14px !important;">category</span>
                                    <span v-if="item2.tipo == 'array'" class="material-icons" style="font-size: 14px !important;">more_horiz</span>
                                    {{item2.clave}}
                                </a>

                                <!-- NIVEL 3 -->
                                <ul class="collapse list-unstyled" :id="'SSS' + item2.idx">

                                    <!-- Opciones del submenu NIVEL 3 -->
                                    <div v-for="item3 of tree" :key="item3.idx">
                                    <li v-if="item3.padre == item2.idx">
                                        <p v-if="item3.tipo != 'object' && item3.tipo != 'array'" style="margin: 0px;margin-left:90px;">
                                            <span class="material-icons" style="font-size: 14px !important;">remove</span>
                                            <span style="color:silver;">{{item3.clave}}</span>
                                            <span class="material-icons" style="font-size: 14px !important;">east</span>
                                            {{item3.valor}}
                                        </p>
                                        <a v-if="item3.tipo == 'object' || item3.tipo == 'array'" :href="'#SSSS' + item3.idx" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle" style="margin: 0px;margin-left:90px;">
                                            <span v-if="item3.tipo == 'object'" class="material-icons" style="font-size: 14px !important;">category</span>
                                            <span v-if="item3.tipo == 'array'" class="material-icons" style="font-size: 14px !important;">more_horiz</span>
                                            {{item3.clave}}
                                        </a>

                                        <!-- NIVEL 4 -->
                                        <ul class="collapse list-unstyled" :id="'SSSS' + item3.idx">

                                            <!-- Opciones del submenu NIVEL 4 -->
                                            <div v-for="item4 of tree" :key="item4.idx">
                                            <li v-if="item4.padre == item3.idx">
                                                <p v-if="item4.tipo != 'object' && item4.tipo != 'array'" style="margin: 0px;margin-left:120px;">
                                                    <span class="material-icons" style="font-size: 14px !important;">remove</span>
                                                    <span style="color:silver;">{{item4.clave}}</span>
                                                    <span class="material-icons" style="font-size: 14px !important;">east</span>
                                                    {{item4.valor}}
                                                </p>
                                                <a v-if="item4.tipo == 'object' || item4.tipo == 'array'" :href="'#SSSS' + item4.idx" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle" style="margin: 0px;margin-left:120px;">
                                                    <span v-if="item4.tipo == 'object'" class="material-icons" style="font-size: 14px !important;">category</span>
                                                    <span v-if="item4.tipo == 'array'" class="material-icons" style="font-size: 14px !important;">more_horiz</span>
                                                    {{item4.clave}}
                                                </a>

                                            </li>
                                            </div>

                                        </ul>

                                    </li>
                                    </div>

                                </ul>

                            </li>
                            </div>                    

                        </ul>

                    </li>
                    </div>

                </ul>

            </li>

        </div>
        </ul>

    </div>



</div>
</template>

<script>

import funciones from '@/utils/funciones'

export default {
    name: 'TrueTree',
    data() {
        return {
            tree: [],

        }
    },
    props: {
        treemodelo: Object
    },
    methods: {
        desarmarJSON(punto, pPadre) {

            for (var clave in punto){

                if(clave == 0) {
                    break;
                }

                let xitem = funciones.generarUUID2();

                let xtipo = '';
                let xextra = '';
                if(punto[clave] != null) {
                    xtipo = typeof(punto[clave]);
                }
                if(Array.isArray(punto[clave])) {
                    xtipo = 'array';
                    xextra = '(' + punto[clave].length + ')';
                }

                this.tree.push({
                    idx: xitem,    
                    padre: pPadre,
                    clave: clave + xextra,
                    valor: punto[clave],
                    tipo: xtipo
                })


                if(Array.isArray(punto[clave])) {

                    let it = 0;
                    for(var a in punto[clave]) {

                        let xitem1 = funciones.generarUUID2();

                        this.tree.push({
                            idx: xitem1,
                            padre: xitem,
                            clave: '(' + it + ')',
                            valor: 'array',
                            tipo: 'array'
                        })

                        this.desarmarJSON(punto[clave][a], xitem1);
                        
                        it++;

                    }

                } else {
                    this.desarmarJSON(punto[clave], xitem);

                }

            }

        }

    },
    mounted() {

    }

}
</script>

<style scoped>



</style>
