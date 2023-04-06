<script setup>
    import { ref } from "vue";
    import { useLogin } from '../store'

    const user = ref(null)
    const store = useLogin()
    const password = ref(null)

    const assets = '../assets/img/'

    const doLogin = async () => {
        store.doLoginPinia(user.value, password.value)
    }

</script>

<template>
    <div class="d-flex flex-column" style="width:100%">
        <div class="w-50 mobile-w-100  mobile-order" style="height: 100%; display: block;">
            <div class="d-flex text-center align-items-center justify-center align-center bienvenido-corchete"  >
                <img  class="mobile-content-img content-img " alt="">
                <div  class="d-flex flex-column mobile-title" >
                    <div class="mx-auto leon-mobile" style="width:6vw">
                        <img src="../assets/img/leon1.webp"  width="100%" class="mx-auto" >
                    </div> 
                    <a class="no-decoration display-none" to="/">
                        <div class="text-uppercase font-weight-bold bienvenido "  >Bienvenido</div>
                        <span class="text-uppercase tramites" >Portal</span>
                    </a> 
                </div>
            </div>
        </div>

        <div  class="d-flex mobile-card-placement" style="height:100vh;">     
            <div class="row"  style="z-index:10;width:100%;justify-content:center"   >
                <div class="col-12 col-md-6 col-lg-6 display-none" ></div>
                <div class="col-12 col-md-6 col-lg-6 card-position-login unset-center-mobile " >
                    
                    <div class="pa-6 card" width="100%" >
                        <a href="/" class="d-flex justify-content-center">
                            <img width="20" class="logo_genl" alt="Logo" src="../assets/img/tesoreria.png">
                        </a>
                        <h4 class="justify-center text-h5 text-center my-4 " style="color:#AF8C55;word-break: break-word;" >Ingrese su nombre de usuario y contraseña</h4>
                        
                        <form class="form-login form fv-plugins-bootstrap fv-plugins-framework register"  @submit.prevent novalidate="novalidate" >
							<div class="form-group fv-plugins-icon-container px-6">
									<input
										class="form-control form-control-solid  bg-white border-color py-5 px-6"
										type="text"
										placeholder="Nombre de usuario o Correo electrónico"
										name="username"
										autocomplete="off"
										data-fv-not-empty="true"
										data-fv-not-empty___message="El nombre de usuario o correo electrónico es requerido" 
                                        v-model="user"
									>
									<div class="fv-plugins-message-container"></div>
							</div>
                               
							<div class="form-group fv-plugins-icon-container px-6">
								<input
									class="form-control form-control-solid bg-white border-color py-5 px-6"
									type="password"
									placeholder="Contraseña"
									name="password"
									autocomplete="off"
                                    v-model="password"
									data-fv-not-empty="true"
									data-fv-not-empty___message="La contraseña es requerida" 

									data-fv-regexp="false"
									data-fv-regexp___regexp="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
									data-fv-regexp___message="La contraseña de ser de al menos 8 caracteres,<br>contener al menos una mayúscula, un número y un caracter especial."
								>
								<div class="fv-plugins-message-container"></div>
							</div>

                                
                                <div class="d-flex flex-column">
									<button type="submit" @click="doLogin" class="btn btn-accent font-weight-bold px-9 py-4 my-3"><i class="fas fa-spinner fa-spin mr-2 d-none"></i> Ingresar</button>
									<!-- <a href="{{ url()->route("password/recovery") }}" class="text-dark-50 text-hover-primary my-3 mx-auto" id="kt_login_forgot">¿Olvidaste tu contraseña?</a> -->
									<!-- <a href="{{ url()->route("sign-in") }}" class="text-dark-50 text-hover-primary my-3 mx-auto">Solicitar usuario</a> -->

                                </div>
                              

                        </form>

                    </div>
                </div>

                <img  class="marca-awa"  src="../assets/img/E.Firma-08.svg" alt="" >
            </div>
        </div>


        <div class="fondo-login"></div>
    </div>
</template>

