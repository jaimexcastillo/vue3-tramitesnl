<script setup>
import VueMultiselect from 'vue-multiselect'
import { getCurrentInstance, onMounted, ref, toRefs } from "vue"

    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes', 'estado'])
    const emit = defineEmits(["updateForm"])
    const instance = getCurrentInstance();
    const options = ref([])
    const {campo} = toRefs(props)
    

    onMounted(() => {

      if(campo.nombre== "Cambio de divisas" && !campo.valor){
          campo.valor = {clave: "PESOS", nombre: "Pesos"}
        validar();
      }
      
      setOpciones();

    })

    const setOpciones = async () => {
          if( campo.nombre == 'Estado'){
            let url = 'http://10.153.162.47' + "/obtener-estados" ; 
            console.log(url);
            let options = await this.obtenerOptions(url);
            options = options; 
          }
          if( campo.nombre == 'Municipio'){
            let url =  'http://10.153.162.47' + "/obtener-municipios/" + this.estado.clave ;  
            let options = await this.obtenerOptions(url);
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
          campo.mensajes = [];
            
          try {
            caracteristicas = JSON.parse(campo.caracteristicas + '');
          }catch(err){
            console.log(err);
          }
          if( caracteristicas.hasOwnProperty('required') && caracteristicas.required === 'true') {
            if(campo.tipo == 'multiple'){
              requeridoValido =  campo.valor && campo.valor.length > 0; 
            } else {
              requeridoValido =  !!campo.valor; 
            }
            if( !requeridoValido ){
              let mensaje = { 
                tipo:'required',
                mensajeStr: "El campo " + campo.nombre.toLocaleLowerCase() + " es requerido"
              }
              campo.mensajes.push( mensaje );
            }
          }
          campo.valido = requeridoValido;
          emit('updateForm', campo);
          instance?.proxy?.$forceUpdate();

    }

    // created 
    options.value = JSON.parse(props.campo?.caracteristicas).opciones;
    if(options && options.length > 0){
        if(options && options[0]["clave"] && options[0]["nombre"]){
        options = options;
        } else {
        options= options.map( (opcion, key) =>{
            let nombre = opcion[Object.keys(opcion)];
            let clave = Object.keys(opcion)[0];
            let newOption = { clave, nombre }
            return newOption;
        });
        }
    }
    
    // validar();
    setOpciones();

    const x = [1,2,3]
</script>

<template>
    <div class=" fv-plugins-icon-container" v-if="!campo.ocultar">
        <VueMultiselect 
            v-model="campo.valor" 
            :options="x" 
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
