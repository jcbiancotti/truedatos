import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import auth from '@/utils/auth'

import store from '@/store'

//import page404 from '@/views/sistema/page404'

const routes = [
    {
        path: '/',
        name: '/home',
        component: Home,
        meta: { requiresAuth: false}
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/login.vue'),
        meta: { requiresAuth: false}
    },  
    {
        path: '/inicio',
        name: 'Inicio',
        component: () => import('@/views/inicio.vue'),
        meta: { requiresAuth: true}
    },
    {
        path: '/newEntidad',
        name: 'NewEntidad',
        component: () => import('@/views/newEntidad.vue'),
        meta: { requiresAuth: true}
    },
    {
        path: '/editEntidad/:p_claveId?',
        name: 'EditEntidad',
        component: () => import('@/views/newEntidad.vue'),
        meta: { requiresAuth: true}
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/sistema/page404.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: "/:catchAll(.*)",
        redirect: '/404'
    }    

]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    mode: 'hash',
    routes
})

router.beforeEach((to, from, next) => {

    let isLogged = store.state.logged;   
    let requiere = to.matched.some(record => record.meta.requiresAuth);

    console.log("Router beforeEach", to.name, isLogged);  

    if (to.name == '/home' && (isLogged === true)) {
        console.log("Por aqui 1", isLogged);
        next('/inicio');
    } else {
        if (requiere == false) {
            console.log("Por aqui 2");
            next();
        } else if (requiere == true && isLogged === false) {
            console.log("Por aqui 3");
            auth.deleteUserLogged();
            next('/login');
        } else {
            console.log("Por aqui 4");
            next();
        }

    }

});

export default router

