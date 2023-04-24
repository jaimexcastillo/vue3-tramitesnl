
<script setup> 
import { onBeforeMount, ref, toRefs } from "vue"

    const props = defineProps({
          campo:{
            default: null,
            type: Object
          },
          estadoFormulario:{
            default: null,
            type: Number
          },
          showMensajes:{
            default: false,
            type: Boolean
          },
          usuario:{
            type:Object
          }
    })
    const {campo, usuario} = toRefs(props)
    const expedientes = ref([])
    const camposExpedientes = ref([
        { key: 'municipio', label: 'Expediente Catastral' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'acciones', label: 'Acciones' }
    ])


    onBeforeMount(() => {
        if(campo.value.valor && campo.value.valor.expedientes && campo.value.valor.expedientes.length > 0){
            expedientes.value = campo.value.valor.expedientes;
        }
        this.validar();
    })


    const eliminar =( registro ) => {
            let index = expedientes.value.findIndex( expediente => expediente.municipio.clave == registro.municipio.clave  &&  expediente.expediente == registro.expediente )
            expedientes.value.splice(index, 1);
            validar();
        }

    const addExpediente = (expediente) => {
        let index = expedientes.value.findIndex( expedienteLista => expedienteLista.municipio.clave == expediente.municipio.clave  &&  expedienteLista.expediente == expediente.expediente );
        if(index < 0){
            expedientes.value.push(expediente);
        }
        validar();
    }

    const validar = () => {
        campo.value.valido =  expedientes.value && expedientes.value.length > 0;
        campo.value.valor = {expedientes:expedientes.value};
        emit('updateForm', campo.value);
    
    }

</script>

<template>
    <div>
        <div   class="form-group fv-plugins-icon-container">
            <v-table responsive striped hover :items="expedientes" :fields="camposExpedientes" ref="table"  class="text-center">
                <template #cell(municipio)="data">
                    <i class="fa fa-times" id="iconBtnEliminar"  @click="eliminar(data.item)" style="cursor: pointer; color: red;" title="Quitar"></i> 
                    {{ data.item.municipio.clave }}-{{ data.item.expediente }}
                </template>

                <template #cell(direccion)="data" >
                    <div class="text-left" v-if=" data.item.direccion && data.item.direccion.datos_direccion[0]">
                        <span v-if="data.item.direccion.datos_direccion[0].calle">  
                            CALLE: <span class="text-muted"> {{ data.item.direccion.datos_direccion[0].calle }}</span> <br> 
                        </span>
                        <span v-if="data.item.direccion.datos_direccion[0].num_ext">  
                            N°: <span class="text-muted">{{data.item.direccion.datos_direccion[0].num_ext}}</span> <br> 
                        </span>
                        
                        <span v-if="data.item.direccion.datos_direccion[0].manzana">  
                        MANZANA:  <span class="text-muted">  {{data.item.direccion.datos_direccion[0].manzana}}</span><br> 
                        </span>

                        <span v-if="data.item.direccion.datos_direccion[0].cp">  
                            CP:  <span class="text-muted"> {{data.item.direccion.datos_direccion[0].cp}}</span><br> 
                        </span>
                        <span v-if="data.item.direccion.datos_direccion[0].lote">  
                            LOTE:  <span class="text-muted"> {{data.item.direccion.datos_direccion[0].lote}}</span><br> 
                        </span>
                        <span v-if="data.item.direccion.datos_direccion[0].colonia">  
                            COLONIA:  <span class="text-muted"> {{data.item.direccion.datos_direccion[0].colonia}}</span><br> 
                        </span>
                        <span v-if="data.item.direccion.datos_direccion[0].nombre_loc">  
                            LOCALIDAD:  <span class="text-muted">  {{data.item.direccion.datos_direccion[0].nombre_loc}}</span><br> 
                        </span>
                    </div>
                    <div class="text-center" v-if="!data.item.direccion">
                        <span class="text-muted"> No se encontro información </span>
                    </div>
                </template>


                <template #cell(acciones)="data">
                    <div>
                        <a title="Click para ver detalles" @click="data.toggleDetails" class="mr-2 btn btn-link">
                            {{!data.detailsShowing ? "Ver detalle " : "Ocultar detalle "}}
                        </a>
                    </div>
                </template> 
                <template #row-details="data"  #title="Detalle">
                    <v-card no-body v-if="data">
                        <v-card-text id="nav-scroller" ref="content" style="position:relative; height:400px; overflow-y:scroll;">
                            <div >
                                    <!-- <tree-component
                                        class="item"
                                        :item="data.item.direccion"
                                    ></tree-component> -->
                            </div>
                        </v-card-text> 
                    </v-card>
                </template>                                                          
            </v-table>
        </div>

        <modal-expedientes-component @addExpediente="addExpediente" :usuario="usuario"></modal-expedientes-component>
    </div>
</template>

