
<script setup>
import { toRefs } from "vue"

    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes'])
    const emit = defineEmits(["updateForm"])
    const {campo} = toRefs(props)

    const validar = () => {
        let caracteristicas = {};
        let requeridoValido = true
        campo.value.mensajes = [];

        try {
            caracteristicas = getCaracteristicas();
            requeridoValido = caracteristicas.required;
        }catch(err){
            console.log(err);
        }

        if( caracteristicas.hasOwnProperty('required') && caracteristicas.required === 'true') {
        requeridoValido =  !!campo.value.valor && (campo.value.valor+"").length > 0;
        if( !requeridoValido ){
            let mensaje = { 
            tipo:'required',
            mensajeStr: "El campo " + campo.value.nombre.toLocaleLowerCase() + " es requerido"
            }
            campo.value.mensajes.push( mensaje );
        }
        }

        campo.value.valido = requeridoValido;
        emit('updateForm', campo.value);
    }

    const getCaracteristicas = () => {
        let caracteristicas = {};
        try {
            caracteristicas = JSON.parse(campo.value.caracteristicas + '');
        }catch(err){
            console.log(err);
        }
        return caracteristicas;
    }

</script>


<template>
  <div class="">
      <input type="checkbox"    
        :id="[[campo.campo_id]]"
        :name="[[campo.campo_id]]"
        v-model="campo.valor" @change="validar" @focus="validar" >
        <label> {{ campo.nombre }}</label>
      <div>
        <small  v-if="campo.mensajes && campo.mensajes.length > 0 && ( showMensajes || estadoFormulario > 0)" class="position-absolute">
            <p  class="form-text text-danger">
              {{ campo.mensajes[0].mensajeStr }}
            </p>
        </small>
      </div>
    </div>
</template>