<script setup>
import { getCurrentInstance, ref, toRefs } from "vue";

    const instance = getCurrentInstance();
    const emit = defineEmits(["updatingScore","updatingFiles"])
    const mostrar = ref(true)
    const props = defineProps(['tramite','formularioValido', 'comprobarEstadoFormularioCount', 'infoGuardada', 'declararEn0', 'notary', 'usuario', 'filesPrecargados', 'tipoTramite'])
    const progress = ''
    const expediente = ''
    const selectedId = []
    const campos = []
    const agrupaciones =[{"agrupacion_id":463,"nombre_agrupacion":"GRUPO CAMPOS","campos":[{"relationship":2372,"tipo":"select","nombre":"Escritura","caracteristicas":"{\"required\":\"true\",\"size\":\"4\",\"opciones\":[{\"Opcion 1\":\"Opcion 1\"},{\"Opcion 2\":\"Opcion 2\"}],\"etiqueta\":\"Campo de Opciones\"}","campo_id":1,"agrupacion_id":463,"orden_agrupacion":1,"orden":1,"nombre_agrupacion":"GRUPO CAMPOS","alias":"escritura","disabled":false,"mensajes":[{"tipo":"required","mensajeStr":"El campo escritura es requerido"}],"valido":false},{"relationship":2374,"tipo":"option","nombre":"Acta","caracteristicas":"{\"required\":\"false\",\"size\":\"6\",\"opciones\":[{\"acta 1\":\"acta 1\"},{\"acta 2\":\"acta 2\"}]}","campo_id":2,"agrupacion_id":463,"orden_agrupacion":1,"orden":2,"nombre_agrupacion":"GRUPO CAMPOS","alias":"f_2","disabled":false,"mensajes":[{"tipo":"required","mensajeStr":"El campo acta es requerido"}],"valido":false},{"relationship":2376,"tipo":"checkbox","nombre":"Valor ISAI","caracteristicas":"{\"required\":\"true\",\"size\":\"6\",\"opciones\":[],\"etiqueta\":\"Valor A\"}","campo_id":11,"agrupacion_id":463,"orden_agrupacion":1,"orden":3,"nombre_agrupacion":"GRUPO CAMPOS","alias":"f_11","disabled":false},{"relationship":2375,"tipo":"input","nombre":"Oficio","caracteristicas":"{\"required\":\"false\",\"size\":\"6\"}","campo_id":3,"agrupacion_id":463,"orden_agrupacion":1,"orden":4,"nombre_agrupacion":"GRUPO CAMPOS","alias":"f_3","disabled":false,"mensajes":[],"valido":true},{"relationship":2379,"tipo":"select","nombre":"Apellido paterno","caracteristicas":"{\"required\":\"false\",\"size\":\"6\",\"opciones\":[{\"Opcion 01\":\"Opcion 01\"},{\"Opcion 02\":\"Opcion 02\"},{\"12\":\"eti1\"}],\"etiqueta\":\"otra etiqueta\",\"et1\":\"de\"}","campo_id":6,"agrupacion_id":463,"orden_agrupacion":1,"orden":5,"nombre_agrupacion":"GRUPO CAMPOS","alias":"f_6","disabled":false,"mensajes":[],"valido":true},{"relationship":2380,"tipo":"input","nombre":"Cantidad a cargo","caracteristicas":"{\"required\":\"false\",\"formato\":\"moneda\"}","campo_id":466,"agrupacion_id":463,"orden_agrupacion":1,"orden":6,"nombre_agrupacion":"GRUPO CAMPOS","alias":"valor_operacion","disabled":false,"mensajes":[],"valido":true,"valor":"MX$0"},{"relationship":2382,"tipo":"textbox","nombre":"IFE","caracteristicas":"{\"required\":\"false\"}","campo_id":26,"agrupacion_id":463,"orden_agrupacion":1,"orden":7,"nombre_agrupacion":"GRUPO CAMPOS","alias":"f_26","disabled":false,"mensajes":[{"tipo":"required","mensajeStr":"El campo ife es requerido"}],"valido":false}],"orden_agrupacion":1}]
    const estado = {clave:19, nombre: "NUEVO LEÓN"}
    const errors = {}
    const showMensajes =false
    const files =[]
    const file = null
    const consulta_api = ''
    const panel = ref([0,1,2,3,4])
    const disabled = []
    const ajax = null
    const response = []
    const fields = ref([])
    const rows =[]
    const loading = false
    const infoExtra = {}
    const tieneSeccionDocumentos = false
    const updateListadoExpedientes =0
    const refrescar =  ref(true)
    const montoOperacion =0
    const updates =[]
    const {tramite} = toRefs(props)
    const {tipoTramite} = toRefs(props)

    const updateForm = async (campo) => {
        const tramite = localStorage.getItem('tramite') && JSON.parse(localStorage.getItem('tramite')) ;

        if (tramite && tramite.tramite === 'AVISO DE ENAJENACIÓN') {
            fields.value = ['Expediente Catastral' ,	'Fólio', 	'Días Restantes', 	'Fecha pago informativo',	'Capturista',	'Accion'];
            var self = this;
                let url = process.env.TESORERIA_HOSTNAME + "/valor-catastral-notaria/6" // + self.notary;  
                $.ajax({
                    type: "GET",
                    dataType: 'json', 
                    url,
                    success:function(data){
                        let rows = [];
                        for (let index = 0; index < data.length; index++) {
                            let row = [];
                            data[index]
                            self.rows.push(data[index].campos) ; 
                            // console.log(self.rows);
                        }
                        self.rows = data;
                    },
                    error:function(error){
                        console.log('error');
                    },
                    complete:function(){
                    }
                });
        }

        const datosFormulario = localStorage.getItem('datosFormulario') && JSON.parse(localStorage.getItem('datosFormulario')) ;
        if(campo.nombre.search(/region/i) >= 0){
            const value = campo.valor && campo.valor.toString();
            if(value && value.length == 3 && value[0] === '0')
                campo.valor = value.slice(1)
        }
        if(tramite && tramite.tramite === 'INFORMATIVO VALOR CATASTRAL'){
            const datosFormulario = localStorage.getItem('datosFormulario') && JSON.parse(localStorage.getItem('datosFormulario')) ;
            if(campo.nombre.search(/region/i) >= 0){
                const value = campo.valor && campo.valor.toString();
                if(value && value.length == 3 && value[0] === '0')
                    campo.valor = value.slice(1)
            }

            if(campo.nombre.search(/tipo de busqueda/i) >= 0){
                fields.value = [ 'Expediente Catastral', 'Municipio', 'Tipo de predio', 'Tipo de Construcción', 'Propietarios' ];
                if(campo.valor){
                    switch(campo.valor.toString()){
                        case 'individual':
                            panel = [0, 1];
                            disabled = [2,3];
                        break;
                        case 'rango':
                            panel = [0, 2];
                            disabled = [1,3];
                        break;
                        case 'grupal':
                            panel = [0, 3];
                            disabled = [1,2];
                        break;
                        default:
                            panel = [0];
                        break;
                    }
                }
            }

            switch(campo.nombre_agrupacion){
                case 'Individual':
                    await processIndividual({campo, tramite, datosFormulario})
                break;
                case 'Rango':
                    await processRango({campo, tramite, datosFormulario})
                break;
                case 'Grupal':
                    panel = [0, 3];
                break;
            }
        }

        if(campo.tipo == 'file' && campo.valido){
            let nuevoFile = {valor:campo.valor, nombre:campo.nombre, id:campo.campo_id, nombrreFile:campo.valor ? campo.valor.name : ''};
            let indexArchivoEnLista = files.findIndex( file => file.id == campo.campo_id );
            if(indexArchivoEnLista>=0){
                files[indexArchivoEnLista] = nuevoFile;
            } else {
                files.push( nuevoFile);
            }
            emit('updatingFiles', files);
        }

        if(campo.nombre == 'Estado' && campo.valido){
            gestionarCambioEstado(campo.valor);
        }

        listenCampos( campo );	
        cambioModelo();
    }

    const cambioModelo = () => {
        let formvALID = validarFormulario();
        let datosFormulario = { 		
            tramite: tramite,
            campos: campos,
            //tipoPersona:this.tipoPersona,//quitar?
            consulta_api: consulta_api,
            formularioValido:formvALID,
            //tipo_costo_obj:this.tipo_costo_obj,
            tipoTramite: tipoTramite
        }
        localStorage.setItem('datosFormulario', JSON.stringify(datosFormulario)); 
    }

    const listenCampos =(campo) => {

        let self = this;
    //todo
    // eventosCtrl.setCampos(this.campos);
        if(campo.nombre == 'Motivo y Fundamento Legal' ){

            let ocultarCampoOtro = !campo.valor || campo.valor.clave != 'Otro';

            this.campos.map( campoItem => {
                if(campoItem.nombre == 'Otro (especificar):'){
                    campoItem.ocultar = ocultarCampoOtro;
                    let caracteristicas = JSON.parse(campoItem.caracteristicas + '');
                    caracteristicas.required =  !ocultarCampoOtro;
                    campoItem.valor = campo.valido && !ocultarCampoOtro ? campoItem.valor : "";
                    campoItem.valido = ocultarCampoOtro; 
                    campoItem.caracteristicas = JSON.stringify(caracteristicas);
                }
                return campoItem;
            });
        }  	else if( campo.tipo === 'expedientes' ){
            this.updateListadoExpedientes = this.updateListadoExpedientes + 1;
        } else if( campo.nombre === 'Monto total de operación (reportado en el aviso de enajenación)' ){
            this.montoOperacion = campo.valor;
        } else if( campo.nombre === '¿Consigna valor?'){
            let campoOcultar = null;
            let campoCantidadLote = this.campos.find( campoItem => campoItem.nombre == 'Cantidad de lotes' );
            let campoHoja = this.campos.find( campoItem => campoItem.nombre == 'Hoja' );
            let campoValorOperacion = this.campos.find( campoItem => campoItem.nombre == 'Valor de operacion' );

            if(campoCantidadLote){
                campoOcultar = campoCantidadLote;
            } else if(campoHoja){
                campoOcultar = campoHoja;
            }
            if( campo && campo.valor ){
                let siEsSI =  campo.valor == "si";
                let siEsNO =  campo.valor == "no";	

                if( siEsSI ){
                    eventosCtrl.ocultarCampo( campoValorOperacion, false, campo.valido); 
                    eventosCtrl.ocultarCampo( campoOcultar, true, campo.valido && !campoOcultar.valor);  
                } else if( siEsNO ){
                    eventosCtrl.ocultarCampo( campoValorOperacion, true, false); 
                    eventosCtrl.ocultarCampo( campoOcultar, false, (campo.valido && campoOcultar.valor));  
                }
                this.refrescarThisCampos([campoOcultar, campoValorOperacion]);
            } else {
                eventosCtrl.ocultarCampo( campoOcultar, true, campo.valido && !campoOcultar.valor); 
                eventosCtrl.ocultarCampo( campoValorOperacion, true, false); 
            }

        }

        instance?.proxy?.$forceUpdate();

    }

    const validarFormulario = ( ) => {
        let formularioValido = true;

        let camposValidables = [];
        agrupaciones.forEach( agrupacion =>{
            camposValidables = camposValidables.concat( agrupacion.campos );
            return agrupacion;
        });
        camposValidables.forEach( (campo, indice) => {
            // if(!campo.valido){
            // 	console.log(campo.nombre);
            // 	console.log(formularioValido && !!campo.valido);
            // }
            formularioValido = formularioValido && !!campo.valido;
        });
        /*if(this.tipo_costo_obj && (this.tipo_costo_obj.tipoCostoRadio == 'hoja' || this.tipo_costo_obj.tipoCostoRadio == 'lote ' )){
            formularioValido = formularioValido && !!this.tipo_costo_obj.hojaInput;
        }*/
        emit('updatingScore', formularioValido);
        return formularioValido;
    }

    const actionTipoElemento =(campo) => {
        refrescar.value = false

        consultarInfo(campo)
        cambioModelo()
    }

    const refrescarBusqueda =(res) => {
        if(res.refresh){
            let campoFolio = this.campos.find( campoItem => campoItem.nombre == 'Folio' );
            let campoID = this.campos.find( campoItem => campoItem.nombre == 'Tramite ID' );
            campoFolio.disabled =  false;
            campoID.disabled = false;	
            panel = [0];
            cleanCampos(['Folio','Tramite ID']);
            refrescarThisCampos([campoFolio, campoID]);	
        }
    }

    const setColumnSize = (campo) => {
        const customSize = {
					1 : 'col-md-1 col-sm-1 col-xs-1',
					2 : 'col-md-2 col-sm-2 col-xs-2',
					3 : 'col-md-3 col-sm-3 col-xs-3',
					4 : 'col-md-4 col-sm-4 col-xs-4',
					5 : 'col-md-5 col-sm-5 col-xs-5',
					6 : 'col-md-6 col-sm-6 col-xs-6',
					7 : 'col-md-7 col-sm-7 col-xs-7',
					8 : 'col-md-8 col-sm-8 col-xs-8',
					9 : 'col-md-9 col-sm-9 col-xs-9',
					10 : 'col-md-10 col-sm-10 col-xs-10',
					11 : 'col-md-11 col-sm-11 col-xs-11',
					12 : 'col-md-12 col-sm-12 col-xs-12',
        }
        const defaultSize = 'col-md-6 col-sm-6 col-xs-6'
        let classColumn;

        if(JSON.parse(campo.caracteristicas).size){
            classColumn = customSize[JSON.parse(campo.caracteristicas).size] || defaultSize
        }else{
            campo.nombre == '¿Consigna valor?' || ['file', 'results', 'question','enajenante','expedientes', 'valuador'].includes(campo.tipo) ?  classColumn = 'col-md-12 col-sm-12 col-xs-12' : classColumn = 'col-md-6 col-sm-6 col-xs-6'
        }
        
        return classColumn
    }

</script>

<template>
  <div id="contenedorCampos" class="container-fluid">
        1
		<div class="text-center" id="loadin" style=" margin-bottom: 9px;" v-if="!mostrar" >
            2
			<div class="spinner-grow" role="status">
			  	<span class="sr-only">Loading...</span>
			</div>
		</div>
		<div class="" v-if="mostrar">
            3
			<form id="formularioDinamico">
				<div class="panel panel-default" >
 					<div class="panel-heading">
 						<div class="row" >			
							<v-expansion-panels variant="accordion" multiple  style="z-index: inherit" v-model="panel"  class="accordion caja_acordeon">
							    <v-expansion-panel v-for="(agrupacion, i) in agrupaciones"  style="margin-top:10px" :key="i"  :value="i" close :disabled=" disabled.includes(i)" class="accordion-item" >
							      	<v-expansion-panel-title class="accordion-header accordion-button">
                                        {{ agrupacion.nombre_agrupacion }}
                                    </v-expansion-panel-title>
							      	<v-expansion-panel-text v-if="refrescar" class="accordion-body">
										<div class="row align-items-center">
                                            <!-- v-if="!campo.ocultar" -->
			 								<div v-for="(campo, j) in agrupacion.campos" :key="j" :class="setColumnSize(campo)">
												
												<label class="form-label" v-if="campo.tipo != 'expedientes' && campo.tipo != 'enajenante' && campo.tipo != 'file' && campo.tipo != 'valuador' " >
													{{ JSON.parse(campo.caracteristicas).etiqueta ? JSON.parse(campo.caracteristicas).etiqueta : campo.nombre }}  {{JSON.parse(campo.caracteristicas + '').required == 'true' ? '*' : '' }}
												</label>
												<Input
													v-if="campo.tipo === 'input'" 
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm" 
													@actionTipoElemento="actionTipoElemento"
													@refrescarBusqueda="refrescarBusqueda"
													:updateIt="updates[campo.campo_id + '-' + campo.relationship ]" 
                                                />
												<Number
													v-if="campo.tipo === 'numeric'" 
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm" 
													@actionTipoElemento="actionTipoElemento"
													@refrescarBusqueda="refrescarBusqueda"
													:updateIt="updates[campo.campo_id + '-' + campo.relationship ]" 
                                                />
												<Select
													v-else-if="campo.tipo === 'select' || campo.tipo === 'multiple'" 
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm"
													v-on:estadoSelected="estadoSelected($event)"
													:estado="estado"
                                                />
												<Radio 
													v-else-if="campo.tipo === 'option'"
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm" 
													:updateIt="updates[campo.campo_id + '-' + campo.relationship ]"
                                                />
												<Textbox
													v-else-if="campo.tipo === 'textbox' && (!campo.condition || campo.condition.view(agrupaciones))"
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm"
                                                />
												<Checkbox 
													v-else-if="campo.tipo === 'checkbox'"
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm"
                                                />
												<File
													v-else-if="campo.tipo == 'file' && JSON.parse(campo.caracteristicas).tipo != 'expediente_validacion_excel'"
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													:tipoTramite="tipoTramite"
													@updateForm="updateForm" :files="filesPrecargados"
													@validarFormulario="validarFormulario"
												/>
												<Results 
													v-else-if="campo.tipo === 'results'"
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm"
													:info="response"
													:fields="fields"
													:rows="rows"
													:loading="loading"
													:infoExtra="infoExtra"
													v-on:expedienteSeleccionado="updateExpedienteSeleccionado($event)"
											    />
												<ExpedienteExcel  
													v-else-if="JSON.parse(campo.caracteristicas).tipo == 'expediente_validacion_excel'"
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm" :files="files"
													@validarFormulario="validarFormulario"
													@processGrupal="processGrupal"
												/>
												 <Enajenantes
                                                     v-else-if="campo.tipo == 'enajenante'" 
												    :campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm" :configCostos="configCostos" :updateListadoExpedientes="updateListadoExpedientes" 
                                                />	
												<Table 
													:propietario="JSON.parse(campo.caracteristicas).propietario"
													:campo="campo"
													:expediente="expediente"
													v-on:porcentaje="updatePorcentaje($event)"
													:porcentajeFinal="progress"
													@updateForm="updateForm"
													v-else-if="campo.tipo == 'table'"
                                                />
												<Fecha v-if="campo.tipo === 'date'" 
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm"
                                                />
												<ListadoExpedientes5isr 
													v-else-if="campo.tipo === 'expedientes'"
													:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm" :usuario="usuario"
                                                />
			 									<Valuador v-if="campo.tipo === 'valuador'" 
			 										:campo="campo" 
													:showMensajes="showMensajes" 
													:estadoFormulario="comprobarEstadoFormularioCount"
													@updateForm="updateForm"
                                                />
			 								</div>
		 									<div v-if="agrupacion.tieneSeccionDocumentos" class="col-md-12 col-lg-12">
		 										<div class="text-left">
													<strong>Nota:</strong>
													<small class="">
														De no anexar el documento obligatorio, no podrá Imprimir su declaración fiscal, mismo que podra ser requerido por la Autoridad.
													</small>
												</div>
											</div>
										</div>
							      	</v-expansion-panel-text>
							      	<v-expansion-panel-text v-if="!refrescar">
							      		<div class="text-center" id="loadin" style=" margin-bottom: 9px;" >
											<div class="spinner-grow" role="status" style="width: 0.6rem; height: 0.6rem;" v-for="n in [1,2,3,4,5,6]">
												<span class="sr-only">Loading...</span>
											</div>
										</div>
							      	</v-expansion-panel-text>	
							    </v-expansion-panel>
							</v-expansion-panels>
 						</div>
 					</div>
 				</div>
			</form>
		</div>
    </div>
</template>

