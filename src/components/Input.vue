<script setup>
import { getCurrentInstance, watch } from "vue";


  const props = defineProps(['campo', 'estadoFormulario', 'showMensajes', 'updateIt'])
  const instance = getCurrentInstance();
  const emit= defineEmits(["curpSearch", "actionTipoElemento", "refrescarBusqueda"])


  const formatear = () => {
      var number = campo.valor ? Number((campo.valor+"").replace(/[^0-9.-]+/g,"")) : "";
      let caracteristicas= getCaracteristicas();
      if( caracteristicas.formato == "moneda" && campo.valido){
        const formatter  = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 0
        });
      if( caracteristicas.formato == 'curp'){
            var self = this;
            let url = process.env.TESORERIA_HOSTNAME + "/consultar-curp/" + campo.valor ;  
            // let url = process.env.TESORERIA_HOSTNAME + "/insumos-catastro-consulta/7090036008";  
            $.ajax({
                type: "GET",
                dataType: 'json', 
                url,
                success:function(data){
                    // self.rellenarForm(data);
                    console.log('..se consulto el curp respuesta : ' + data );
                    // this.$data = data.data.nombres;
                },
                error:function(error){
                    console.log(error);
                },
                complete:function(){
                    console.log('ya quedo');
                }
            });
      }
        campo.valor = formatter.format(number);
        
      }
      if (campo.valor) {
        if( caracteristicas.formato == 'curp' && campo.valor.length  ==  18  ){
          var self = this;
            console.log('------');
            let url = process.env.TESORERIA_HOSTNAME + "/consultar-curp/" + campo.valor ;  
            $.ajax({
              type: "GET",
                dataType: 'json', 
                url,
                success:function(data){
                  // self.rellenarForm(data);
                    console.log('..se consulto el curp respuesta : ' + data );
                    // this.$data = data.data.nombres;
                    emit('curpSearch', data)
                },
                error:function(error){
                  console.log('error: ', error);
                },
                complete:function(){
                  console.log('ya quedo');
                }
            });
        }
      }

      if(caracteristicas.formato == 'manzana'){
        campo.valor =  padLeft(campo.valor, 3);  
      }
      instance?.proxy?.$forceUpdate();

  }

  const  padLeft = (value, length)  =>  {
    return (value.toString().length < length) ? padLeft("0" + value, length) : value;
  }

  const accion = () => {
    emit('actionTipoElemento', campo);
  }

  const refrescarBusqueda= () => {
    emit('refrescarBusqueda', {refresh:true});
  }

  watch(
     () => props.updateIt, async ( newval, oldval) => {
        validar();
  },
  {deep: true})
</script>


<template>
  <div class=" fv-plugins-icon-container" v-if="!campo.ocultar">
    <span class="currencyinput input-group mb-3">
      <input 
        :name="campo.nombre"
        type="text"
        class="form-control"
        :placeholder="[[JSON.parse(campo.caracteristicas).etiqueta ? JSON.parse(campo.caracteristicas).etiqueta : campo.nombre]]"
        :id="[[campo.campo_id]]"
        v-model="campo.valor"
        @change="validar"
        :disabled="campo.disabled"
      />
      <div class="input-group-append" v-if="campo.nombre == 'Tramite ID'">
        <button class="btn btn-outline-secondary" type="button" id="button-addon1"  title="Buscar datos" @click="accion()" v-if="!campo.disabled">
          <i class="fa fa-search"></i>
        </button>
        <button  class="btn btn-outline-secondary" type="button" id="button-addon1" title="Nueva busqueda" @click="refrescarBusqueda()" v-if="campo.disabled">
            Nueva
        </button> 
      </div>
    </span> 

    <small  v-if="campo.mensajes && campo.mensajes.length > 0 && ( showMensajes || estadoFormulario > 0)" class="position-absolute">
          <p  class="form-text text-danger">
            {{ campo.mensajes[0].mensajeStr }}
          </p>
    </small>
  </div>
</template>
