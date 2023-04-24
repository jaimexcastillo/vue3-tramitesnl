<script setup>

</script>

<template>
    <div>
        <v-btn style="color:white" @click="openModal()" :class="classBtn">
        <i :class="btnIcon" style="color:white"></i> 
        Agregar expediente
        </v-btn>

        <v-dialog size="xl" :id="idModa" ref="modal" :title="titleModal" @show="resetModal" @hidden="resetModal" @ok="handleOk" 
        :ok-title = "btnOkLabel" :ok-disabled="!direccion.datos_direccion || buscandoInsumos || buscandoDatosDomicilio">
            <div class="fluid">
                <form ref="form" @submit.stop.prevent="handleSubmit">
                <div class="d-flex row"> 
                    <div class="col-4" cols="" md="4" >
                        <v-card label="Folio del aviso de enajenación o folio forma" label-for="folio-input" >
                            <v-card size="lg"> 
                            <input
                                id="folio-input" name="folio" v-model="$v.form.folio.$model"  :state="$v.form.folio.$dirty ? !$v.form.folio.$error : null"  aria-describedby="folio-input-feedback"
                                @change="getMontoOperacion" v-uppercase>
                            <template #append>
                                <v-card-text v-b-tooltip.hover title="Localizado en el informativo de valor catastral o aviso de enajenación" style="font-size: 7px;" >
                                <i class="fa fa-question-circle" style="color: cornflowerblue;"></i>
                                </v-card-text>
                            </template>
                            </v-card>
                            <v-card class="invalid-sintax" id="folio-input-feedback">
                            <span v-if="!$v.form.folio.required"  class="form-text text-danger">
                                El Folio es requerido.
                            </span>
                            </v-card>
                        </v-card>
                    </div>
                    <div class="col-4" cols="" md="4" >
                        <v-card label="Estado" label-for="estado-select" >
                            <multiselect id="estado-select" v-model="$v.form.estado.$model" :options="estados" label="nombre" track-by="clave" 
                            :searchable="true" @input="getMunicipios" :state="$v.form.estado.$dirty ? !$v.form.estado.$error : null"  aria-describedby="estado-select-feedback" 
                            :disabled="desabilitarSelecEstados" ></multiselect>
                            <v-card id="estado-select-feedback">
                            <span v-if="!$v.form.estado.required"  class="form-text text-danger">
                                Estado requerido.
                            </span>
                            </v-card>
                        </v-card>
                    </div>
                    <div class="col-4" cols="" md="4" >
                        <v-card label="Municipio" label-for="municipio-select" >
                            <multiselect id="municipio-select" v-model="$v.form.municipio.$model" :options="municipios" label="nombre" track-by="clave" 
                            :searchable="true" :state="$v.form.municipio.$dirty ? !$v.form.municipio.$error : null"  aria-describedby="municipio-select-feedback"  @input="setValMunicipio"></multiselect>
                            <v-card id="municipio-select-feedback">
                                <span v-if="!$v.form.municipio.required"  class="form-text text-danger">
                                    Municipio requerido.
                                </span>
                            </v-card>
                        </v-card>
                    </div>
                    <div class="col-4" cols="" md="4" >
                        <v-card label="No. Expediente Catastral" label-for="expediente-input" >
                            <v-card size="lg"> 
                            <template #prepend>
                                <v-card-text >{{clave}}</v-card-text>
                            </template>
                            <v-input v-mask="'##-###-###'"
                                id="expediente-input" name="expediente" v-model="$v.form.expediente.$model"  :state="$v.form.expediente.$dirty ? !$v.form.expediente.$error : null"  aria-describedby="expediente-input-feedback" @change="getDatosDomicilio"
                                :disabled="$v.form.municipio.$invalid"></v-input>
                            </v-card>
                            <v-card id="expediente-input-feedback">
                                <span v-if="!$v.form.expediente.required"  class="form-text text-danger">
                                    El Expediente es requerido.
                                </span>
                            <v-card/>
                        </v-card>
                    </div>
                </div>        
                </form>
                <transition name="slide-fade">
                    <div v-if="!buscandoDatosDomicilio">
                        <div class="card" v-if="direccion" key="yes">
                        <div class="card-body">           
                            <h6 class="pt-3 pl-3">Datos Catastro</h6>
                            <hr>
                            <div class="overflow-auto" style="height:350px;">
                                {{ direccion }}
                                <!-- <tree-component
                                class="item"
                                :item="direccion"
                                ></tree-component> -->
                            </div>
                        </div>
                        </div>
                        <div v-else-if="$v.form.expediente.$dirty && !$v.form.expediente.$invalid && !(direccion && direccion.datos_direccion)" key="no">
                        Ubicación No encontrada
                        </div>
                    </div>
                    <div v-if="buscandoDatosDomicilio" class="text-center">
                        <!-- <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner> -->
                    </div>
                </transition>
            </div>
        </v-dialog>
    </div>
</template>
