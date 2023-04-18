
<script setup>
const instance = getCurrentInstance();
const props = defineProps(['campo', 'estadoFormulario', 'showMensajes', 'updateIt'])
const emit= defineEmits(["updateForm", "actionTipoElemento", "refrescarBusqueda"])


const checkRango = (valor, min, max) => {
  const val = Number((valor + "").replace(/[^0-9.-]+/g, ""))
  if (val > max) {
    campo.valor = max
  } else if (val < min) {
    campo.valor = min;
  }
}
const formatear = () => {
  let caracteristicas = getCaracteristicas();
  var number = campo.valor ? Number((campo.valor + "").replace(/[^0-9.-]+/g, "")) : "";
  let auxiliar_zero = toString(campo.valor);

  campo.valor === '0' || number <= Number(caracteristicas.valor_min) ? auxiliar_zero = true : auxiliar_zero = false
  
  if (caracteristicas.valor_min && number < Number(caracteristicas.valor_min) && Number(caracteristicas.valor_min) === 0)
    number = caracteristicas.valor_min;

  if (caracteristicas.valor_min && number < Number(caracteristicas.valor_min) && auxiliar_zero)
    number = caracteristicas.valor_min;

  if (caracteristicas.valor_max && number > Number(caracteristicas.valor_min))
    number = caracteristicas.valor_max


  if (caracteristicas.expreg == '^[0-9]*.[0-9]{2}$') {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    number ? campo.valor = formatter.format(number) : 0

  }
  else if (caracteristicas.expreg == '^[0-9]{0,20}$') {

    const formatter = new Intl.NumberFormat('en-US', {
      maximumSignificantDigits: caracteristicas?.valor_min?.length == 0 ? 1 : caracteristicas?.valor_min?.length,
      maximumSignificantDigits: caracteristicas?.valor_max?.length == 0 ? 21 : caracteristicas?.valor_max?.length,
    });
    number ? campo.valor = formatter.format(number) : 0

  }
  instance?.proxy?.$forceUpdate();
}

const getCaracteristicas = () =>{
    let caracteristicas = {};
    try {
      caracteristicas = JSON.parse(campo.caracteristicas + '');
    } catch (err) {
      console.log(err);
    }
    return caracteristicas;
  }

 const validar = (a) =>{
  if (campo.disabled) {
    return false;
  }

  let exregValida = true;
  let requeridoValido = true;
  let caracteristicas = {};
  var caracteristicasStr = campo.caracteristicas;
  campo.mensajes = [];

  try {
    caracteristicas = getCaracteristicas();
  } catch (err) {
    console.log(err);
  }
  
  if (caracteristicas.hasOwnProperty('required') && caracteristicas.required === 'true') {
    requeridoValido = !!campo.valor && (campo.valor + "").length > 0;
    if (!requeridoValido) {
      let mensaje = {
        tipo: 'required',
        mensajeStr: "El campo " + campo.nombre.toLocaleLowerCase() + " es requerido"
      }
      campo.mensajes.push(mensaje);
    }
  }
  campo.valido = requeridoValido && exregValida;
  if (campo.valor)
    formatear();

  emit('updateForm', campo);

}

const padLeft = (value, length) => {
  return (value.toString().length < length) ? padLeft("0" + value, length) :
    value;
}

const accion= ()=>{
  emit('actionTipoElemento', campo);
}

const refrescarBusqueda = () =>{
  emit('refrescarBusqueda', { refresh: true });
}

</script> 

<template>
  <div class=" fv-plugins-icon-container" v-if="!campo.ocultar">
    <span class="currencyinput input-group mb-3">
      <input :name="campo.nombre" type="text" class="form-control"
        :placeholder="[[JSON.parse(campo.caracteristicas).etiqueta ? JSON.parse(campo.caracteristicas).etiqueta : campo.nombre]]"
        :id="[[campo.campo_id]]" v-model="campo.valor" @blur="validar()" :disabled="campo.disabled" />
    </span>

    <small class="position-absolute">
      <p v-if="campo.mensajes && campo.mensajes.length > 0 && (showMensajes || estadoFormulario > 0)"
        class="form-text text-danger">
        {{ campo.mensajes[0].mensajeStr }}
      </p>
      <p v-if="JSON.parse(campo.caracteristicas).valor_min && JSON.parse(campo.caracteristicas).valor_max"
        class="form-text">
        entre {{ JSON.parse(campo.caracteristicas).valor_min }} y {{ JSON.parse(campo.caracteristicas).valor_max }}
      </p>
      <p v-if="JSON.parse(campo.caracteristicas).valor_min && !JSON.parse(campo.caracteristicas).valor_max"
        class="form-text">
        apartir de {{ JSON.parse(campo.caracteristicas).valor_min }}
      </p>
      <p v-if="!JSON.parse(campo.caracteristicas).valor_min && JSON.parse(campo.caracteristicas).valor_max"
        class="form-text">
        hasta {{ JSON.parse(campo.caracteristicas).valor_max }}
      </p>
    </small>
  </div>
</template>
