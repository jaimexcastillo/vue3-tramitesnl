
<script setup>
import { onMounted, ref, watch } from "vue"


    const props = defineProps(['propietario', 'expediente', 'campo', 'porcentajeFinal'])
    const emit = defineEmits(["updateForm"])

    const campos =  ref([{"registros": []}])
    const modalx = ref({
                persona: '',
                tipoPropietario: '',
                porcentajePropiedad: '',
                unsufructo: '',
                porcentajeVenta: '',
                rfc: '',
                nacionalidad: '',
                curp: '',
                curpExist: '',
                country: '' ,
                fechaNac: '',
                nombre: '',
                apellidoP: '',
                apellidoM: '',
                razonS: '',
                sexo: '',
                EstadoNac: ''
    })
    const helper = ref('')
    const progress = ref(0)
    const rowSelected = ref('')
    const access_token = ref('')
    const mensajeRequerido = ref(' es requerido')
    const validado = ref('')


    const editar = (key , registro) => {
        $( '#' + this.propietario).modal();
        helper = 1;
        rowSelected = key;
        modalx.nacionalidad = registro.nacionalidad;
        modalx.tipoPropietario = registro.tipoPro;
        modalx.persona = registro.clasePro;
        modalx.porcentajePropiedad = registro.nuda;
        modalx.porcentajeVenta = registro.porcentajeVenta;
        modalx.curp = registro.id_propietario;
        modalx.nombre = registro.nombrePro;
        modalx.rfc = registro.rfc;
    }

    const add = () => {
        $( '#' + propietario).modal();
        helper  = 0 ;
        cleanModal();
    }

    const saveNew =() => {
        validateModal();
        if (propietario == 1) {
            if(validado == true){
                    let porcentajeProp = modalx.porcentajePropiedad/100;
                    let aux =  progress + (modalx.porcentajeVenta * porcentajeProp);
                if(  aux <= 100 ){
                    campos[0].registros.push({clasePro: modalx.persona, tipoPro: modalx.tipoPropietario, porcentajeVenta: modalx.porcentajeVenta, nuda: modalx.porcentajePropiedad, unsufructo:  modalx.unsufructo = true ? 'si': 'no', razonS: modalx.razonS, id_propietario: modalx.rfc })
                    progress = aux;
                    $( '#' +  this.propietario).modal('hide');
                    this.cleanModal();
                }else{
                    alert('el porcentaje de venta no puede ser mayor a 100')
                }

            }else{
                alert('campos pendientes de llenado')
            };
            
        }else{
            if(validado == true){
                    let porcentajeProp = modalx.porcentajePropiedad/100;
                    let aux =  progress + (modalx.porcentajeVenta * porcentajeProp);
                if(  aux <= porcentajeFinal ){
                    campos[0].registros.push({clasePro: modalx.persona, tipoPro: modalx.tipoPropietario, porcentajeVenta: modalx.porcentajeVenta, nuda: modalx.porcentajePropiedad, unsufructo:  modalx.unsufructo = true ? 'si': 'no', razonS: modalx.razonS, id_propietario: modalx.rfc })
                    progress = aux;
                    $( '#' + propietario).modal('hide');
                    cleanModal();
                }else{
                    alert('el porcentaje de compra no puede ser mayor al de compra - ' ,this.porcentajeFinal )
                }

            }else{
                alert('campos pendientes de llenado')
            };
            
            
        }
    }

    const saveEdit = () => {
        
        let porcentajeProp = modalx.porcentajePropiedad/100;
        progress == 0 ? progress  : progress =  (progress -  parseInt(campos[0].registros[this.rowSelected].porcentajeVenta));

        let aux =  parseInt(progress) + (parseInt(modalx.porcentajeVenta) * porcentajeProp);
        validateModal();
        if(validado == true){

            if(  ( aux ) <= 100 ){
                campos[0].registros[this.rowSelected] =     {  clasePro: modalx.persona, 
                                                                porcentajeVenta: modalx.porcentajeVenta, 
                                                                nuda: modalx.porcentajePropiedad, 
                                                                unsufructo:  modalx.unsufructo = true ? 'si': 'no',
                                                                nacionalidad: modalx.nacionalidad , 
                                                                nombrePro: modalx.nombre,  
                                                                tipoPro: modalx.tipoPropietario , 
                                                                rfc: modalx.rfc, 
                                                                curp: modalx.curp , 
                }    
                progress = progress + aux;
                $( '#' +  propietario).modal('hide');
            }else{
                alert('el porcentaje de venta no puede ser mayor a 100')
            };

        }else{
            alert('campos pendientes de llenado')
        }

    }


    const validateModal = () =>{
            var parent = document.getElementById(propietario);
            var child = document.querySelector('.validate');
            if(parent.contains(child)){
                validado = false;
            }else{
                validado =  true;
            }
    }

    const cleanModal = () => {
        modalx.nacionalidad = '';
        modalx.tipoPropietario = '';
        modalx.persona = '';
        modalx.porcentajePropiedad = '';
        modalx.porcentajeVenta = '';
        modalx.curp = '';
        modalx.nombre = '';
        modalx.sexo = '';
    }

    const rellenarForm = (data) =>{
        modalx.nombre = data.data.nombres;
        modalx.apellidoP = data.data.apePat;
        modalx.apellidoM = data.data.apeMat;
        modalx.fechaNac = data.data.fechaNac;
        modalx.sexo = data.data.sexo;
    }

    const accesToken = () => {
        var self = this;
        let url = "https://insumos.nl.gob.mx/api/auth" ;  
        var data = { 'username' : 'fun1' , 'password': 'prueba123' };
        $.ajax({
            type: "POST",
            data: data,
            dataType: 'json', 
            url,
            success:function(data){
                self.access_token = data.token;
            },
            error:function(error){
                console.log(error);
            },
            complete:function(){
                console.log('accestoken generado');
            }
        });
    }

    const  buscarCurp = (curp)=> {
        var self = this;
        let url = "https://insumos.nl.gob.mx/api/consultacurp" ;  
        // let url = process.env.TESORERIA_HOSTNAME + "/insumos-catastro-consulta/7090036008";  
        var data = { 'access_token' : self.access_token , 'curp' : curp  };
        $.ajax({
            type: "GET",
            data: data,
            dataType: 'json', 
            url,
            success:function(data){
                self.rellenarForm(data);
                // this.$data = data.data.nombres;
            },
            error:function(error){
                console.log(error);
            },
            complete:function(){
                console.log('.');
            }
        });
    }

    const Vendedores =() => {
        let url = process.env.TESORERIA_HOSTNAME + "/insumos-catastro-consulta/" + expediente;  
        if (propietario == 1) {
            
            $.ajax({
                type: "GET",
                url,
                headers: {
                    "Authorization":"Bearer " + process.env.PAYMENTS_KEY,
                    "Content-type":"application/json"
                }
            }).done((response) => {
                if(response) {   
                    response = JSON.parse( response)
                    this.campos[0].registros = response.datos_propietarios;
                } else {
                    alert('error en la busqueda de propietarios');
                }
            }).fail((error)=> {
                console.log( error)
            })
        }
    }
    const updateForm = () =>{
        campo.valido = true;
        emit('updateForm', campo);
    }

    onMounted(()=>{
        accesToken()
        campo.valor.valido = true
    })

    watch( ()=> progress ,() => {   
        if (progress != 0 && this.propietario == 1) {
            campo.valido = true;
            emit('updateForm', campo);
            emit('porcentaje', progress)
        }else{
            campo.valido = false;
            emit('updateForm', campo);
        }
    })

    watch( ()=> expediente ,() => {   
        let url = process.env.TESORERIA_HOSTNAME + "/insumos-catastro-consulta/" + expediente;  
        if (propietario == 1) {
            
            $.ajax({
                type: "GET",
                url,
                headers: {
                    "Authorization":"Bearer " + process.env.PAYMENTS_KEY,
                    "Content-type":"application/json"
                }
            }).done((response) => {
                if(response) {   
                    response = JSON.parse( response)
                    campos[0].registros = response.datos_propietarios;
                } else {
                    alert('error en la busqueda de propietarios');
                }
            }).fail((error)=> {
                console.log(error)
            })
        }
    })

</script>


<template>
   <div class="col-md-6 col-sm-6 col-xs-6 col-md-12 col-sm-12 col-xs-12">
    <div   class="form-group fv-plugins-icon-container">

        <div class="alert text-center" role="alert" style="background-color:#e1f5fe !important; border-color:#e1f5fe;">
            Expediente Catastral : {{expediente}}
        </div>
        <div class="alert alert-dismissible p-8" role="alert" style="background-color:#fbe3e4 !important ; border-color:#fbe3e4l ; color:red">
            Informacion! los siguientes detalles deben de tomarse en cuenta
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <li class="pl-6" style="color:red">Debe de existir un porcentaje de venta</li>
        </div>

        <div class="progress " style="height: 17px;">
            <div class="progress-bar" role="progressbar" :style=" 'width: ' + progress + '%'"  :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">{{progress}}%</div>
        </div>

        <label>{{ campos.nombre }}</label>
        <table class="table  table-striped">
            <thead style="border-bottom: solid;">
                <tr>
                    <th>
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
                            % Propiedad 
                    </th>
                    <th>
                            Unsufructo 
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
                <tr  v-for="(registro, key) in campos[0].registros"  :key="registro.rfc" >
                    <td>
                        {{registro.clasePro}}
                    </td>	
                    <td>
                        {{registro.nombrePro}}	{{registro.apePat}} {{registro.apeMat}} {{registro.razonS}}
                    </td>	
                    <td>
                        {{registro.rfc}}
                        {{registro.id_propietario}}
                    </td>	
                    <td>
                        {{registro.curp}}
                    </td>	
                    <td>
                        {{registro.nuda}}
                    </td>	
                    <td>
                        {{registro.usufructo}}
                    </td>	
                    <td>
                        {{registro.porcentajeVenta}}
                    </td>	
                    <td>
                        <button type="button" @click="editar(key, registro)"  class="text-center p-2 btn btn-info eddit" ><i class="la la-pencil-alt"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="propietario == 1 && progress < 100" class="btn bg-success w-80 mb-4 " @click="add()">
                <div style="color:white"><i class="la la-plus" style="color:white"></i> Agregar vendedor </div>	
        </div>
        <div  v-if="propietario == 0  && progress < 100" class="btn bg-success w-80 mb-4 " @click="add()">
                <div style="color:white"><i class="la la-plus" style="color:white"></i> Agregar comprador </div>	
        </div>
        <div class="progress" style="height: 3px;">
            <div class="progress-bar " role="progressbar" :style=" 'width: ' + progress + '%'" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    </div>

    <!-- <code> {{campos}} </code> -->
        <div class="modal fade" :id="propietario" :class="propietario" role="dialog">
            <div class="modal-dialog">
            
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title left" v-if="helper==1">Editar</h4>
                    <h4 class="modal-title left" v-if="helper==0">Agregar</h4>
                </div>
                <div class="modal-body">
                    <form action="" id="newModalForm">
                        <p>Seleccione una nacionalidad</p>
                        <div class="form-check form-check-inline pb-4">
                            <input class="form-check-input" type="radio" id="Extranjero" name="nacionalidad" value="Extranjero"  v-model="modalx.nacionalidad">
                            <label class="form-check-label">Extranjero</label><br>
                            <input class="form-check-input ml-6" type="radio" id="Mexicano" name="nacionalidad" value="Mexicano"  v-model="modalx.nacionalidad">
                            <label class="form-check-label" for="other">Mexicano</label>	
                        </div>
                        <small v-if="!modalx.nacionalidad">
                            <span class="form-text text-danger validate" >  
                                Nacionalidad: {{mensajeRequerido}}
                            </span>
                        </small>
                        <div v-if="modalx.nacionalidad == 'Mexicano'">
                            <p>Seleccione el tipo de persona</p>
                            <div class="form-check form-check-inline pb-4">
                                <input class="form-check-input" type="radio" id="FÍSICA" name="persona" value="PERSONA FÍSICA"  v-model="modalx.persona">
                                <label class="form-check-label">Fisica</label><br>
                                <input class="form-check-input ml-6" type="radio" id="Moral" name="persona" value="PERSONA MORAL"  v-model="modalx.persona">
                                <label class="form-check-label" for="other">Moral</label>	
                            </div>
                            <small v-if="!modalx.persona">
                                <span class="form-text text-danger validate" >  
                                  Tipo de persona {{mensajeRequerido}}
                                </span>
                            </small>
                        </div>
                        <div class="col" >
                            <label for="">Tipo de propietario</label>
                            <select v-model="modalx.tipoPropietario" class="row form-control">
                                <option  selected disabled value="0">Seleccione</option>
                                <option value="PROPIETARIO">Propietario</option>
                                <option value="Nuda Propiedad">Nuda Propiedad</option>
                                <option value="Unsufructuario">Unsufructuario</option>
                                <option value="Copropietario">Copropietario</option>
                            </select>
                             <small v-if="!modalx.tipoPropietario">
                                <span class="form-text text-danger validate" >  
                                  Tipo de propietario: {{mensajeRequerido}}
                                </span>
                            </small>
                        </div>
                        
                        <div v-if="modalx.nacionalidad== 'Extranjero'">
                            <div class=" form-group row">
                                <div class="col">
                                    <label for="">Nombre(s):</label>
                                    <input v-model="modalx.nombre" type="text" class="form-control">
                                    <small v-if="!modalx.nombre">
                                        <span class="form-text text-danger validate" >  
                                        Nombre: {{mensajeRequerido}}
                                        </span>
                                    </small>
                                </div>
                                <div class="col">
                                    <label for="">Apellido Paterno:</label>
                                    <input v-model="modalx.apellidoP" type="text" class="form-control">
                                    <small v-if="!modalx.apellidoP">
                                        <span class="form-text text-danger validate" >  
                                        Apellido Paterno: {{mensajeRequerido}}
                                        </span>
                                    </small>
                                </div>
                            </div>
                            <div class=" form-group row">
                                <div class="col">
                                    <label for="">Apellido Materno:</label>
                                    <input v-model="modalx.apellidoM" type="text" class="form-control">
                                    <small v-if="!modalx.apellidoM">
                                        <span class="form-text text-danger validate" >  
                                        Apellido Materno: {{mensajeRequerido}}
                                        </span>
                                    </small>
                                </div>
                                <div class="col">
                                    <label for="">Fecha de Nacimiento:</label>
                                    <input v-model="modalx.fechaNac" type="text" class="form-control">
                                    <small v-if="!modalx.fechaNac">
                                        <span class="form-text text-danger validate" >  
                                        Fecha de nacimiento: {{mensajeRequerido}}
                                        </span>
                                    </small>
                                </div>
                            </div>
                            <div class="col">
                                <label  class="form-check-label " for="">País de nacimiento:</label>
                                    <select v-model="modalx.country" class="row form-control">
                                    <option  selected disabled value="0">Seleccione</option>
                                    <option value="USA">Estados Unidos </option>
                                    <option value="Canada">Canada</option>
                                </select>
                                <small v-if="!modalx.country">
                                        <span class="form-text text-danger validate">  
                                        Pais: {{mensajeRequerido}}
                                        </span>
                                </small>
                            </div>
                        </div>

                        <div v-if="modalx.persona== 'PERSONA FÍSICA'">

                            <p> ¿Cuenta con el curp?</p>
                            <div class="form-check form-check-inline pb-4">
                                <input class="form-check-input" type="radio" id="Si" name="nacionalidad" value="Si"  v-model="modalx.curpExist">
                                <label class="form-check-label">Si</label><br>
                                <input class="form-check-input ml-6" type="radio" id="No" name="nacionalidad" value="No"  v-model="modalx.curpExist">
                                <label class="form-check-label" for="other">No</label>	
                            </div>
                                <small v-if="!modalx.curpExist">
                                        <span class="form-text text-danger validate" >  
                                        Campo requerido
                                        </span>
                                </small>
                            <div v-if="modalx.curpExist != ''">  
                                <div class=" form-group row">
                                    <div class="col">
                                        <label for="">Curp:</label>
                                        <input v-model="modalx.curp" :disabled="modalx.curpExist == 'No'" @blur='buscarCurp(modalx.curp)' type="text" class="form-control">
                                        <small v-if="!modalx.curp && modalx.curpExist != 'No'"> 
                                            <span class="form-text text-danger validate" :id="[[modalx.curp]]">  
                                            Curp {{mensajeRequerido}}
                                            </span>
                                        </small>
                                    </div>
                                    <div class="col">
                                        <label for="">RFC:</label>
                                        <input v-model="modalx.rfc" type="text" class="form-control">
                                        <small v-if="!modalx.rfc">
                                            <span class="form-text text-danger validate" :id="[[modalx.rfc]]">  
                                            Rfc {{mensajeRequerido}}
                                            </span>
                                        </small>
                                    </div>
                                </div>
                                <div class=" form-group row">
                                    <div class="col">
                                        <label for="">Nombre(s):</label>
                                        <input v-model="modalx.nombre" :disabled="modalx.curpExist == 'Si'" type="text" class="form-control">
                                        <small v-if="!modalx.nombre">
                                            <span class="form-text text-danger validate" :id="[[modalx.nombre]]">  
                                            Nombre {{mensajeRequerido}}
                                            </span>
                                        </small>
                                    </div>
                                    <div class="col">
                                        <label for="">Apellido Paterno:</label>
                                        <input v-model="modalx.apellidoP" :disabled="modalx.curpExist == 'Si'" type="text" class="form-control">
                                        <small v-if="!modalx.apellidoP  && modalx.curpExist != 'Si'">
                                                <span class="form-text text-danger validate" :id="[[modalx.apellidoP]]">  
                                                Apellido Paterno {{mensajeRequerido}}
                                                </span>
                                        </small>
                                    </div>
                                </div>
                                <div class=" form-group row">
                                    <div class="col">
                                        <label for="">Apellido Materno:</label>
                                        <input v-model="modalx.apellidoM" :disabled="modalx.curpExist == 'Si'" type="text" class="form-control">
                                        <small v-if="!modalx.apellidoM  && modalx.curpExist != 'Si'">
                                            <span class="form-text text-danger validate" :id="[[modalx.apellidoM]]">  
                                            Apellido Materno {{mensajeRequerido}}
                                            </span>
                                        </small>
                                    </div>
                                    <div class="col">
                                        <label for="">Fecha de Nacimiento:</label>
                                        <input v-model="modalx.fechaNac" :disabled="modalx.curpExist == 'Si'" type="text" class="form-control">
                                        <small v-if="!modalx.fechaNac  && modalx.curpExist != 'Si'">
                                            <span class="form-text text-danger validate" :id="[[modalx.fechaNac]]">  
                                            Fecha nacimiento {{mensajeRequerido}}
                                            </span>
                                        </small>
                                    </div>
                                </div>
                            
                                <div class=" form-group row">
                                    <div class="col">
                                        <label for="">Genero:</label>
                                        <input v-model="modalx.sexo"  :disabled="modalx.curpExist == 'Si'" type="text" class="form-control">
                                        <small v-if="!modalx.sexo  && modalx.curpExist != 'Si'">
                                            <span class="form-text text-danger validate" :id="[[modalx.sexo]]">  
                                            Genero {{mensajeRequerido}}
                                            </span>
                                        </small>
                                    </div>
                                    <div class="col">
                                        <label for="">Estado de Nacimiento:</label>
                                        <input type="text" v-model="modalx.EstadoNac" :disabled="modalx.curpExist == 'Si'" class="form-control">
                                        <small v-if="!modalx.EstadoNac  && modalx.curpExist != 'Si'">
                                            <span class="form-text text-danger validate" :id="[[modalx.EstadoNac]]">  
                                            Estado de Nacimiento {{mensajeRequerido}}
                                            </span>
                                        </small>
                                    </div>
                                </div>
                            </div>    
                           
                        </div>

                        <div v-if="modalx.persona== 'PERSONA MORAL'">
                            <div class=" form-group row">
                                <div class="col">
                                    <label for="">RFC:</label>
                                    <input v-model="modalx.rfc" type="text" class="form-control" required>
                                    <small v-if="!modalx.rfc">
                                        <span class="form-text text-danger validate" :id="[[modalx.rfc]]">  
                                        Rfc {{mensajeRequerido}}
                                        </span>
                                    </small>
                                </div>
                                <div class="col">
                                    <label for="">Razon Social:</label>
                                    <input v-model="modalx.razonS" type="text" class="form-control">
                                    <small v-if="!modalx.razonS">
                                        <span class="form-text text-danger validate" :id="[[modalx.razonS]]">  
                                        Razon social {{mensajeRequerido}}
                                        </span>
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col">
                                <label for="">Porcentaje de propiedad</label>
                                <input v-model="modalx.porcentajePropiedad" class="form-control" type="number" name="porcentaje" id="">
                                <small v-if="!modalx.porcentajePropiedad">
                                        <span class="form-text text-danger validate">  
                                        Porcentaje de propiedad {{mensajeRequerido}}
                                        </span>
                                </small>
                            </div>
                            <div class="col pt-8" >
                                <input v-model="modalx.unsufructo" class="form-check pt-8" style="margin-left:28%" type="checkbox" name="unsufructo" id="">
                                <label for="">Presentar unsufructo?</label>
                            </div>
                        </div>
                        <div class="col-6 form-group row">
                            <label for="">Porcentaje de venta</label>
                            <input v-model="modalx.porcentajeVenta" class="form-control" type="number" name="venta" id="">
                            <small v-if="!modalx.porcentajeVenta">
                                    <span class="form-text text-danger validate">  
                                    Porcentaje de venta {{mensajeRequerido}}
                                    </span>
                            </small>
                        </div>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem ipsum esse dignissimos, quas ab quia libero itaque enim aut repellendus molestias sunt totam hic. Nisi, eius cumque.</p>
                        <div class="dropdown-divider"></div>
                        <div class="text-center pt-8">
                            <h3>Direccion de notificacion en el estado</h3>
                            <h3>No obligatorio</h3>
                        </div>

                        <div class="col">
                            <label for=""> Correo </label>
                            <input type="email" class="row form-control ">
                        </div>
                        <div class=" form-group row">
                            <div class="col">
                                <label for="">Telefono fijo</label>
                                <input type="text" class="form-control">
                            </div>
                            <div class="col">
                                <label for="">Telefono de casa</label>
                                <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class=" form-group row">
                            <div class="col-6">
                                <label for="">Tipo de vialidad</label>
                                <input type="select" class="form-control">
                            </div>
                            <div class="col">
                                <label for="">Nombre de vialidad</label>
                                <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class=" form-group row">
                            <div class="col-4">
                                <label for="">No. Exterior</label>
                                <input type="text" class="form-control">
                            </div>
                            <div class="col-4">
                                <label for="">No. Interior</label>
                                <input type="text" class="form-control">
                            </div>
                            <div class="col-4">
                                <label for="">Codigo postal</label>
                                <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class=" form-group row">
                            <div class="col">
                                <label for="">Colonia</label>
                                <input type="text" class="form-control">
                            </div>
                            <div class="col">
                                <label for="">Municipio</label>
                                <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class="col">
                            <label for="">Referencia</label>
                            <input type="text" name="" id="" class="form-control">
                        </div>
                    </form>
                    
                </div>
                <div class="modal-footer row">
                    <button type="button" class="btn btn-danger" style="width: 48%;" data-dismiss="modal">Cancelar</button>
                    <button v-if="helper == 1" type="button" class="btn btn-primary" style="width: 48%;"   @click="saveEdit()">Guardar</button>
                    <button v-if="helper == 0" type="button" class="btn btn-primary" style="width: 48%;"   @click="saveNew()">Guardar</button>
                </div>
            </div>
            
            </div>
        </div>
    </div>
</template>
