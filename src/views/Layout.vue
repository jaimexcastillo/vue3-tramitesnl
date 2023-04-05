<template>
    <v-app>
        
        <VHeader />

        <v-navigation-drawer v-model="drawer" permanent :rail="rail" @click="rail=false">
            <div class="iniciar-tramite">

                <router-link to="/inicio">
                    <v-btn
                        class="boton boton_primario"
                        variant="text"
                    >
                    <v-icon icon="mdi-file-plus"> </v-icon>
                    <span class="ml-3" v-if="!rail"> 
                        Iniciar tramite
                    </span>
                    </v-btn>
                </router-link>
                <v-btn
                class="toogle-navigation"
                :class="rail ? 'active' : ''"
                size="x-small"
                variant="text"
                icon="mdi-chevron-left"
                @click.stop="rail = !rail"
                ></v-btn>
            </div> 
            
            <v-divider></v-divider>

            <v-list class="d-flex flex-column" :class="!rail && 'mx-6' ">
                <v-list-item>
                    <router-link to="/inicio"> 
                        <div class="item-navigation">
                            <v-icon icon="mdi-home"> </v-icon> 
                            
                            <div v-if="!rail">    
                                Go to Home
                            </div>
                        </div>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link to="/tramites/borradores">
                        <div class="item-navigation">
                            <v-icon icon="mdi-file-outline"> </v-icon> 
                            
                            <div v-if="!rail">    
                                Borradores
                            </div>
                        </div>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link to="/tramites/pendiente-de-pago">
                        <div class="item-navigation">
                            <v-icon icon="mdi-cash"></v-icon>
                            
                            <div v-if="!rail">    
                                Pendiente de pago
                            </div>
                        </div>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link to="/tramites/pendiente-de-pago-con-referencia">
                        <div class="item-navigation">
                            <v-icon icon="mdi-file-document-arrow-right"> </v-icon>
                            
                            <div v-if="!rail">    
                                Pendiente de pago con referencia
                            </div>
                        </div>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link to="/tramites/en-espera-de-atencion"> 
                        <div class="item-navigation">
                            <v-icon icon="mdi-clock"></v-icon>
                            
                            <div v-if="!rail">    
                                En espera de atencion
                            </div>
                        </div>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link to="/tramites/en-curso">
                        <div class="item-navigation">
                            <v-icon icon="mdi-play"></v-icon>
                            
                            <div v-if="!rail">    
                                En curso
                            </div>
                        </div>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link to="/tramites/por-firmar">
                        <div class="item-navigation">
                            <v-icon icon="mdi-file-sign"></v-icon>
                            
                            <div v-if="!rail">    
                                Por firmar
                            </div>
                        </div>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link to="/tramites/finalizado">
                        <div class="item-navigation">
                            <v-icon icon="mdi-file-document-check" ></v-icon>
                            
                            <div v-if="!rail">    
                                Finalizado
                            </div>
                        </div>
                    </router-link>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        
        <v-main>

            <router-view></router-view>

        </v-main>

    </v-app>
</template>

<script setup>
import { ref } from "vue";
  const rail = ref(false)
  const drawer = ref(true)

</script>