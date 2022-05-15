import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      name: '',
      surname: '',
      Email: '',
      password: '',
      userId: null,
      roleId: null,
      birthDate: '',
    },
  },
  modules: {
    app,
    appConfig,
    verticalMenu,
  },
  strict: process.env.DEV,
})

export default store
