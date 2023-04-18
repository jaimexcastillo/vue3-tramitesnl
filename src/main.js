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
import ListadoGeneralTramites from './components/ListadoGeneralTramites.vue'
import Pagination from './components/Pagination.vue'
import Tramite from './components/Tramite.vue'
import Wizard from './components/Wizard.vue'
import RadioOption from './components/RadioOption.vue'
import CamposTramite from './components/CamposTramite.vue'
import Input from './components/Input.vue'
import Number from './components/Number.vue'
import Select from './components/Select.vue'

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
    .component('ListadoGeneralTramites', ListadoGeneralTramites)
    .component('Pagination', Pagination)
    .component('Tramite', Tramite)
    .component('Wizard', Wizard)
    .component('RadioOption', RadioOption)
    .component('CamposTramite', CamposTramite)
    .component('Input', Input)
    .component('Number', Number)
    .component('Select', Select)
    


app 
    .use(pinia)
    .use(router)
    .use(vuetify)
    .mount('#app')

