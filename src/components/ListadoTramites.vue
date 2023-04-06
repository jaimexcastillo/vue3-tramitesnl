<script setup> 
import { onMounted, ref, watch } from "vue";
import { useListadoTramites } from "../store";
import { getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'


    const instance = getCurrentInstance();
    const route = useRoute()

    const store = useListadoTramites()
    const userStorage = sessionStorage.getItem('user')
    const user = JSON.parse(userStorage)?.user
    const tramitesCart = ref([])
    const searchString = ref("")
    const endDate = new Date()
    const startDate = new Date().setDate(new Date().getDate()-30);
    const porPage = ref(30)
    const currentPage = ref(1)
    const totalTramites = ref(0)
    const estatusTramites = 1
    const comunidadSSP = 1
    
    const type = ref(route.params.id)
    let pages = ref([0])
    let loading = ref(true)
    let tramitesFiltrados = ref([])
    let totalFiltered = ref(0)
    let totalItems = ref(0)
    let tramites = ref([])
    let searchBy = ref({name: null, description:''})
    let config_id = user?.config_id
    let dateRange = ref({ start_date : '2023-03-06',  end_date : '2023-04-05'  })
    // start_date=2023-03-06&end_date=2023-04-05

    onMounted( async ()=> {
        await getTramites()
    })
    
    watch(type, async (newType, oldType) => {
        console.log('type nuevo');
        loading = true
        await getTramites()
        loading = false
    })
    
    watch(
    route.params,
    () => {
      console.log(route.params.id);
    },
    {deep: true, immediate: true,}
    )


    const getTramites = async () => {
        //todo
        const buscarTramites = await  store.doSearchTramites(porPage.value, type.value, currentPage.value, dateRange.value, searchString.value, searchBy.value)
        tramites = buscarTramites.tickets;
        totalItems = buscarTramites?.totals.global
        tramitesFiltrados = buscarTramites.tickets;
        pages = buscarTramites.pages.total;
        totalItems = buscarTramites.totals.global;
        totalFiltered = buscarTramites.totals.filtered;
        loading = false;
        
        instance?.proxy?.$forceUpdate();
        return buscarTramites
    }

    const updateListado = () => {
        //todo
    }
    const setPage = () => {
        //todo
    }
    const processToCart = () => {
        //todo
    }

          
</script>
<template>
    <div class="content d-flex flex-column flex-column-fluid pt-0">
        <div class="subheader py-2 py-lg-4 subheader-transparent" id="kt_subheader">
            <div class="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
                <div class="d-flex align-items-center flex-wrap mr-2 w-100">
                    <div>
                        <h5 class="text-dark font-weight-bold mt-2 mr-5 mb-0">Trámites</h5>
                        <span class="text-dark-50 font-weight-bold" id="kt_subheader_total"><strong>{{ totalFiltered }}</strong> de {{ totalItems }}</span>
                    </div>
                    
                    <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-5 bg-gray-200"></div>
                  
                    <div class="">
                        Búsqueda por fecha:
                        <!-- <daterange-picker
                            :dateRange="dateRange"
                            :dateFormat="dateFormat"
                            @updateValues="updateValues"
                        ></daterange-picker> -->
                    </div>
                    <div class="d-flex align-items-center ml-auto">
                        <div class=" ml-10">
                            <!-- <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Buscar por: <strong>{{ searchBy?.description || '' }}</strong>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <button v-if="config_id !=  comunidadSSP" :class="searchBy?.name == null ? 'active' : ''" v-on:click="searchByFilter(null, '')" class="dropdown-item" type="button">Ninguno</button>
                                <button v-if="config_id !=  comunidadSSP"  :class="searchBy?.name == 'escritura' ? 'active' : ''" v-on:click="searchByFilter('escritura', 'Número de Escritura')" class="dropdown-item" type="button">Número de Escritura</button>
                                <button v-if="config_id !=  comunidadSSP" :class="searchBy?.name == 'expediente' ? 'active' : ''" v-on:click="searchByFilter('expediente', 'Expediente Catastral')" class="dropdown-item" type="button">Expediente Catastral</button>
                                <button v-if="config_id ==  comunidadSSP" :class="searchBy?.name == 'expediente_ssp' ? 'active' : ''" v-on:click="searchByFilter('expediente_ssp', 'Expediente SSP')" class="dropdown-item" type="button">Expediente SSP</button>
                                <button v-if="config_id !=  comunidadSSP" :class="searchBy?.name == 'enajenante' ? 'active' : ''" v-on:click="searchByFilter('enajenante', 'Enajenante')" class="dropdown-item" type="button">Enajenante</button>
                                <button v-if="![99,80].includes(type)" :class="searchBy?.name == 'folio_pago' ? 'active' : ''" v-on:click="searchByFilter('folio_pago', 'Folio de Pago')" class="dropdown-item" type="button">Folio de Pago</button>
                                <button v-if="![99,80].includes(type)" :class="searchBy?.name == 'tramite_id' ? 'active' : ''" v-on:click="searchByFilter('tramite_id', 'Tramite ID')" class="dropdown-item" type="button">Tramite ID</button>
                                <button v-if="![99,80].includes(type)" :class="searchBy?.name == 'fse' ? 'active' : ''" v-on:click="searchByFilter('fse', 'FSE')" class="dropdown-item" type="button">FSE</button>
                            </div> -->
                            <v-select
                                class="select-busqueda"
                                label="Buscar por: "
                                variant="outlined"   
                                :single-line="true"
                                density="comfortable"
                                hide-details="true"
                                :items="['Ninguno', 'Número de Escritura', 'Expediente', 'Expediente SSP', 'Enajenante', 'Folio de Pago', 'Tramite ID', 'FSE']"
                            ></v-select>
                        </div>
                        <form class="d-flex">
                            <div class="input-group input-group-sm input-group-solid" style="max-width: 175px">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Buscar..."
                                    v-on:keyup="searchKeyUp(this)"
                                    v-model="searchString"
                                >
                                <v-btn
                                    icon="mdi-magnify"
                                    rounded="0" 
                                    elevation="0"
                                    variant="outlined"
                                >
                                </v-btn>
                            </div>
                            <!-- <v-btn
                                rounded="0" 
                                elevation="0"
                                class="px-2"
                                size="xl-large"
                                density="comfortable"
                                variant="outlined"
                                v-on:click="getTramites"
                            >
                                Buscar
                            </v-btn> -->
                        </form>
                    </div>
                    <div class="btn-group" v-if="tramitesCart.length > 0">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Acciones
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <button v-on:click="addToCart(1)" class="dropdown-item" type="button">Agregar al Carrito</button>
                            <button v-on:click="addToCart(null)" class="dropdown-item" type="button">Eliminar de Carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        <div v-if="estatusTramites == '5'">
            <v-alert show type="warning"> 
                <div class="text-justify text-white">
                    Si usted realizó su pago y verificó que se halla efectuado, su referencia será actualiza en trámites finalizados en un máximo de 48 horas.
                </div>
            </v-alert>
        </div>
        <div class="d-flex flex-column-fluid">
            <v-container v-if="loading">
                <v-row>
                    <v-col cols="12" md="12">
                        <!-- <v-skeleton-loader
                            class="card card-custom justify-content-center"
                            type="list-item-two-line, button"
                            v-for="(r,i) in [1,2,3,4,5,6]"
                            v-bind:key="i"
                            height="90px"
                            style="margin-bottom: 8px;"
                        ></v-skeleton-loader> -->
                    </v-col>
                </v-row>
            </v-container>
            <div class="w-100" v-if="!loading">
                <Pagination
                    @getTramites="getTramites"
                    :type="type"
                    @processToCart="processToCart"
                    :items="tramitesFiltrados"
                    :tramitesCart="tramitesCart"
                    @updateListado="updateListado"
                    :pages="pages"
                    :totalItems="totalFiltered"
                    @setPage="setPage"
                    :currentPage="currentPage"
                ></Pagination>
            </div>
        </div>
    </div>
</template>