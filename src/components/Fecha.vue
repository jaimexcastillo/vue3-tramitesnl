
<script setup>
import { ref, toRefs } from "vue"
    const emit = defineEmits(["updateForm"])
    const props = defineProps(['campo', 'estadoFormulario', 'showMensajes'])
    const {campo} = toRefs(props)
    const showDecadeNav = ref(true)
    const formatted = ref('')
    const isShift = ref(false)
    const seperator = ref("-")
    const mes = ref('')
    const date = ref({
        from: null,
        to: null,
        month: null,
        year: null
    })

    

    validar()


    const getNextMonthDate = () => {
        var now = new Date();
        if (now.getMonth() == 11) {
            var current = new Date(now.getFullYear() + 1, 0, 1);
        } else {
            var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }
        return current
    }
    const showDate = (date) => {
        date = date
        campo.value.valor = `${date.month} ${date.year}`
        validar();
    }
    const onkeydown = (e)=>{
        return IsNumeric(e.target, e.keyCode);
    }
    const onkeyup = (e) => {
        ValidateDateFormat(e.target, e.keyCode);
    }
    const IsNumeric = (input, keyCode) => {
        if(campo.value.show) campo.value.show = campo.value.show.replace('/', '-');
        if (keyCode == 16) isShift.value = true;
        if (((keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode <= 37 || keyCode <= 39 || (keyCode >= 96 && keyCode <= 105)) && isShift.value == false) {
        if ((campo.value.show.length == 2 || campo.value.show.length == 5) && keyCode != 8) campo.value.show += seperator.value;
        return true;
        } else return false;
    }
    const ValidateDateFormat =(input, keyCode) => {
        var dateString = campo.value.show;
        if (keyCode == 16) isShift.value = false;
        var regex = /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/;

    }
    const onContext = (ctx) => {
        if(ctx.selectedDate){
        let date = ctx.selectedYMD.split('-');
        if(date[2]) this.campo.value.show = `${date[2]}-${date[1]}-${date[0]}`;
        }
        formatted.value = ctx.selectedFormatted
        this.validar();
    }
    const cahngeEvent =() => {
        //this.estadoFormulario = this.estadoFormulario + 1;
        console.log(campo.value.show)
        let campoSplit = campo.value.show.split('-');
        if(campoSplit[2].length == 2) campoSplit[2] = `20${campoSplit[2]}`;
        campo.value.show = campo.value.join('-');
        validar();
    }
    const validar = () => {
        let format = true;
        if(/\d{2}-\d{2}-\d{4}/.test(campo.value.show)){
        let date = campo.value.show.split('-');
        if(date[2]) campo.value.valor = `${date[2]}-${date[1]}-${date[0]}`;
        }else if(!JSON.parse(campo.value.caracteristicas).formato){
        format = false;
        console.log('cambio valor');
        campo.value.valor = campo.show;
        }

        campo.value.mensajes = [];
        let requeridoValido = true;
        let validDate = true;
        let caracteristicas = getCaracteristicas();
        if( caracteristicas.hasOwnProperty('required') && caracteristicas.required === 'true') {
        requeridoValido =  !!campo.value.valor && (campo.value.valor+"").length > 0;
        if( !requeridoValido ){
            let mensaje = { 
            tipo:'required',
            mensajeStr: "El campo " + campo.value.nombre.toLocaleLowerCase() + " es requerido"
            }
            campo.value.mensajes.push( mensaje );
        }
        validDate = this.isValidDate(campo.value.valor);
            if( !validDate || !format ){
                let mensaje = { 
                tipo:'required',
                mensajeStr: "El campo " + campo.value.nombre.toLocaleLowerCase() + " no es valido"
                }
                campo.value.mensajes.push( mensaje );
            }
        }


        campo.value.valido =  requeridoValido && validDate;
        // $forceUpdate();
        emit('updateForm', campo.value);
    }

    const isValidDate = (fecha) => {
        if(JSON.parse( campo.value.caracteristicas ).formato == 'mes'){
            if(campo.value.valor){
                return  true
            }else{
                return false;
            }
        }else{
            var regex = /\d{4}-\d{2}-\d{2}/;
            if(regex.test(fecha)){
                let date = new Date(fecha);
                return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
            } else {
                return false;
            }
        }
    }

    const getCaracteristicas =() =>{
        let caracteristicas = {};
        try {
            caracteristicas = JSON.parse(campo.value.caracteristicas + '');
        }catch(err){
            console.log(err);
        }
        return caracteristicas;
    }


</script>

<template>
  <div class=" fv-plugins-icon-container" id="fechaElement">
        <div class="mb-3" v-if="!JSON.parse(campo.caracteristicas).formato">
            <input
                id="example-input"
                v-model="campo.show"
                type="text"
                placeholder="DD-MM-AAAA"
                autocomplete="off" 
                @focus="validar"
                :disabled="campo.disabled"
                @change="cahngeEvent"
                v-on:keydown="onkeydown"
                v-on:keyup="onkeyup"

            >
            <div>
                <b-form-datepicker
                :id="campo.campo_id + ''"
                :name="campo.nombre"
                v-model="campo.valor"        
                @change="validar"
                @focus="validar"
                @input="validar"
                :show-decade-nav="showDecadeNav"
                button-only
                right
                aria-controls="example-input"
                @context="onContext" :disabled="campo.disabled"
                >
                </b-form-datepicker>
            </div>
        </div>
            
        <!-- TODO: nb esta en version 3  -->
        <!-- <month-picker-input 
          v-if="JSON.parse( campo.caracteristicas ).formato == 'mes' "
          :no-default="false"
          class="month" 
          :max-date="JSON.parse( campo.caracteristicas ).date_limit == true ?  new Date() : null"  
          lang="es" 
          @change="showDate"
        
          >
        </month-picker-input> -->


      <small  v-if="campo.mensajes && campo.mensajes.length > 0 && ( showMensajes || estadoFormulario > 0)" class="position-absolute">
          <p  class="form-text text-danger">
            {{ campo.mensajes[0].mensajeStr }}
          </p>
      </small>
    </div>
</template>
