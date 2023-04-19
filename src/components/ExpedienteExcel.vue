
<script setup>
import { onMounted, toRefs } from "vue";


    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes'])
    const emit = defineEmits(['updateForm', 'processGrupal'])
    const {campo} = toRefs(props)


    onMounted(()=> {
        console.log(this);
        let promises = [];
        if(campo.value.nombreArchivoGuardado){
          let urlFile = process.env.TESORERIA_HOSTNAME + '/download/' + campo.value.nombreArchivoGuardado;

          promises.push(getFile( urlFile, campo.value.nombreArchivoGuardado, campo.value ));


          Promise.all(promises).then(( respuestas ) => {
            respuestas.forEach( (res) => {
                const blob = new Blob([res.data], { type: res.headers['content-type'] });
                var fileNew = new File([blob], res.config.headers.nombreArchivo , {
                  type: res.headers['content-type'], 
                  lastModified: Date.now()
                });
                let headers = res.config.headers;

                campo.value.valor = fileNew;
                campo.value.valido =  true;
                $("#"+ campo.value.campo_id + '-' + campo.value.nombre.replace('*', '') + '-namefile' ).text(  campo.value.nombreArchivoGuardado );
                emit('updateForm', campo.value);

              })
            }).catch(errors => {

          }).finally(() => {

          });

        } else {
          validar();
        }
    })


    const getFile = (url, nombreArchivo, campo) => {
      return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url,
            responseType: "ArrayBuffer",
            headers: {
          'nombreArchivo': nombreArchivo,
          campo_id: campo.campo_id,
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

    const validar = () => {
        let requeridoValido = false;
        var file = document.getElementById(campo.value.campo_id );
          if (file != null ) {
              file =file.files[0];
            if(file){
              var fileReader = new FileReader();
              fileReader.readAsBinaryString(file);
              fileReader.onload = function(e) {
                var data =  e.target.result;
                var workbook = XLSX.read(data, {type: "binary"});
                workbook.SheetNames.forEach(sheetName => {
                  var rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                  var json_object = JSON.stringify(rowObject);    

                  rowObject.map(async item => {
                    let exp = `${item.Municipio}${item.Region}${item.Manzana}${item.Lote}`;
                    const url = `${process.env.TESORERIA_HOSTNAME}/insumos-catastro-consulta/${exp}`;
                    try{
                      const response = await axios.get(url);
                      this.$emit('processGrupal', {response, exp});
                    }catch(err){
                      this.$emit('processGrupal', {response:null, exp});
                    }
                    // $.ajax({
                    //   url : `${process.env.TESORERIA_HOSTNAME}/insumos-catastro-consulta/${exp}`,
                    //   type: 'get',
                    //   success : (res) => {
                    //   },
                    //   error : (err) => {

                    //   }
                    // });

                  })

                  var opcionesExp = ['Expediente Catastral' , 'Exp Catastral', 'E Catastral'];
                  var trueExp;
                  var tipoValidacion ;

                  for (let k = 0; k < opcionesExp.length; k++) {
                    if (Object.keys(rowObject[0]).indexOf(opcionesExp[k]) != -1) {
                      console.log(Object.keys(rowObject[0]).indexOf(opcionesExp[k]));
                      var index = Object.keys(rowObject[0]).indexOf(opcionesExp[k]);
                      trueExp = opcionesExp[k];
                      break;
                    }
                    
                  }

                  var index = Object.keys(rowObject[0]).indexOf(trueExp);
                  index != -1 ? tipoValidacion  = '1' : tipoValidacion = '2';
                  
                  //cuando el usuario añada los expedientes bajo una unica columna de expediente catastral 
                  if (tipoValidacion == 1 ) {
                    
                    var expName =  Object.keys(rowObject[0])[Object.keys(rowObject[0]).indexOf(trueExp)]
                    for (let i = 0; i < rowObject.length; i++) {
                        // var key = Object.keys(rowObject[0]);
                        var value = rowObject[i][expName];
                        if ( (/^([0-9]{3,3})(-)?([0-9]{3,3})(-)?([0-9]{3,3})$/).test(value) == false ) {
                          alert('el documento excel no cuenta con el formato requerido error: "el formato de expediente completo es invalido"');
                          break;
                        }
                    }
                  
                    
                  }else if(tipoValidacion == 2){

                      var municipio = Object.keys(rowObject[0])[Object.keys(rowObject[0]).indexOf('Municipio')];
                        municipio == undefined ? 'municipio' : municipio;

                      var region = Object.keys(rowObject[0])[Object.keys(rowObject[0]).indexOf('Region')];
                        region == undefined ? region = 'region' : region;

                      var manzana = Object.keys(rowObject[0])[Object.keys(rowObject[0]).indexOf('Manzana')];
                        manzana == undefined ? manzana = 'manzana' : manzana;

                      var lote = Object.keys(rowObject[0])[Object.keys(rowObject[0]).indexOf('Lote')];
                        lote == undefined ? lote = 'lote' : lote;

                      for (let i = 0; i < rowObject.length; i++) {
                        var valueMunicipio = rowObject[i][municipio];
                          valueMunicipio = valueMunicipio.toString().padStart(3, '0');
                        var valueRegion = rowObject[i][region];
                          valueRegion = valueRegion.toString().padStart(3, '0');
                        var valueManzana = rowObject[i][manzana];
                          valueManzana = valueManzana.toString().padStart(3, '0');
                        var valueLote = rowObject[i][lote];
                          valueLote = valueLote.toString().padStart(3, '0');
                        
                        if ( /^([0-9]){1,3}$/.test(valueMunicipio) == false) {
                          alert('el documento excel no cuenta con el formato requerido error: "el expediente formado por municipio, region, manzana, lote es incorrecto" ')
                          break;
                        }
                        if ( /^([0-9]){1,3}$/.test(valueRegion) == false) {
                          alert('el documento excel no cuenta con el formato requerido error: "el expediente formado por municipio, region, manzana, lote es incorrecto"')
                          break;
                        }
                        if ( /^([0-9]){1,3}$/.test(valueManzana) == false) {
                          alert('el documento excel no cuenta con el formato requerido error: "el expediente formado por municipio, region, manzana, lote es incorrecto"')
                          break;
                        }
                        if ( /^([0-9]){1,3}$/.test(valueLote) == false) {
                          alert('el documento excel no cuenta con el formato requerido error: "el expediente formado por municipio, region, manzana, lote es incorrecto"')
                          break;
                        }
                      }
                   
                  }
                })
              }.bind(this);
          
            
            }
          }
          var fileInput = document.getElementById(campo.value.campo_id );
          if( fileInput && fileInput.files.length > 0  ){
            requeridoValido = true;
            $("#"+ campo.value.campo_id + '-' + campo.value.nombre.replace('*', '').replace(/\ /g, '') + '-namefile' ).text(  fileInput.files[0].name );
          } else {
            requeridoValido = false;
          }
          if( !requeridoValido ){
            let mensaje = { 
              tipo:'required',
              mensajeStr: "El archivo " + campo.value.nombre + " es requerido"
            }
            if(campo.value.mensajes === undefined) campo.value.mensajes = [];
            campo.value.mensajes.push( mensaje );
          } else{
            var fileInput = document.getElementById(campo.value.campo_id);
            let file = fileInput.files[0];
            campo.value.valor = file;
          }
          campo.value.valido =  requeridoValido;
          emit('updateForm', campo.value);
    }    


</script>

<template>
  <div class=" fv-plugins-icon-container">
        <div class="input-group">
            <div class="input-group-prepend">
            </div>  
            <div class="custom-file">
                <input  
                :id="[[campo.campo_id]]"
                :name="[[campo.campo_id]]" 
                class="custom-file-input"  style="background-color: #e5f2f5 !important"
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls"
                @change="validar()"/>
                <label class="custom-file-label" :for="[[campo.campo_id]]">
                    <span :id="[[campo.campo_id]]+ '-' + [[campo.nombre.replace('*', '')]]+'-namefile'">  
                        {{ campo.attach || 'Seleccione archivo' }}
                    </span>
                </label>
            </div>
        </div>
        <a v-if="/^{*}|Expediente$/.test(campo.nombre) == true" href="images\Formato.xlsx" download="Formato.xlsx">
        Descargar Formato
        </a>
    </div>
</template>