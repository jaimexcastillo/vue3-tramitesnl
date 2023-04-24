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
import Radio from './components/Radio.vue'
import Textbox from './components/Textbox.vue'
import Checkbox from './components/Checkbox.vue'
import File from './components/File.vue'
import Results from './components/Results.vue'
import ExpedienteExcel from './components/ExpedienteExcel.vue'
import Enajenantes from './components/Enajenantes.vue'
import Table from  './components/Table.vue'
import Fecha from './components/Fecha.vue'
import ListadoExpedientes5isr from './components/ListadoExpedientes5isr.vue'
import Valuador from './components/Valuador.vue'

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
    .component('Radio', Radio)
    .component('Textbox', Textbox)
    .component('Checkbox' , Checkbox)
    .component('File', File)
    .component('Results', Results)
    .component('ExpedienteExcel', ExpedienteExcel)
    .component('Enajenantes', Enajenantes)
    .component('Table', Table)
    .component('Fecha', Fecha)
    .component('ListadoExpedientes5isr', ListadoExpedientes5isr)
    .component('Valuador', Valuador )

app 
    .use(pinia)
    .use(router)
    .use(vuetify)
    .mount('#app')

