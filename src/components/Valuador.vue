<script setup> 
import useVuelidate from "@vuelidate/core"
import { required, helpers  } from 'vuelidate/lib/validators';

import { toRefs } from "vue"

    const emit = defineEmits(['updateForm'])
    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes'])
    const {campo} = toRefs(props)
    const rfcPattern = helpers.regex("mob", /^[A-ZÑ&]{3,4}\d{6}(?:[A-Z\d]{3})?$/);

    const isValuable = ref(false)
    const form = ref({
        datosValuo: {
            valuador:{
            nombre:"", apPat:"", apMat:"", rfc:""
            }
        },
    })


    const rules = () =>{
        if(isValuable.value){
              return {
                  datosValuo:{ 
                    valuador: { 
                      nombre:{required },
                      apPat:{required },
                      apMat:{required:false },
                      rfc:{required,rfcPattern }
                    }
                }
              }
            } else {
              return {
                  datosValuo:{ valuador: { 
                      nombre:{required:false },
                      apPat:{required:false  },
                      apMat:{required:false },
                      rfc:{required:false  }
                    }
                }
              }
          }
    }

    const v$ = useVuelidate(rules, state, { $lazy: true })



    // created
    valor && campo.value.valor.datosValuo){
        form.value = {
            datosValuo : campo.value.valor.datosValuo,
            
        }
        isValuable.value = campo.value.valor.isValuable
    }
    validar();


    const validar = () => {
        campo.valido =  $v.form.$invalid;
        let valor = { isValuable:isValuable};

        if(isValuable){
        valor.datosValuo = form.datosValuo
        }

        campo.value.valor = valor;
        emit('updateForm', campo.value);          
    
    },

</script>

<template>
    <div>
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <v-card label="¿Cuenta con avalúo?" v-slot="{ ariaDescribedby }">
                <v-radio-group id="tipoPersona" v-model="isValuable" :aria-describedby="ariaDescribedby" name="radio-options-tipoPersona" @change="validar">
                    <template #first>
                        <v-radio :value="true">Si</v-radio>
                    </template>
                    <v-radio :value="false">No</v-radio>
                </v-radio-group>
            </v-card>
            <v-card class="d-flex row" v-if="isValuable">
                <v-card class="col-12 col-md-6"  cols="12" md="6">
                    <v-card label="Nombre" label-for="nombre-input" >
                        <input id="nombre-input" name="nombre" v-model="$v.form.datosValuo.valuador.nombre.$model" style="background-color: #e5f2f5 !important" placeholder="Nombre" @change="validar" 
                        :state="$v.form.datosValuo.valuador.nombre.$dirty ? !$v.form.datosValuo.valuador.nombre.$error : null"  aria-describedby="nombre-input-feedback" v-uppercase>
                        <small id="nombre-input-feedback"  class="position-absolute">
                        <p v-if="!$v.form.datosValuo.valuador.nombre.required"  class="form-text text-danger">
                            El Nombre es requerido.
                        </p>
                        </small>
                    </v-card>
                </v-card>
                <div class="col-12 col-md-6" cols="12" md="6">
                    <v-card label="Apellido paterno" label-for="apPat-input" >
                        <input id="apPat-input" name="apPat" v-model="$v.form.datosValuo.valuador.apPat.$model" style="background-color: #e5f2f5 !important" placeholder="Apellido paterno" 
                        @change="validar" :state="$v.form.datosValuo.valuador.apPat.$dirty ? !$v.form.datosValuo.valuador.apPat.$error : null"  aria-describedby="apPat-input-feedback" v-uppercase>
                        <small id="apPat-input-feedback"  class="position-absolute">
                            <p v-if="!$v.form.datosValuo.valuador.apPat.required"  class="form-text text-danger">
                            Apellido paterno
                            </p>
                        </small>
                    </v-card>
                </div>
                <div class="col-12 col-md-6" cols="12" md="6">
                    <v-card label="Apellido materno" label-for="apMat-input" >
                        <input id="apMat-input" name="apMat" v-model="$v.form.datosValuo.valuador.apMat.$model" style="background-color: #e5f2f5 !important" placeholder="Apellido materno" @change="validar" v-uppercase>
                    </v-card>
                </div> 
                <div class="col-12 col-md-6" cols="12" md="6">
                    <v-card label="RFC" label-for="rfc-input" >
                        <input  v-uppercase id="rfc-input" name="rfc" v-model="$v.form.datosValuo.valuador.rfc.$model" style="background-color: #e5f2f5 !important" placeholder="RFC" @change="validar" 
                        :state="$v.form.datosValuo.valuador.rfc.$dirty ? !$v.form.datosValuo.valuador.rfc.$error : null"  aria-describedby="rfc-input-feedback">
                        <small id="rfc-input-feedback"  class="position-absolute">
                            <span v-if="!$v.form.datosValuo.valuador.rfc.required"  class="form-text text-danger">
                            El RFC es requerido.
                            </span>
                            <span v-if="!$v.form.datosValuo.valuador.rfc.rfcPattern"  class="form-text text-danger">
                            El RFC no cumple con la regla de validación.
                            </span>
                        </small>
                    </v-card>
                </div>          
            </v-card>
        </form> 
    </div>
</template>
