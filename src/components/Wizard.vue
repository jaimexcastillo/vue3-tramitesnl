<script setup>
import { getCurrentInstance, ref } from "vue"

    const instance = getCurrentInstance();
    const tramite = {"id_tramite":"803","tramite":"TRAMITE CAMPOS","partidas":0,"id_seguimiento":"6541b242-a91c-484b-a189-3bbbd5922d88"}
    const userStorage = sessionStorage.getItem('user')
    const usuario = JSON.parse(userStorage)?.user
    const formularioValido = ref(true)
    const idUsuario = usuario.id
    const currentStep = ref(1)
    const camposGuardadosObtenidos = ref(true)
    const tipoTramite = ref('normal')
    const infoGuardada = {}
    const files = []
    const comprobarEstadoFormularioCount = 0
    const steps = [{
                  id:"tab1",
                  state:'current',
                  clickGotTo:1,
                  wizardNumber:1,
                  wizardTitle:'Datos',
                  wizardDesc:'Información sobre el trámite',
                },{
                  id:"tab2",
                  state:'pending',
                  clickGotTo:2,
                  wizardNumber:2,
                  wizardTitle:'Solicitante',
                  wizardDesc:'Solicitante del trámite',
                },{
                  id:"tab3",
                  state:'pending',
                  clickGotTo:3,
                  wizardNumber:3,
                  wizardTitle:'Finalizar',
                  wizardDesc:'Revisar y completar',
    }]
    const TRAMITE_5_ISR =  399

    const declararEn0 = false


    let finalizando = false


    const updateScore = (formularioValido) => {
        // $("#btnWizard").attr("disabled", true);
        // if( formularioValido ){
        //     $("#btnWizard").attr("disabled", false);
        // }
        formularioValido = formularioValido;
        instance?.proxy?.$forceUpdate();
    }

    const  updatingFiles = ( newfiles ) => {
        files = newfiles;
    }
</script>

<template>
  <div class="card card-custom card-transparent" >
        <div class="card-body p-0" >
            <div class="wizard wizard-4" id="kt_wizard" data-wizard-state="first" data-wizard-clickable="true" >
                <div class="wizard-nav">
                    <div class="wizard-steps">
                        <div v-for="(step, i) in steps" :key="i" class="wizard-step wizard-step-mobile" data-wizard-type="step" :data-wizard-state="step.state" :id="step.id" v-on:click="goTo(step.clickGotTo)">
                            <div class="wizard-wrapper">
                                <div class="wizard-number">
                                  {{ step.wizardNumber}}
                                </div>
                                <div class="wizard-label">
                                    <div class="wizard-title">
                                      {{ step.wizardTitle}}
                                    </div>
                                    <div class="wizard-desc">
                                        {{ step.wizardDesc}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card card-custom card-shadowless rounded-top-0">
                    <div class="card-body p-0">
                        <div class="row justify-content-center  py-lg-15 px-lg-10">
                            <div class="col-xl-12 col-xxl-12">
                                    <div class="pb-5 c" data-wizard-type="step-content" data-wizard-state="current" id="step1">
                                      <div v-if="tramite.id_tramite == TRAMITE_5_ISR && camposGuardadosObtenidos">
                                        <RadioOption
                                          :default="tipoTramite"
                                          @valueRadio="cambioRadio"
                                          :disabledDefault='tipoTramiteDisabled' />
                                      </div>
                                      <transition name="slide-fade" appear>
                                        <div  v-if="tramite.id_tramite == TRAMITE_5_ISR && tipoTramite == 'complementaria' || tipoTramite == 'correccionFiscal'">  
                                          <!-- <b-alert show variant="warning">
                                            IMPORTANTE: Ingresar los datos de la última declaración presentada.
                                          </b-alert> -->
                                        </div>  
                                      </transition>
                                      <div v-if="camposGuardadosObtenidos" >
                                        <CamposTramite 
                                            :tramite="tramite" 
                                            v-if="currentStep == 1"
                                            :formularioValido="formularioValido" 
                                            @updatingScore="updateScore" 
                                            :comprobarEstadoFormularioCount="comprobarEstadoFormularioCount" 
                                            @updatingFiles="updatingFiles" 
                                            :infoGuardada="infoGuardada" 
                                            :declararEn0="declararEn0" 
                                            :usuario="usuario" 
                                            :filesPrecargados="files" 
                                            :tipoTramite="tipoTramite"
                                         />
                                      </div>
                                    </div>
                                    <div class="pb-5" data-wizard-type="step-content" id="step2" >
                                      <!-- <solicitantes-component v-if="currentStep == 2 && camposGuardadosObtenidos" @updatingSolicitante="updateSolicitante" :solicitantesGuardados="solicitantesGuardados" :usuario="usuario"></solicitantes-component> -->
                                    </div>
                                    <div class="pb-5" data-wizard-type="step-content" id="step3" >
                                        <div v-if="tramite.id_tramite == TRAMITE_5_ISR ">
                                          <!-- <resumen-tramite-5-isr-component v-if="currentStep == 3"
                                          :tipoTramite="tipoTramite" 
                                          :files="files" 
                                          :usuario="usuario" @actualizandoDatos="actualizandoDatos">
                                          </resumen-tramite-5-isr-component> -->
                                        </div>
                                        <div v-else>
                                          <!-- <resumen-tramite-component v-if="currentStep == 3" 
                                          :tipoTramite="tipoTramite" 
                                          
                                          :infoGuardadaFull="infoGuardadaFull" 
                                          ></resumen-tramite-component> -->
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between border-top mt-5 pt-10">
                                        <div class="mr-2">
                                            <button type="button" class="btn btn-light-primary font-weight-bolder text-uppercase px-9 py-4" data-wizard-type="action-prev">Previous</button>
                                        </div>
                                        <div class="pb-5" >
                                          <div class="btn-group" role="group" aria-label="Basic example">
                                             <!-- <btn-guardar-tramite-component
                                              type="temporal"
                                              :tipoTramite="tipoTramite"
                                              :files="files"
                                              :idUsuario="idUsuario"
                                              :infoGuardadaFull="infoGuardadaFull" v-if="currentStep != 3" labelBtn="Guardar y Continuar después "
                                              @tramiteAgregadoEvent="tramiteAgregadoEvent"
                                              ></btn-guardar-tramite-component>
                                            <btn-guardar-tramite-component
                                              :btnClass="['notary_titular', 'notary_substitute', 'notary_payments', 'notary_capturist_payments' ,'funcionario'].includes(user.role_name) ? 'btn btn-secondary font-weight-bolder text-uppercase px-9 py-4' : null"
                                              :tipoTramite="tipoTramite"
                                              :files="files"
                                              
                                              :idUsuario="idUsuario"
                                              :infoGuardadaFull="infoGuardadaFull"
                                              v-if="currentStep == 3" 
                                              :labelBtn="['notary_titular', 'notary_substitute', 'notary_payments', 'notary_capturist_payments'].includes(user.role_name) ? 'Iniciar Nuevo Tramite' : 'Finalizar'"
                                              @tramiteAgregadoEvent="tramiteAgregadoEvent"
                                              ></btn-guardar-tramite-component>
                                            <btn-guardar-tramite-component
                                              type="finalizar"
                                              :tipoTramite="tipoTramite"
                                              :files="files"
                                              :idUsuario="idUsuario"
                                              :infoGuardadaFull="infoGuardadaFull"
                                              v-if="currentStep == 3 && ['notary_titular', 'notary_substitute', 'notary_payments', 'notary_capturist_payments', 'funcionario'].includes(user.role_name)"
                                              labelBtn="Pagar"
                                              @tramiteAgregadoEvent="tramiteAgregadoEvent"
                                              :actualizandoDatosResumen="actualizandoDatosResumen"
                                              ></btn-guardar-tramite-component> -->
                                            <button type="button" id="btnWizard" class="btn btn-primary font-weight-bolder text-uppercase px-9 py-4 arrow-desktop" data-wizard-type="action-next" v-on:click="next()" v-if="currentStep != 3">
                                                Siguiente
                                            </button>
                                            <button type="button" id="btnWizard" class="btn btn-primary font-weight-bolder text-uppercase px-9 py-4 arrow-mobile" data-wizard-type="action-next" v-on:click="next()" v-if="currentStep != 3"> 
                                                <i class="fas fa-arrow-right"></i>
                                            </button>
                                          </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-custom card-shadowless rounded-top-0" style="display: none;" id="redirecLoad">
                  <div class="card-body p-0">
                    <div class="row justify-content-center py-8 px-8 py-lg-15 px-lg-10">
                      <div class="col-xl-12 col-xxl-12">
                        <div class="text-center">
                          <!-- <b-spinner variant="success"  style="width: 3rem; height: 3rem;" label="Large Spinner" type="grow"></b-spinner> -->
                        </div>
                      </div>
                    </div>
                  </div>
            </div>

        </div>

    </div>
</template>    