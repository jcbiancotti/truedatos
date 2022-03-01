<template>
<div class="container-fluid">
    <nav class="navbar navbar-expand-md p-0">

        <div class="col text-left navbar-true">

            <router-link v-if="isLogged" to="/inicio" class="btn float-left">Home <i class="fa fa-home"></i></router-link>
            <router-link v-if="isLogged" to="/newEntidad" class="btn float-left">Nueva entidad <i class="far fa-file"></i></router-link>

            <userButton />

        </div>

    </nav>

</div>    
</template>

<script>

import userButton from '@/components/visuales/userButton'

export default {
    name: 'NavBar',
    data() {
        return {
            
        }
    },
    components: {
        userButton
    },    
    methods:{

    },
    mounted() {

    },
    computed: {
        isLogged:{
            get() {
                return this.$store.state.logged;
            }
        },
        fName:{
            get() {
                return this.$store.state.userFullName;
            }
        }        

    }

}
</script>

<style>

</style>
