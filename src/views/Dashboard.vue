<script setup>
import { onMounted, ref } from "vue";
import { useDashboard } from "../store";

  const store = useDashboard()
  let borradores = ref([])
  let pendientePago = ref([])
  let esperaAtencion = ref([])
  let enCurso = ref([])
  
  onMounted( async () => {
    const response = await store.doSearchTramitesDashboard()
    borradores.value = response[0]
    pendientePago.value = response[1] ?? []
    esperaAtencion.value = response[3] ?? []
    enCurso.value = response[4] ?? []
  })
</script>

<template>
  <div class="container mx-auto my-6">
      <div class="d-flex flex-column">
        
        <div class="d-flex my-4">
          <v-card class="w-50 mx-6"  title="Borradores"> 
            <div v-for="(borrador, index) in borradores" :key="index">
                  <div class="d-flex flex-column">
                      {{borrador.titulo}} <br>  
                      {{borrador.clave}}
                  </div>
            </div>
          </v-card>
          <v-card class="w-50 mx-6"  title="Pendiente de pago">
            <div v-for="(pendiente, index) in pendientePago" :key="index">
              <div class="d-flex flex-column">
                      {{pendiente.titulo}} <br>  
                      {{pendiente.clave}}
                  </div>
            </div>  
          </v-card>
        </div>
        
        <div class="d-flex my-4">
          <v-card class="w-50 mx-6"  title="En espera de atencion">
            <div v-for="(espera, index) in esperaAtencion" :key="index">
              <div class="d-flex flex-column">
                      {{espera.titulo}} <br>  
                      {{espera.clave}}
                  </div>
            </div>  
          </v-card>
          <v-card class="w-50 mx-6"  title="En curso"> 
            <div v-for="(curso, index) in enCurso" :key="index">
              <div class="d-flex flex-column">
                      {{curso.titulo}} <br>  
                      {{curso.clave}}
                  </div>
            </div> 
          </v-card>
        </div>
        
      </div>
  </div>
</template>
