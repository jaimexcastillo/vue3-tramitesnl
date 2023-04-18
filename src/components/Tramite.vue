<script setup>
import { ref } from "vue"
import router from "../router";

    const props = defineProps(['tramite', 'type', 'group', 'cartComponent', 'ticket'])
    const solicitante = ref({})
    const userStorage = sessionStorage.getItem('user')
    const user = JSON.parse(userStorage)?.user
    const declaracion = ref(null)
    const recibo = ref(null)
    const tramitesdoc = ref(props.tramite)
    const deleted = ref(null)
    const TRAMITE_5_ISR = 15

</script>

<template>
   <div  v-if="(ticket && !ticket.deleted) || tramite" class="card list-item card-custom gutter-b col-lg-12 my-3" :class="cartComponent && !ticket.en_carrito ? 'd-none' : ''">
        <div class="card-body" :class="group ? 'p-0' : ''">
            <!--begin::Top-->
            <div class="d-flex">
                <!--begin: Info-->
                <div class="flex-grow-1">
                    <!--begin::Title-->
                    <div class="d-flex align-items-center justify-content-between flex-wrap" :class="!group ? 'mt-2' : ''">
                        <div class="mr-7 espace-checkbox" v-if="!group && ticket && ticket.status && (ticket.status == 99 || ticket.status == 98) && !cartComponent && ['notary_titular', 'notary_substitute'].includes(user.role_name)"><input type="checkbox" :id="ticket.ticket_id" style="width:18px; height:18px;" v-on:change="processToCart(ticket, true)"></div>
                        <!--begin::User-->
                        <div class="mr-auto " v-bind:class="{'espace-checkbox-text' : !group && ticket && ticket.status && (ticket.status == 99 || ticket.status == 98) && !cartComponent && ['notary_titular', 'notary_substitute'].includes(user.role_name)}" v-bind:style="[ { maxWidth: '60%', minWidth: '40%' } ]">
                            <!--begin::Name-->
                            <a v-on:click="goTo(tramite)" class="d-flex flex-column text-dark over-primary font-size-h5 font-weight-bold mr-3">
                                <strong v-if="!group && !cartComponent" class="text-uppercase text-truncate">{{ tramite.servicio || tramite.tramite }}{{ tramite.servicio_id == TRAMITE_5_ISR && ticket && ticket.detalle && ticket.detalle.Nivel ? ` - ${ticket.detalle.Nivel}` : '' }}</strong>
                                <span :class="group ? '' : 'text-muted'" v-if="ticket && type !== undefined && !group">
                                    <span style="font-weight: normal;" v-if="ticket && tramite.folio_pago"><strong>FOLIO PAGO:</strong> {{ tramite.folio_pago ? `${tramite.folio_pago} -` : '' }}</span>
                                    <span style="font-weight: normal;" v-if="ticket && tramite.fse"><strong>FSE:</strong> {{ tramite.fse ? `${tramite.fse} -` : '' }}</span>
                                    {{ tramite.created_at }}
                                </span>
                                <span style="font-weight: normal;" class="text-muted" :class="!group ? 'mt-3' : ''" v-if="ticket && type !== undefined && ((!group && cartComponent) || !cartComponent)">
                                    <strong class="text-muted">Tramite ID:</strong>  {{ ticket.ticket_id || '' }}
                                </span>
                                <span v-bind:style="[ (!group && cartComponent) || !cartComponent ? {} : { 'font-size' : '12px' } ]" v-if="ticket && type !== undefined && ticket.enajenante">{{ ticket.enajenante.datosPersonales.rfc || ticket.enajenante.datosPersonales.curp || "" }} - {{ ticket.enajenante.tipoPersona == "pm" ? ticket.enajenante.datosPersonales.razonSocial : `${ticket.enajenante.datosPersonales.nombre} ${ticket.enajenante.datosPersonales.apPat} ${ticket.enajenante.datosPersonales.apMat}` }}</span>
                                <span v-bind:style="[ (!group && cartComponent) || !cartComponent ? {} : { 'font-size' : '12px' } ]" v-if="ticket && type !== undefined && ticket.solicitantes">{{ ticket.solicitantes[0].tipoPersona == "pm" ? ticket.solicitantes[0].razonSocial : `${ticket.solicitantes[0].nombreSolicitante} ${ticket.solicitantes[0].apPat} ${ticket.solicitantes[0].apMat}` }} <span v-if="ticket.solicitantes.length > 1" class="text-muted">(+{{ticket.solicitantes.length-1}})</span></span>
                            </a>
                            <!--end::Name-->
                        </div>
                        <!--begin::User-->
                        <!--begin::Actions-->
                        <div class="my-lg-0 my-1 boton-lista-mobil">
                            <!-- <detalle-actualizado-component :items="ticket" v-if="ticket && tramite.status == 99"></detalle-actualizado-component> -->
                            <button v-on:click="addToCart(tramite)" v-if="!group && ticket && tramite.status == 99 && !['notary_capturist'].includes(user.role_name)" type="button" class="btn btn-sm" :class="tramite.en_carrito ? 'btn-primary' : 'btn-outline-primary'">
                                <small v-if="tramite.loading"><i class="fas fa-spinner fa-spin"></i></small>
                                <small v-if="!tramite.loading"><i :class="tramite.en_carrito == 1 ? (cartComponent ? 'fas fa-trash' : 'fas fa-check-circle') : 'fas fa-plus-circle'"></i> {{ tramite.en_carrito == 1 ? (cartComponent ? 'ELIMINAR' : 'QUITAR DEL CARRITO') : 'AGREGAR AL CARRITO' }}</small>
                            </button>
                            <button v-on:click="addToSign(tramite)" v-if="!group && ticket && type == '98' && ['notary_titular', 'notary_substitute'].includes(user.role_name)" type="button" class="btn btn-sm" :class="tramite.por_firmar ? 'btn-primary' : 'btn-outline-primary'">
                                <span v-if="tramite.loadingSign"><i class="fas fa-spinner fa-spin"></i></span>
                                <span v-if="!tramite.loadingSign"><i :class="tramite.por_firmar == 1 ? 'fas fa-check-circle' : 'fas fa-plus-circle'"></i> {{ tramite.por_firmar == 1 ? 'DESELECCIONAR' : 'PREPARAR PARA FIRMAR' }}</span>
                            </button>
                            <a v-on:click="router.push(`/detalle-tramite/${tramite.id_tramite}`)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white" v-if="!ticket">
                                INICIAR TRAMITE
                            </a>

                            <button v-on:click="cancelReference(tramite)" class="btn btn-sm btn-danger font-weight-bolder text-uppercase text-white" v-if="ticket && tramite.recibo_referencia && [5].includes(type) && !group">CANCELAR REFERENCIA</button>
                            <a v-on:click="goTo(tramite.recibo_referencia, true)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white" v-if="ticket && tramite.recibo_referencia && [5].includes(type) && !group">VER REFERENCIA</a>
                            <button 
                                v-if="tramite.firmado && [2,3].includes(type) && tramite.required_docs != 1 "
                                class="btn btn-warning disabled" 
                                style="border-top-right-radius: 0px;border-bottom-right-radius: 0px;font-size: 5px;border-radius: 1 1 0 0 !important;margin-right: -4px;height:32px" 
                                data-toggle="tooltip" 
                                data-placement="top" 
                                title="No es posbile descargar este archivo al no contar con el documento del CALCULO DEL ISR CONFORME AL 126 LISR O COMPROBANTE DE LA EXENCIÓN ">
                                    <i class="text-white fa fa-question-circle"></i>
                            </button>
                            <a class="btn btn-sm btn-primary font-weight-bolder text-uppercase disabled text-white" disabled  style="border-top-left-radius:0px;border-bottom-left-radius:0px" v-if="tramite.firmado && [2,3].includes(type) && tramite.required_docs != 1 ">VER DECLARACIÓN</a>
                            <!-- <a v-on:click="goTo(tramite.doc_firmado, true)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white" v-if="tramite.doc_firmado && [2,3].includes(type) && tramite.required_docs == 1">VER DECLARACIÓN</a> -->
                            <div class="btn-group" v-if="ticket && [2,3].includes(tramite.status)">
                                <a v-on:click="goTo(ticket.doc_firmado[0], true)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white" v-if="ticket && ticket.doc_firmado && [2,3].includes(type) && tramite.required_docs == 1 " :class="ticket && ticket.doc_firmado && ticket.doc_firmado.length == 1 ? 'rounded' : ''">VER DECLARACIÓN</a>
                                <!-- <button 
                                    v-if="tramite.firmado && [2,3].includes(type) && tramite.required_docs != 1 "
                                    class="btn btn-warning disabled" 
                                    style="border-top-right-radius: 0px;border-bottom-right-radius: 0px;font-size: 5px;border-radius: 1 1 0 0 !important;margin-right: -4px;height:32px" 
                                    data-toggle="tooltip" 
                                    data-placement="top" 
                                    title="No es posbile descargar este archivo al no contar con el documento del CALCULO DEL ISR CONFORME AL 126 LISR O COMPROBANTE DE LA EXENCIÓN ">
                                        <i class="text-white fa fa-question-circle"></i>
                                </button>
                                <a class="btn btn-sm btn-primary font-weight-bolder text-uppercase disabled text-white" disabled  style="border-top-left-radius:0px;border-bottom-left-radius:0px" v-if="tramite.firmado && [2,3].includes(type) && tramite.required_docs != 1 ">VER DECLARACIÓN</a> -->

                                <button v-if="ticket && ticket.doc_firmado && ticket.doc_firmado.length > 1" type="button" class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right" v-if="tramite.files">
                                    <a v-for="(doc, ind) in ticket.doc_firmado" class="dropdown-item" :href="doc" target="_blank" :key="ind"><i class="fas fa-download mr-2"></i> {{ doc.split('/')[doc.split('/').length-1] }}</a>
                                </div>
                            </div>


                            <!-- <modal-document-component  :tramitesdoc="tramitesdoc" v-if="tramite.required_docs === 0"   ></modal-document-component> -->
                            <a v-on:click="goTo(tramite.url_recibo, true)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white" v-if="tramite && tramite.url_recibo && [2,3].includes(type) && !group">VER RECIBO DE PAGO</a>
                            <div class="btn-group" v-if="ticket && !cartComponent && !group && ![7,8].includes(tramite.status)">
                                <!-- <btn-eliminar-borrador-component :tramite="tramite" @responseDelete="responseDelete"></btn-eliminar-borrador-component> -->
                                <a v-on:click="goTo(tramite)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white" :class="tramite.files && tramite.files.length == 0 ? 'rounded' : ''">
                                    <span class="text-white">VER DETALLES</span>
                                </a>
                                <button v-if="tramite.files && tramite.files.length > 0" type="button" class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right" v-if="tramite.files">
                                    <a v-for="(file, ind) in tramite.files" class="dropdown-item" :href="file.href || file" target="_blank" :key="ind"><i class="fas fa-download mr-2"></i> {{ file.name || file }}</a>
                                </div>
                            </div>
                            <a v-on:click="goTo(`detalle-tramite/${tramite.id_tramite || tramite.tramite_id}?clave=${tramite.clave}`)" class="btn btn-sm btn-success font-weight-bolder text-uppercase text-white" v-if="[7,8].includes(tramite.status)">
                                CONTINUAR
                            </a>
                            <span v-if="ticket && cartComponent" class="btn btn-secondary">MX{{ new Intl.NumberFormat('es-MX', { style : 'currency', currency : 'MXN' }).format(tramite.importe_tramite) }}</span>
                            <span v-if="!group && ticket && tramite.info && tramite.descripcion && !cartComponent" class="btn btn-secondary">{{ tramite.descripcion || "CERRADO" }} </span>
                        </div>
                        <!--end::Actions-->
                    </div>
                    <!--end::Title-->
                </div>
                <!--end::Info-->
            </div>
            <!--end::Top-->
        </div>
    </div>
</template>
