<template>
<div class="container-fluid">

    <input type="color" :value="color" @input="devolverColor">
    <!-- @change="devolverColor" -->

</div>
</template>

<script>
export default {
    name: 'trueColor',
    props:{
        color: String,
        compo: String,
        destino: Function
    },
    data() {
        return {
        }
    },
    methods: {
        devolverColor(e) {
            this.destino(this.compo, e.target.value);
        }
    },

}
</script>

