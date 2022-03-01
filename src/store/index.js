import { createStore } from 'vuex'

export default createStore({

    state: {
        logged: false,
        userFullName: '',

    },
    mutations: {
        marcaLogged(state, valor) {
            state.logged = valor;
        },
        marcaFullName(state, valor) {
            state.userFullName = valor;
        }

    },

})