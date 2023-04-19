<script setup>
import { getCurrentInstance, ref, toRefs, watch } from "vue"


    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes','updateIt'])
    const emit = defineEmits(["updateForm"])
    const instance = getCurrentInstance();
    let options = ref([])
    let campos_count = ref(0)
    
    let {campo, updateIt} = toRefs(props)



    const validar = () => {
        let requeridoValido = true;
        let caracteristicas = {};
        var caracteristicasStr = getCaracteristicas();
        campo.mensajes = [];  

        if( caracteristicasStr.hasOwnProperty('required') && caracteristicasStr.required) {
        requeridoValido =  !!campo.value.valor;
        
        if( !requeridoValido ){
            let mensaje = { 
            tipo:'required',
            mensajeStr: "El campo " + campo.value.nombre.toLocaleLowerCase() + " es requerido"
            }
            campo.mensajes.push( mensaje );
        }
        }
        campo.value.valido = requeridoValido ;
        // instance?.proxy?.$forceUpdate()
        
        emit('updateForm', campo.value);
    }

    const getCaracteristicas = () => {
        if(typeof campo.value.caracteristicas == 'string'){
            let caracteristicas = {};
            try {
              caracteristicas = JSON.parse(campo.value.caracteristicas + '');
            }catch(err){
              console.log(err);
            }
            return caracteristicas;
        }else
            return campo.value.caracteristicas;
    }


    watch(
        () => updateIt, async ( newVal, oldval) => {
            if(newVal > 0){
                validar();
            }
    })


    //created
    let caracteristicas = getCaracteristicas();
    options.value = caracteristicas.opciones;

    if(options.value && options.value.length > 0) {
        
         campos_count.value = caracteristicas.opciones.length < 6;
        
        if(options.value && options.value[0]["clave"] && options.value[0]["nombre"]){
        options.value = options.value;
        } 
        else {
        
            options.value = options.value.map( (opcion, key) =>{
                let nombre = opcion[Object.keys(opcion)];
                let clave = Object.keys(opcion)[0];
                let newOption = { clave, nombre }
                return newOption;
            });
        }
    }
    validar();    

</script>

<template>
    <div v-if="( options && options.length > 0) && !campo.ocultar">
      <!-- <label>
         {{ JSON.parse(campo.caracteristicas).etiqueta ? JSON.parse(campo.caracteristicas).etiqueta : campo.nombre }}  {{JSON.parse(  campo.caracteristicas + '').required == 'true' ? '*' : '' }}
      </label> -->
      <br/>
      <div class="" :class="campos_count ? 'd-inline-block mr-3' : ''" v-for="(option, index) in options" :key="index">
        <input type="radio" class=" "    
          :id="[[campo.campo_id]]"
          :name="[[campo.campo_id]]"
          :value="option.clave" v-model="campo.valor" @change="validar" :disabled="campo.disabled"> 
          <label> {{ option.nombre }}</label>
      </div>
  </div>
</template>
