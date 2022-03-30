<template>
<div class="container p-4">
    <div class="row">
        <div class="col-md-4 mx-auto">
            <div class="card text-center align-content-center">
                <div class="card-header">
                    <h3>Identif&iacute;cate</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div class="form-group">
                            <label for="correo">Correo electr&oacute;nico</label>
                            <div class="input-group addon" >
                                <input type="email" class="form-control" name="correo" id="correo" placeholder="Tu correo electrónico..." v-model="modelo.usuario">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password">Contrase&ntilde;a</label>
                            <div class="input-group addon">
                                <input type="password" class="form-control" name="password" id="password" placeholder="Contraseña..." v-model="modelo.password">
                                <span class="input-group-text"><i class="fa" :class="{'fa-eye': showpass==false, 'fa-eye-slash': showpass==true}" @click="mostrarPass(1)"></i></span>
                            </div>
                        </div>                        
                       
                        <div @click="login()" class="form-group btn float-center">Accede 
                            <i class="fas fa-sign-in-alt"></i>
                        </div>

                        <div class="form-group">
                            <div class="mensaje">{{mensaje}}</div>
                        </div>
                    
                    </form>
                </div>
                <!-- <div class="card-footer">
                    <router-link to="/registrate" class="nav-link">
                        <p>A&uacute;n no tienes cuenta? Reg&iacute;strate aqu&iacute;</p>
                    </router-link>
                    <router-link to="/restcontrasenia" class="nav-link">
                        <p>Olvidaste la contraseña? Crea una nueva. Haz click aqu&iacute;</p>
                    </router-link>
                </div> -->
                
            </div>
        </div>
    </div>
    
</div>
</template>

<script>

import auth from '@/utils/auth'
import funciones from '@/utils/funciones'


export default {
    name: 'Login',
    data() {
        return {
            error: 0,
            mensaje: '',
            modelo: {
                usuario: '',
                password: ''
            },
            showpass: false,


            
        }
    },
    methods: {
        cero(e) {
            e.preventDefault();
        },
        iniFocus () {
            document.getElementById('correo').focus();
        },
        mostrarPass () {
            
            var xinput;

            xinput = window.document.getElementById("password");
            if(xinput.type == "text"){
                xinput.type = "password";
                this.showpass = false;
            } else {
                xinput.type = "text";
                this.showpass = true;
            }

        },
        async login() {

            // Validaciones
            if(this.modelo.usuario == "" || this.modelo.password == "") {
                this.mensaje = "Debes indicar tu correo electrónico y contraseña!";
            } else {

                this.mensaje = "";

                try {

                    auth.login(this.modelo.usuario, this.modelo.password)
                    .then((result) => {

                        if(result.success == 1 && result.status == 200) {

                            // Almacenar datos en localStorage
                            localStorage.token = result.data.token;
                            localStorage.userFullName = result.data.nombre_completo;

                            auth.getUserLogged()
                            .then(() => {
                                // Ir a Inicio
                                this.$router.push({path: "/inicio"});
                            })

                        } else {
                            this.mensaje = result.message;
                        }

                    });

                } catch (error) {
                    funciones.popAlert('error', 'UPS! Ha ocurrido un problema', false, false, 3000, '');
                    console.log(error);
                }

            }

        },


        
    },
    mounted() {
        this.iniFocus();
    },

}
</script>

<style scoped>



</style>
