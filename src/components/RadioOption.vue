<script>
import { ref } from "vue";

const modelo = ref(null)
const opciones = [{
                    value:'normal',
                    name:'normal',
                    id:'checkTipoTramiteNormal',
                    label:'Normal con pago',
                    disabled: false
                },
                {
                    value:'declaracionEn0',
                    name:'declaracionEn0',
                    id:'checkTipoTramite0',
                    label:'Normal en Cero',
                    disabled: false
                },
                {
                    value:'complementaria',
                    name:'complementaria',
                    id:'checkTipoTramiteComp',
                    label:'Complementaria',
                    disabled: false
                },
                {
                    value:'correccionFiscal',
                    name:'correccionFiscal',
                    id:'checkTipoTramiteCF',
                    label:'Corrección Fiscal',
                    disabled: false
                }]

</script>

<template>
      <div class="col-md-12 col-lg-12">
        <div class="text-center d-flex flex-row justify-content-center">
            <div class="elemento_forma caja_radios d-inline-block mr-4"  v-for="(opcion, i) in opciones" :key="i">
                <label class="" :for="opcion.id">
                <input type="radio" 
                    :value="opcion.value"  
                    :name="opcion.name" class="" 
                    :id="opcion.id" 
                    v-model="modelo"  
                    @change="cambioInput" 
                    :disabled="opcion.disabled"
                >
                  {{opcion.label}}
                </label>
            </div>
        </div>
    </div>  
</template>