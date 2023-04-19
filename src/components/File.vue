
<script setup>
import { onMounted, ref, toRefs, watch } from "vue"

    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes', 'files', 'tipoTramite'])
    const emit = defineEmits(['updateForm'])
    const {campo, files} = toRefs(props)
    const aceptSupported =  {pdf:'application/pdf', xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
    const accept = ref('')
    const obteniendoFile = ref(false)
    const arrurl = ref([])
    const changeFile = ref(false)

    onMounted(()=>{
        let promises = [];

        if(files.value && files.value.length > 0 && files.value[0].valor instanceof File){
          let idCampo = campo.value.campo_id;
          let relation = campo.value.relationship;
          let self = this;         
          setTimeout(function(){
            $("#"+ idCampo + '-' + relation + '-namefile' ).text(   self.files[0].valor.name  );
          }, 500);
        } else if(campo.value.nombreArchivoGuardado){
          arrurl.value = campo.value.nombreArchivoGuardado.split("/");
          let urlFile = campo.value.nombreArchivoGuardado;
          let urlAsArr = urlFile.split("/");
          promises.push(getFile( urlFile, urlAsArr[urlAsArr.length - 1] ,campo.value ));
          obteniendoFile.value = true;
          getAsyncFile(promises);
        } else {
          validar();
        }
    })

    const getFile = (url, nombreArchivo, campo) => {
      return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url,
            responseType: "blob",
            headers: {
          'nombreArchivo': nombreArchivo,
          campo_id: campo.campo_id + "-" + campo.relationship,
          campo_nombre:campo.nombre
        }
        })
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error.toString());
          });
      });
    }

    const getAsyncFile = () => {
        Promise.all(promises).then(( respuestas ) => {
            respuestas.forEach( (res) => {
                const blob = new Blob([res.data], { type: res.headers['content-type'] });
                var fileNew = new File([blob], res.config.headers.nombreArchivo , {
                  type: res.headers['content-type'], 
                  lastModified: Date.now()
                });

                let headers = res.config.headers;

                campo.value.valor = fileNew;
                campo.value.valido = true;
                // console.log('if', this.arrurl);
                // console.log('length', this.arrurl.length);
                let arrurl = campo.value.nombreArchivoGuardado.split("/");
                if(arrurl.length  > 0 ){
                  let idCampo = campo.value.campo_id;
                  let relation = campo.value.relationship;
                  let self = this;
                  setTimeout(function(){ 
                    $("#"+ idCampo + '-' + relation + '-namefile' ).text(  arrurl[arrurl.length - 1]);
                    self.obteniendoFile.value = false; 
                  },500);
                  
                } else {
                  $("#"+ campo.value.campo_id + '-' + campo.value.relationship + '-namefile' ).text(  "" );
                }
                this.$emit('updateForm', campo.value);

              })
            }).catch(errors => {
              obteniendoFile = false;
              $("#"+ campo.value.campo_id + '-' + campo.value.relationship + '-namefile' ).text(  "" );
        }).finally(() => {

        });
    }

    const changeFileEvt = (evt) => {
        evt.preventDefault();
        changeFile.value = true;
    }

    const definirAccept = () => {
        let caracteristicas = {};
        try {
            caracteristicas = JSON.parse(campo.value.caracteristicas + '');
        }catch(err){
            console.log(err);
        }
        if(caracteristicas.accept){
            accept.value =  aceptSupported.value[caracteristicas.accept];
        }
    }

    const updateFile = () => {
        campo.value.nombreArchivoGuardado = ''; //optional
        validar();
    }

    const validar = () => {
        let requeridoValido = false;
        let extensionvalida = true;
        let caracteristicas = {};
        var caracteristicasStr = campo.value.caracteristicas;
        campo.value.mensajes = [];
        
        try {
        caracteristicas = JSON.parse(campo.value.caracteristicas + '');
        }catch(err){
        console.log(err);
        }

        var fileInput = document.getElementById(campo.value.campo_id +  "-" + campo.value.relationship );

        if( fileInput && fileInput.files.length > 0  ){
        requeridoValido = true;
        $("#"+ campo.value.campo_id + '-' + campo.value.relationship + '-namefile' ).text(   fileInput.files[0].name  );
        } else {
        requeridoValido = false;
        }
        if(caracteristicas.hasOwnProperty('required') && caracteristicas.required !== 'true')
        requeridoValido = true;

        if( !requeridoValido ){
        let mensaje = { 
            tipo:'required',
            mensajeStr: "El archivo " + campo.value.nombre + " es requerido"
        }
        campo.value.mensajes.push( mensaje );
        } else{
        var fileInput =  document.getElementById(campo.value.campo_id +  "-" + campo.value.relationship );;
        let file = fileInput.files[0];
        campo.value.valor = file;
        }
        if(caracteristicas.accept){
        let extensionesPermitidas = caracteristicas.accept.split(",").map( ext =>{
            return ext;
        });
        if(campo.value.valor && !extensionesPermitidas.includes(fileInput.value.split(".")[1])){

            extensionvalida = false;
            fileInput.value = '';
            let mensaje = { 
                tipo:'required',
                mensajeStr: "Extension de archivo no permitida"
            }
            campo.value.mensajes.push( mensaje );
        }
        }
        // this.$forceUpdate();
        campo.value.valido =  requeridoValido && extensionvalida;
        emit('updateForm', campo.value);   
    }

    definirAccept();

    watch( ()=> props.campo ,async( newVal ) => {
        campo.value = newVal
    })

</script>

<template>
    <div class=" fv-plugins-icon-container">
        <div v-if="/complementaria/.test(tipoTramite) && this.campo.nombreArchivoGuardado && !changeFile" class="row">
            <div class="col">
                <p class="mb-1"><strong>¿Desea sustituir el archivo?</strong></p>
                <h4><i class="fas fa-file-upload"></i> {{ arrurl[arrurl.length - 1] }}</h4>
            </div>
            <div class="col text-right">
                <button class="btn btn-secondary" v-on:click="changeFileEvt"><i class="fas fa-file-upload"></i> Sustituir Archivo</button>
            </div>
        </div>
        <div :class="(!/complementaria/.test(tipoTramite) && this.campo.nombreArchivoGuardado) || !this.campo.nombreArchivoGuardado || changeFile ? '' : 'd-none'">
            <div class="input-group">
                <div class="input-group-prepend">
                <span class="input-group-text text-initial" id="inputGroupFileAddon01">
                    {{ campo.nombre }}  {{JSON.parse(this.campo.caracteristicas + '').required == 'true' ? '*' : '' }}
                    <span v-if="obteniendoFile"> 
                    <b-spinner small label="Small Spinner"></b-spinner>
                    </span>
                </span>
                </div>
                <div class="custom-file">
                <input  
                    :id="[[campo.campo_id]] + '-' + [[campo.relationship]]"
                    :name="[[campo.campo_id]] + '-' + [[campo.relationship]]" 
                    class="custom-file-input"  style="background-color: #e5f2f5 !important"
                    ref="fileInput"
                    type="file" @change="updateFile" :accept="accept" />
                <label class="custom-file-label" :for="[[campo.campo_id]] + '-' + [[campo.relationship]]">
                    <span :id="[[campo.campo_id]]+ '-' + [[campo.relationship]]+'-namefile'">  
                    {{ campo.attach || 'Seleccione archivo' }} 
                    </span>
                </label>
                </div>
            </div>
            <small  v-if="campo.mensajes && campo.mensajes.length > 0 && ( showMensajes || estadoFormulario > 0)" class="position-absolute">
                <p  class="form-text text-danger">
                {{ campo.mensajes[0].mensajeStr }}
                </p>
            </small>
        </div>
    </div>
</template>