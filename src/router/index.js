import { createWebHistory, createRouter } from "vue-router";
import Login from "../views/Login.vue";
import Layout from '../views/Layout.vue'
import About  from '../views/About.vue'
import Tramite from '../views/Tramite.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/inicio',
        name: 'Inicio',
        component: Tramite,
        auth: true
      },
      {
        path: '/tramites/borradores/:id',
        name: 'Borradores',
        component: About,
        auth: true
      },
      {
        path: '/tramites/pendiente-de-pago/:id',
        name: 'Pendiente de pago',
        component: About,
        auth: true
      },
      {
        path: '/tramites/pendiente-de-pago-con-referencia/:id',
        name: 'Pendiente de pago con referencia',
        component: About,
        auth: true
      },
      {
        path: '/tramites/en-espera-de-atencion/:id',
        name: 'En espera de atencion',
        component: About,
        auth: true
      },
      {
        path: '/tramites/en-curso/:id',
        name: 'En curso',
        component: About,
        auth: true
      },
      {
        path: '/tramites/por-firmar/:id',
        name: 'Por firmar',
        component: About,
        auth: true
      },
      {
        path: '/tramites/finalizado/:id',
        name: 'Finalizado',
        component: About,
        auth: true
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   let user = Storage.getItem('Constants.KEY_USER');
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     if (!user) {
//       router.push({ name: 'landing' }).catch(error=>{
//           console.log(error);
//       })
      

//     } else {
//       next() // go to wherever I'm going
//     }
//   } else{
//     next() // does not require auth, make sure to always call next()!
//   }
// });


export default router;