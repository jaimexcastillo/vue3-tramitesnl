<script setup >
import { ref } from "vue";

    const loading = ref(false)

    const onClick = () => {
        loading.value = true
        setTimeout(function () {
            loading.value = false         
        }, 3000);
    }
</script>

<template>
          <v-app-bar :elevation="1"   class="app-bar">
            <v-card flat class=" d-flex  dexter ">
                
                <v-img
                    width="200"
                    max-width="200"
                    flat
                    class="ml-5"
                    src="../../src/assets/img/logo.svg"
                    >
                </v-img>

                <v-card class="d-flex flex-row align-center " flat>

                    <v-card-text flat>
                        <v-text-field
                        :loading="loading"
                        density="compact"
                        variant="solo"
                        label=" "
                        append-inner-icon="mdi-magnify"
                        single-line
                        hide-details
                        @click:append-inner="onClick"
                        ></v-text-field>
                    </v-card-text>
                    <v-btn>
                        Jaime alberto castillo
                    </v-btn>
                    <v-divider
                        class="mx-3 align-self-center"
                        length="24"
                        thickness="2"
                        vertical
                    ></v-divider>
                    <v-btn icon="mdi-vuetify">
                    </v-btn>
                    <v-btn icon="mdi-vuetify">
                    </v-btn>
                    <v-btn icon="mdi-vuetify">
                    </v-btn>
                </v-card>
            </v-card>
        </v-app-bar>
            
</template>

<style>
    .app-bar>div{
        width: 100%;
        justify-content: center;
    }
    .dexter{
        /* max-width: 1500px; */
        width: 100%;
        align-items: center;
        justify-content: space-between;
    }
    .v-card__underlay{
        display: none;
    }

</style>

