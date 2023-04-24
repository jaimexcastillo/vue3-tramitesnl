<script setup>
import { useVuelidate } from '@vuelidate/core'
import { computed, toRefs } from 'vue'

    const emit = defineEmits(["updateForm"])
    const props =  defineProps([{
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
                    configCostos:{
                        type: Object    
                    },
                    updateListadoExpedientes:{
                        type: Number,
                        default:0
                    },
    }])
    const {campo, estadoFormulario, showMensajes, configCostos, updateListadoExpedientes} = toRefs(props)

    const v$ = useVuelidate(rules, state, { $lazy: true })
    const state = reactive({})
    const rules = {
        porcentajeVenta:{
            isMayorQuePorcentajeAsignado(value) {
                return this.porcentajeTotalCompra <= value
            },
            isPorcentajeComplete(value){
                let validarEn = ['normal', 'declaracionEn0'];
                let validar = validarEn.includes(this.configCostos.tipoTramite);
                if(validar && this.enajentantes && this.enajentantes.length > 0){
                    return this.porcentajeTotalCompra == value;
                } else {
                    return true;
                }
                
            },
            maxValue: maxValue(100)
        }
    }

    
    //computed 
    const listaCurps = computed(() =>{
        return this.enajentantes.map( enajentante => enajentante.datosPersonales.curp );
    })


    const montoGlobalOperacion = computed(() =>{
        return  this.configCostos.montoOperacion ? Vue.filter('formatoMoneda')(this.configCostos.montoOperacion +"") : false;
    })

    const pertmiteEliminarEnajenante = computed(()=>{
        let tiposPuedenEliminar = ['normal', 'declaracionEn0'];
        return tiposPuedenEliminar.includes(this.configCostos.tipoTramite);
    })

    const puedeAgregarEnajenante = computed(() => {
        let tiposPuedenEliminar = ['normal', 'declaracionEn0'];
        return tiposPuedenEliminar.includes(this.configCostos.tipoTramite);               
    })



    const enajentantes = []
    const porcentajeTotalCompra = 0
    const porcentajeVenta = 100
    const totalMontoOperacionDeEnajentantes = null
    const totalMontoOperacionDeclarado =nul

    const eliminar = (index) =>{
        enajentantes.splice(index, 1);
        calcularTotalPorcentaje();
        calcularTotalMontoOperacionDeEnajentantes();
    }

    const addEnajentante = (enajenante) =>{
        enajentantes.push(enajentante);
        calcularTotalPorcentaje();
        calcularTotalMontoOperacionDeEnajentantes();
    }

    const editaEnajentante = (response) =>{
        if( response.enajenante.tipoPersona === "pf" ){
            delete response.enajenante.datosPersonales.razonSocial;
        } else {
            delete response.enajenante.datosPersonales.nombre
            delete response.enajenante.datosPersonales.apPat
            delete response.enajenante.apMat;
            delete response.enajenante.datosPersonales.curp;
            delete response.enajenante.datosPersonales.estado;
            delete response.enajenante.datosPersonales.fechaNacimiento;
            delete response.enajenante.datosPersonales.genero;
            delete response.enajenante.ife;
        }
        enajentantes[response.index] = response.enajenante;
        
        calcularTotalPorcentaje();
        calcularTotalMontoOperacionDeEnajentantes();
    }

    const calcularTotalPorcentaje = () =>{
        // this.$v.$touch()
        let total = 0;

        enajentantes.forEach(enajentante => {
            total = Number(Number(Number(total) + Number(enajentante.porcentajeCompra)).toFixed(this.$const.PRECISION));
        });
        porcentajeTotalCompra = total;
        validar();
        // $forceUpdate();
    }

    const validar = () => {
        let validarEn = ['normal', 'declaracionEn0'];
        let validar = validarEn.includes(configCostos.tipoTramite);
        if(validar){
            campo.value.valido =  porcentajeTotalCompra == $v.porcentajeVenta.$model;
        } else {
            campo.value.valido =  enajentantes && enajentantes.length > 0;
        }
        

        let valor = {enajenantes:enajentantes, porcentajeVenta:$v.porcentajeVenta.$model};
        //valor.montoOperacion = this.montoOperacion;
        /*if(this.configCostos.declararEn0){
            valor.motivo = this.motivo;
            if( this.motivo == undefined || this.motivo.length == 0){
                this.campo.valido = false;
            }
        }*/
        campo.value.valor = valor;
        emit('updateForm', campo.value);
    
    }

    const cambioMontoOperacionGBL = () => {
        calcularPorcentajePorEnajenantes()
    }

    const calcularPorcentajePorEnajenantes = () => {
        enajentantes = enajentantes.map(enaj => {
            enaj.datosParaDeterminarImpuesto.montoOperacion = Vue.filter('formatoMoneda')( this.montoOperacionPorEnajenante( enaj ) ); 
            return enaj;
        });
        validar();  
    }

    const montoOperacionPorEnajenante = () => {
        let procenttaje = (enajenante.porcentajeCompra / 100);
        let montoOperacionGbl =  Vue.filter('toNumber')(configCostos.montoOperacion);
        return  montoOperacionGbl * procenttaje;  
    } 

    const calcularTotalMontoOperacionDeEnajentantes = () => {
        calcularTotalMontoOperacionDeclarado();   
    }

    const calcularTotalMontoOperacionDeclarado = () => {
        let eltotal = 0;
        let campoExpedientes = configCostos.campos.find(campo => campo.nombre == "Expedientes");
        if(campoExpedientes && campoExpedientes.valor){
            if(campoExpedientes.valor.expedientes){
                if( campoExpedientes.valor.expedientes.length > 0){
                campoExpedientes.valor.expedientes.forEach( expediente => {
                    
                    if( expediente.insumos && expediente.insumos.data && expediente.insumos.data.valor_operacion){
                    let total = Vue.filter('toNumber')(expediente.insumos.data.valor_operacion);
                    eltotal = eltotal + total;
                    return eltotal; 
                    }
                    
                });
                }
            } else {
                Command: toastr.error("Error!", "No se encontro configurado la seccion de expedientes, Consulte al administrador del sistema");
            }
        }
        totalMontoOperacionDeclarado = Vue.filter('formatoMoneda')( eltotal );
        //return eltotal    
    }
    
    const precision = () =>{
        $v.porcentajeVenta.$model = Number( Number( $v.porcentajeVenta.$model ).toFixed($const.PRECISION)) ;
    }

</script>   

<template>
    <div>
        <div class="row">
            <div class="col">
                <b-form-group label="Porcentaje total que enajena" label-for="procentaje-venta-input" >
                    <input  
                        id="procentaje-venta-input" 
                        name="procentaje-venta"  
                        v-model="$v.porcentajeVenta.$model"
                        @input="validar"  
                        :state="$v.porcentajeVenta.$dirty ? !$v.porcentajeVenta.$error : null" 
                        aria-describedby="porcentajeVenta-input-feedback" 
                        max="100" 
                        type="number" 
                        step="0.001" 
                        @change="precision()" 
                    />
                    <div class="" prepend="0" append="100" >
                        <input  
                            id="procentaje-venta-rango" 
                            name="procentaje-venta"  
                            v-model="$v.porcentajeVenta.$model" 
                            type="range" 
                            max="100" 
                            @input="validar" 
                            :state="$v.porcentajeVenta.$dirty ? !$v.porcentajeVenta.$error : null" 
                            aria-describedby="porcentajeVenta-input-feedback" 
                            step="0.001"
                             @change="precision()"
                        />
                    </div>
                    <div class="invalid" id="porcentajeVenta-input-feedback">
                        <span v-if="!$v.porcentajeVenta.isMayorQuePorcentajeAsignado"  class="form-text text-danger">
                           La suma de los porcentajes individuales es mayor al porcentaje de enajenación.
                        </span>
                        <span v-if="!$v.porcentajeVenta.isPorcentajeComplete"  class="form-text text-danger">
                           El porcentaje de venta debe ser de {{$v.porcentajeVenta.$model}}
                        </span>
                        <span v-if="!$v.porcentajeVenta.maxValue"  class="form-text text-danger">
                           El porcentaje de venta debe ser menor o igual a 100
                        </span>

                    </div>
                </b-form-group>
            </div>         
        </div>
        <div class="row" >
            <div class="col" >
                <div class="table-responsive" id="scrollDiv">
                        <div id="gradientBackgroundLeft" class="border-table-left" ></div>
                        <div id="gradientBackgroundRight" class="border-table-right" ></div>
                    <table class="table  table-striped" id="tableEnajenantes">
                        <thead style="border-bottom: solid;">
                            <tr>
                                <th class="text-center">
                                    Tipo de persona
                                </th>
                                <th>
                                    Nombre
                                </th>
                                <th>
                                    RFC 
                                </th>
                                <th>
                                    CURP
                                </th>
                                <th>
                                    % Venta 
                                </th>
                                <th>
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr  v-for="(registro, key) in enajentantes" :key="key" >
                                <td class="text-center">
                                    <i v-if="pertmiteEliminarEnajenante" class="fa fa-times" id="iconBtnEliminar"  @click="eliminar(key)" style="cursor: pointer; color: red;" title="Quitar"></i> 
                                    {{ registro.tipoPersona == 'pf' ? 'Persona Física' : 'Persona Moral' }}
                                </td>	
                                <td>
                                    {{ registro.tipoPersona == 'pm' ? registro.datosPersonales.razonSocial : (registro.datosPersonales.nombre + ' ' + registro.datosPersonales.apPat + ' ' + registro.datosPersonales.apMat) }}
                                </td>	
                                <td>
                                   {{ registro.datosPersonales.rfc }}
                                </td>	
                                <td>
                                    {{ registro.datosPersonales.curp }}
                                </td>	
                                <td>
                                    {{  registro.porcentajeCompra }}
                                </td>		
                                <td>
                                    <modal-component 
                                		@editaEnajentante="editaEnajentante"  
                                        :enajenanteEditado="registro" 
                                        :porcentajeAsignado="porcentajeTotalCompra" 
                                        :indexEnajenanteEditado="key"
                                        :porcentajeVenta="$v.porcentajeVenta.$model" 
                                        :listaCurps="listaCurps" 
                                        :configCostos="configCostos"
                                        :montoOperacionGbl="configCostos.montoOperacion">
                                	</modal-component>                    	
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                Porcentaje de venta asignado 
                <!-- <b-progress :value="porcentajeTotalCompra" max="porcentajeVenta" show-value class="mb-3" :precision="$const.PRECISION"></b-progress> -->

            </div>
            <transition name="fade"> 
                <div class="col" v-if="totalMontoOperacionDeclarado != montoGlobalOperacion && montoGlobalOperacion">
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                      <strong>IMPORTANTE!</strong> El monto de operación declarado, no corresponde al ingresado en el Aviso de Enajenación o no se ha presentado.
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                </div>
            </transition>
            <div class="col" v-if="puedeAgregarEnajenante">
        	    <modal-component 
        		@addEnajentante="addEnajentante" v-if="porcentajeTotalCompra < $v.porcentajeVenta.$model" 
                    :porcentajeAsignado="porcentajeTotalCompra" 
                    :porcentajeVenta="$v.porcentajeVenta.$model" 
                    :listaCurps="listaCurps" 
                    :configCostos="configCostos"
                    :montoOperacionGbl="configCostos.montoOperacion">
        	   </modal-component>
           </div>
        </div>   
    </div>  
</template>