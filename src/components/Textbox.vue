<script setup>
import { toRefs } from "vue";


    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes'])
    const {campo} = toRefs(props)
    const emit = defineEmits(["updateForm"])


    const validar = () => {
        let requeridoValido = true;
        let caracteristicas = {};
        var caracteristicasStr = campo.value.caracteristicas;
        campo.value.mensajes = [];
        
        try {
            caracteristicas = JSON.parse(campo.value.caracteristicas + '');
        }catch(err){
            console.log(err);
        }


        if( caracteristicas.hasOwnProperty('required') && caracteristicas.required) {
            requeridoValido =  !!campo.value.valor && campo.value.valor.length > 0;
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
</script>

<template>
    <div class=" fv-plugins-icon-container" v-if="!campo.ocultar">
        <textarea  
            :id="[[campo.idElemento ? campo.idElemento : campo.campo_id]]"
            :name="[[campo.campo_id]]" 
            class="form-control  form-control-lg " v-model="campo.valor"
            @change="validar" >
        </textarea>
        <small  v-if="campo.mensajes && campo.mensajes.length > 0 && ( showMensajes || estadoFormulario > 0)" class="position-absolute">
            <p  class="form-text text-danger">
              {{ campo.mensajes[0].mensajeStr }}
            </p>
        </small>
      
    </div>  
</template>