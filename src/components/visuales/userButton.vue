<template>
<div class="container-fluid">

    <button class="navbar-toggler float-end" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="iconos-neg inline-icon material-icons md-48">menu</span>
    </button>

    <div class="collapse navbar-collapse float-end" id="navbarSupportedContent">
        
        <div class="dropdown navbar-nav ml-auto float-end" v-if="isLogged">

            <div class="btn-user">

                <span style="color: white;">{{fname}}</span>
                <button class="dropdown-toggle btn-user" type="button" data-bs-toggle="dropdown">
                    <span class="iconos-neg inline-icon material-icons md-48">account_circle</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <router-link @click="deleteUserLogged()" to="/" class="dropdown-item">Desconectar
                            <span class="iconos inline-icon material-icons md-48">logout</span> 
                        </router-link>
                    </li>
                </ul>

            </div>

        </div>
        <!-- --------- -->
        <div v-else> 

            <router-link to="/login" class="btn-user">Acceder <span class="iconos-neg inline-icon material-icons md-48">account_circle</span></router-link>

        </div>
    
    </div>

</div>
</template>

<script>

import auth from '@/utils/auth'

export default {
    name: 'userButton',
    data() {
        return {
            u: '',
            usr: {nombre: ''},
        }
    },
    methods: {
        deleteUserLogged() {
            auth.deleteUserLogged();
            // Ir a Home
            this.$router.push({path: "/"});
        },

    },
    computed: {
        isLogged:{
            get() {
                return this.$store.state.logged;
            }
        },
        fname: {
            get() {
                return this.$store.state.userFullName;
            }
        }

    }
}
</script>

<style>

</style>
