<template>
<div class="container-fluid">

    <h3>Diseño del modelo de datos</h3>

    <navbar />
    <router-view/>

</div>
</template>
<script>

import store from '@/store'
import auth from '@/utils/auth'
import navbar from '@/components/visuales/navbar'

export default {
    name: 'App',
    data() {
        return {
            
        }
    },
    components:{
        navbar
    },
    methods: {

    },
    beforeCreate() {
        if(localStorage.token) {
            store.commit('marcaLogged', true);
            store.commit('marcaFullName', localStorage.userFullName);
            try {
                auth.getUserLogged()
                .then((result) => {
                    if(result == null) {
                        store.commit('marcaLogged', false);
                        store.commit('marcaFullName', '');                        
                    }
                })

            } catch(error) {
                console.log(error)
            }
        }
    },
    computed: {
        fName:{
            get() {
                return store.state.userFullName;
            }
        }
    }

}
</script>


<style>

    @import './assets/css/variables.css';

    /* <!-- GOOGLE FONTS --> */
    @import url('https://fonts.googleapis.com/css?family=Anton');
    @import url('https://fonts.googleapis.com/css?family=Arvo');
    @import url('https://fonts.googleapis.com/css?family=Audiowide');
    @import url('https://fonts.googleapis.com/css2?family=Bungee+Inline&display=swap');
    @import url('https://fonts.googleapis.com/css?family=Cabin');
    @import url('https://fonts.googleapis.com/css?family=Cookie');
    @import url('https://fonts.googleapis.com/css?family=Dancing+Script&display=');
    @import url('https://fonts.googleapis.com/css?family=Dancing+Script');
    @import url('https://fonts.googleapis.com/css?family=Elsie');
    @import url('https://fonts.googleapis.com/css?family=Lato');
    @import url('https://fonts.googleapis.com/css?family=Montserrat');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    @import url('https://fonts.googleapis.com/css?family=Oswald');
    @import url('https://fonts.googleapis.com/css?family=Patua+One');
    @import url('https://fonts.googleapis.com/css2?family=PT+Sans');
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    @import url('https://fonts.googleapis.com/css?family=Roboto+Slab');
    @import url('https://fonts.googleapis.com/css?family=Sofia');
    @import url('https://fonts.googleapis.com/css?family=Tangerine');
    @import url('https://fonts.googleapis.com/css?family=Titan+One');
    @import url('https://fonts.googleapis.com/css?family=Trirong');
    @import url('https://fonts.googleapis.com/css?family=Varela+Round');
    @import url('https://fonts.googleapis.com/css?family=Vollkorn');

</style>
