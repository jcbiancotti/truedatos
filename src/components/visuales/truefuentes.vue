<template>
<div class="container-fluid">

    <select id="fuentes" :value="valor" class="form-control" @click="setData">
        <option v-for="opc of aFuentes" :key="opc.valor" class="form-control" :value="opc.texto">{{opc.texto}}</option>
    </select>

</div>
</template>

<script>

import funciones from '@/utils/funciones'

export default {
    name: 'truefuentes',
    data() {
        
        let aFuentes = funciones.datosFuente('', true);

        return {
            aFuentes,
        }
    },
    props: ['id','valor'],
	methods: {

        // devolver la fuente seleccionada
		setData(e) {
            let x = this.aFuentes.findIndex(x => x.texto === e.target.value);
            if(x != -1){
                this.$emit("getData", this.id, e.target.value, this.aFuentes[x].b, this.aFuentes[x].i);
            }
		},

	},

}
</script>

<style scoped>


</style>
