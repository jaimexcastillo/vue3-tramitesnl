<script setup>
import { onMounted, ref } from "vue";

    const props = defineProps(['tramitesCart', 'type', 'cartComponent', 'items', 'pages', 'totalItems', 'currentPage'])

    onMounted( ()=> {
        localStorage.removeItem('datosFormulario');
        localStorage.removeItem('listaSolicitantes');
        localStorage.removeItem('tramite');
        processFiles()
    })



    const index = ref(1)
    const tramitesPaginados = ref(props.tramitesPaginados ?? [])
    const limit = ref(30)
    const user = ref()
    const message = ref(null)
    const currentPageLocal = ref(props.currentPage)     
    let tramites = ref([])
    
    const processFiles = () => {
        tramites = props.items.map(obj => {
                    let files = [];
                    obj.files.map(file => {
                        if(file.attach && file.attach != ""){
                            let name = file.attach.split('/');
                            let ext = name[name.length-1].split('.');
                            ext = ext[ext.length-1];

                            name = name[name.length-1].split('-');
                            name = name.slice(0, -1);

                            files.push({
                                name : `${name.join('-')}.${ext}`,
                                href : file.attach
                            });
                        }
                    })
                    obj.files = files;
                    return obj;
                })
    }

    const processToCart = () => {
        
    }
    const updateListado = () => {
        
    }
    const setPage = () => {
        
    }

</script>

<template>
  <div class="pagination flex-column">
		<div class="pagination-content">
            pagination
			<div v-for="(tramite, index) in tramites" :key="index" :data-alog="JSON.stringify(tramite)" class="tramite-item">
				<div class="card list-item card-custom gutter-b col-lg-12" style="background-color: #d9dee2 !important;" v-if="tramite.is_group == true">
					<div class="d-flex mobile-lista-multiple align-items-center mb-3">
						<div class="mr-3 ml-4  espace-checkbox" v-if="tramite.status && (tramite.status == 99 || tramite.status == 98) && !cartComponent && ['notary_titular', 'notary_substitute'].includes(user.role_name)"><input type="checkbox" :id="tramite.id" style="width:18px; height:18px;" v-on:change="processToCart(tramite, true)"></div>
						<div class="mr-auto espace-checkbox-text desktop-agrupacion-width" v-bind:style="{ width: '60%' }">
							<h4 class="ml-3 text-uppercase text-truncate"><strong>{{ tramite.servicio }}{{ tramite.tipo_tramite ? ` - ${tramite.tipo_tramite}` : '' }}</strong></h4>
							<h5 class="ml-3">
                                <span style="font-weight: normal;" v-if="tramite.folio_pago"><strong>FOLIO PAGO:</strong> {{ tramite.folio_pago ? `${tramite.folio_pago} -` : '' }}</span>
                                <span style="font-weight: normal;" v-if="tramite.fse"><strong>FSE:</strong> {{ tramite.fse ? `${tramite.fse} -` : '' }}</span>
                                {{ tramite.created_at }}
                            </h5>
						</div>
						<div class="my-lg-0 my-1">
                            <!-- todo -->
                            <!-- <detalle-actualizado-component :items="tramite.tickets" v-if="tramite.tickets && tramite.status == 99"></detalle-actualizado-component> -->


                            <button v-on:click="cancelReference(tramite)" class="btn btn-sm btn-danger font-weight-bolder text-uppercase text-white mr-2" v-if="tramite.recibo_referencia && [5].includes(type)">CANCELAR REFERENCIA</button>
                            <a v-on:click="goTo(tramite.recibo_referencia, true)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white mr-2" v-if="tramite.recibo_referencia && [5].includes(type)">VER REFERENCIA</a>
                            <!-- <a v-on:click="redirect(tramite[0].doc_firmado, true)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white mr-2" v-if="tramite[0].doc_firmado && [2,3].includes(type)">VER DECLARACIÓN</a> -->
                            <a v-on:click="goTo(tramite.url_recibo, true)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white mr-2" v-if="tramite.url_recibo && [2,3].includes(type)">VER RECIBO DE PAGO</a>
							<button v-on:click="addToCart(tramite)" v-if="tramite.status == 99 && !['notary_capturist'].includes(user.role_name)" type="button" class="btn btn-sm mr-2" :class="tramite.en_carrito ? 'btn-primary' : 'btn-outline-primary'">
                                <span v-if="tramite.loading"><i class="fas fa-spinner fa-spin"></i></span>
                                <span v-if="!tramite.loading"><i :class="tramite.en_carrito == 1 ? (cartComponent ? 'fas fa-trash' : 'fas fa-check-circle') : 'fas fa-plus-circle'"></i> {{ tramite.en_carrito == 1 ? (cartComponent ? 'ELIMINAR' : 'QUITAR DEL CARRITO') : 'AGREGAR AL CARRITO' }} ({{ tramite.tickets.length }})</span>
                            </button>
                            <button v-on:click="addToSign(tramite)" v-if="type == '98' && ['notary_titular', 'notary_substitute'].includes(user.role_name)" type="button" class="btn btn-sm mr-2" :class="tramite.por_firmar ? 'btn-primary' : 'btn-outline-primary'">
                                <span v-if="tramite.loadingSign"><i class="fas fa-spinner fa-spin"></i></span>
                                <span v-if="!tramite.loadingSign"><i :class="tramite.por_firmar == 1 ? 'fas fa-check-circle' : 'fas fa-plus-circle'"></i> {{ tramite.por_firmar == 1 ? 'DESELECCIONAR' : 'PREPARAR PARA FIRMAR' }}</span>
                            </button>
                            <div class="btn-group mr-2 mobile-detalles" v-if="!cartComponent">
                                <a v-on:click="goTo(tramite, true)" class="btn btn-sm btn-primary font-weight-bolder text-uppercase text-white" :class="!tramite.files || tramite.files.length == 0 ? 'rounded' : ''">
                                    <span class="text-white">VER DETALLES</span>
                                </a>
                                <button v-if="tramite.files && tramite.files.length > 0" type="button" class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a v-for="(file, ind) in tramite.files" class="dropdown-item" :href="file.href || file" target="_blank" :key="ind"><i class="fas fa-download mr-2"></i> {{ file.name || file }}</a>
                                </div>
                            </div>
                            <span v-if="cartComponent" class="btn btn-secondary mr-2">{{ new Intl.NumberFormat('es-MX', { style : 'currency', currency : 'MXN' }).format(tramite.map(ele => ele.importe_tramite).reduce((a,b) => a+b)) }} </span>
                            <span v-if="tramite.status_descripcion && !cartComponent" class="btn btn-secondary mr-2">{{ tramite.status_descripcion || "CERRADO" }} </span>
                            <button class="btn btn-secondary" type="button" data-toggle="collapse" :data-target="`#collapse-${index}`" :aria-expanded="type != 2 ? 'true' : 'false'" :aria-controls="`collapse-${index}`"><i class="fas fa-chevron-down p-0"></i></button>
						</div>
					</div>
                    <div class="collapse" :id="`collapse-${index}`" :class="type != 2 ? 'show' : ''">
                        <!-- todo -->
    					<!-- <tramite-component
                            :cartComponent="cartComponent"
                            :group="true"
                            :type="type"
                            v-for="(solicitud, ind) in tramite.tickets"
                            @processToCart="processToCart"
                            @processDelete="processDelete"
                            :tramitesCart="tramitesCart"
                            :ticket="solicitud"
                            :tramite="tramite"
                            v-bind:key="ind"
                        ></tramite-component> -->
                    </div>
				</div>
                <!-- todo -->
				<!-- <tramite-component
                    v-if="tramite.is_group == false"
                    @obtenerTramites="obtenerTramites"
                    :cartComponent="cartComponent"
                    :type="type"
                    @processToCart="processToCart"
                    @processDelete="processDelete"
                    :tramitesCart="tramitesCart"
                    :tramite="tramite"
                    :ticket="tramite.tickets[0]"
                    v-bind:key="index"
                    @responseDelete="responseDelete"
                ></tramite-component> -->
			</div>
            <div class="card mb-4 pt-5" v-if="totalItems === 0">
                <div class="card-body">
                    <h3 class="text-center">{{ message || '¡Lo sentimos! No se encuentran registros para mostrar.' }}</h3>
                    <p class="text-center w-75 m-auto" v-if="cartComponent">Para continuar puedes <a class="card-link m-0 cursor-pointer" v-on:click="redirect('/nuevo-tramite')">inciar un tramite nuevo</a> o agregar trámites desde el listado de <a class="card-link m-0 cursor-pointer" v-on:click="redirect('/tramites/pendiente-de-pago/99')">Pendientes de Pago</a></p>
                </div>
            </div>
		</div>
		<div class="card card-custom">
		    <div class="card-body py-7">
		        <!--begin::Pagination-->
		        <div class="d-flex justify-content-between align-items-center flex-wrap">
		            <div class="d-flex flex-wrap mr-3" >
		                <a  class="btn btn-icon btn-sm btn-light-primary mr-2 my-1" :class="totalItems == 0 ? 'disabled' : ''" v-if="currentPageLocal != 1" v-on:click="goto(1)">
		                    <i class="ki ki-bold-double-arrow-back icon-xs"></i>
		                </a>
		                <a  class="btn btn-icon btn-sm btn-light-primary mr-2 my-1" :class="totalItems == 0 ? 'disabled' : ''" v-if="currentPageLocal != 1" v-on:click="goto(currentPageLocal - 1)">
		                    <i class="ki ki-bold-arrow-back icon-xs"></i>
		                </a>
		                <a class="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1" v-for="(r, index) in pages" :key="index"
                        data
		                v-bind:class="[ currentPageLocal === r ? 'active' : '']" v-on:click="goto(r)"> 
		                   {{ r }}
		                </a>
		                <a
                            class="btn btn-icon btn-sm btn-light-primary mr-2 my-1"
                            :data-algo="pages > 1"
                            :data-otro="`${pages}, ${currentPageLocal}`"
                            v-if="pages > 1 && pages != currentPageLocal"
                            :class="pages == 0 ? 'disabled' : ''"
                            v-on:click="goto(currentPageLocal + 1)"
                        >
		                    <i class="ki ki-bold-arrow-next icon-xs"></i>
		                </a>
		                <a
                            class="btn btn-icon btn-sm btn-light-primary mr-2 my-1"
                            v-if="pages > 1 && pages != currentPageLocal"
                            :class="pages == 0 ? 'disabled' : ''"
                            v-on:click="goto(pages[pages.length - 1])"
                        >
		                    <i class="ki ki-bold-double-arrow-next icon-xs"></i>
		                </a>
		            </div>
		            <div class="d-flex align-items-center">
		                <select class="form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-dark-o-20" style="width: 75px;" v-model="limit" @change="calcularPage">
		                    <option value="10" selected>10</option>
		                    <option value="20">20</option>
		                    <option value="30">30</option>
		                </select>
		            </div>
		        </div>
		        <!--end:: Pagination-->
		    </div>
		</div>
	</div>
</template>
