import { createApp } from 'vue'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import Helloworld from './components/Helloworld.vue'
import Login from './views/Login.vue'
import VHeader from './components/VHeader.vue'
import ListadoTramites from './components/ListadoTramites.vue'
import Pagination from './components/Pagination.vue'


import router from './router'



const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', 
  },
})

const pinia = createPinia()
const app = createApp(App)



app
    .component('HelloWorld', Helloworld)
    .component('Login', Login)
    .component('VHeader', VHeader)
    .component('ListadoTramites', ListadoTramites)
    .component('Pagination', Pagination)
    


app 
    .use(pinia)
    .use(router)
    .use(vuetify)
    .mount('#app')
