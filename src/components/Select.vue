<script setup>
import VueMultiselect from 'vue-multiselect'
import { getCurrentInstance, onMounted, ref, toRefs } from "vue"

    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes', 'estado'])
    const emit = defineEmits(["updateForm"])
    const instance = getCurrentInstance();
    const options = ref([])
    const {campo} = toRefs(props)
    

    onMounted(() => {

      if(campo.value.nombre== "Cambio de divisas" && !campo.value.valor){
          campo.value.valor = {clave: "PESOS", nombre: "Pesos"}
        validar();
      }
      
      setOpciones();

    })

    const setOpciones = async () => {
          if( campo.value.nombre == 'Estado'){
            let url = 'http://10.153.162.47' + "/obtener-estados" ; 
            console.log(url);
            let options = await obtenerOptions(url);
            options = options; 
          }
          if( campo.value.nombre == 'Municipio'){
            let url =  'http://10.153.162.47' + "/obtener-municipios/" + this.estado.clave ;  
            let options = await obtenerOptions(url);
            options = options.map( option => {
              option.claveEstado = estado.clave;
              return option;
            }); ; 
          }
        }
    const obtenerOptions = async (url) => {
          let response = await axios.get(url);
          let options = response.data ? response.data : [];
          return options;
    }

    const validar = () => {
          let requeridoValido = true;
          let caracteristicas = {};
          campo.value.mensajes = [];

          try {
            caracteristicas = JSON.parse(campo.value.caracteristicas + '');
          }catch(err){
            console.log(err);
          }
          if( caracteristicas.hasOwnProperty('required') && caracteristicas.required === 'true') {
            if(campo.value.tipo == 'multiple'){
              requeridoValido =  campo.value.valor && campo.value.valor.length > 0; 
            } else {
              requeridoValido =  !!campo.value.valor; 
            }
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
          // instance?.proxy?.$forceUpdate();

    }

    // created 
    options.value = JSON.parse(campo?.value.caracteristicas).opciones;
    if(options.value && options.value.length > 0){
        if(options.value && options.value[0]["clave"] && options.value[0]["nombre"]){
        options.value = options.value;
        } else {
        options.value= options.value.map( (opcion, key) =>{
            let nombre = opcion[Object.keys(opcion)];
            let clave = Object.keys(opcion)[0];
            let newOption = { clave, nombre }
            return newOption;
        });
        }
    }
    
    validar();
    setOpciones();

</script>

<template>
    <div class=" fv-plugins-icon-container" v-if="!campo.ocultar">
        <VueMultiselect 
            v-model="campo.valor" 
            :options="options" 
            :multiple="campo.tipo == 'multiple'" 
            label="nombre" 
            track-by="clave" 
            :searchable="true"
            @input="validar" 
            :disabled="campo.disabled" 
            placeholder="Seleccione" 
            selectLabel="Presione enter para seleccionar" 
            deselectLabel="Presione enter para eliminar">
        </VueMultiselect>
		<small v-if="campo.mensajes && campo.mensajes.length > 0 && ( showMensajes || estadoFormulario > 0)" class="position-absolute">
            <p  class="form-text text-danger">
            {{ campo.mensajes[0].mensajeStr }}
            </p>
		</small>
	</div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
