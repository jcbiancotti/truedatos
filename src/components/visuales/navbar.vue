<template>
<div class="container-fluid">

    <nav class="navbar navbar-expand-md p-0">

        <div class="col text-start navbar-true">

            <router-link v-if="isLogged" to="/inicio" class="btn float-start text-nowrap">Home <span class="iconos inline-icon material-icons">home</span></router-link>
            <router-link v-if="isLogged" to="/newEntidad" class="btn float-start text-nowrap">Nueva entidad <span class="iconos inline-icon material-icons">desktop_windows</span></router-link>

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


