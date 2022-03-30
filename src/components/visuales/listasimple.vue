<template>
<div class="container-fluid">

    <div class="content-select">
        <select v-model="elegido" @change="setData">
            <option v-for="opc of opciones" :key="opc.valor" :value="opc.valor">{{opc.texto}}</option>
        </select>
        <i></i>
    </div>

</div>
</template>

<script>
export default {
    name: 'listasimple',
    props: {
        id: String,
        opciones: Array,
        valor: String
    },
    data() {
        return {
            elegido: this.valor
        }
    },
    methods: {
		setData() {
			this.$emit("getData", this.id, this.elegido);
		}        
    },
}
</script>

<style scoped>
.content-input input,
.content-select select{
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
}
.content-select select::-ms-expand {
    display: none;
}
.content-select{
	max-width: 250px;
	position: relative;
}
 
.content-select select{
	display: inline-block;
	width: 100%;
	cursor: pointer;
    padding: 7px 10px;
    height: 42px;
    outline: 0; 
    border: 0;
	border-radius: 0;
	background: #f0f0f0;
	color: var(--true-button-color);
	font-size: 1em;
	font-family: 'Quicksand', sans-serif;
	border:2px solid rgba(0,0,0,0.2);
    border-radius: 12px;
    position: relative;
    transition: all 0.25s ease;
}
 
.content-select select:hover{
	background: var(--true-select-background-color);
}
 
/* 
Creamos la fecha que aparece a la izquierda del select.
Realmente este elemento es un cuadrado que sólo tienen
dos bordes con color y que giramos con transform: rotate(-45deg);
*/
.content-select i{
	position: absolute;
	right: 20px;
	top: calc(50% - 13px);
	width: 16px;
	height: 16px;
	display: block;
	border-left:4px solid var(--true-button-color);
	border-bottom:4px solid var(--true-button-color);
	transform: rotate(-45deg); /* Giramos el cuadrado */
	transition: all 0.25s ease;
}
 
.content-select:hover i{
	margin-top: 3px;
}
</style>
