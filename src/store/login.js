import { defineStore } from 'pinia'
import { ref } from 'vue'
// import router from '../router'
import { useRouter } from 'vue-router';

export const useLogin = defineStore('login', () => {
  const router = useRouter(); 
    const login = ref(null)
    const url = 'http://10.153.162.53'
   
    async function doLoginPinia(username, password){
      console.log('en store')
      const response =  await fetch(url+'/login', {
        headers: {
          'Authorization': 'Basic ' + btoa(username + ":" + password)
        }
      })
      const sessionData = await response.json()

      if(sessionData.data == 'response'){

        const user = await fetch( url + '/users/me', {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${sessionData?.response?.token}`,
          }
        })

        const userData = await user.json()

        if(userData.data == 'response'){
          const session = {}
          session['session'] = sessionData.response
          session['user'] =  userData.response.user
          session['authenticated'] = { 
            'created_at'  : new Date(), 
            'until_at':  sessionData.response.expires_in 
          }
          console.log(session);
          
          if(!sessionStorage.getItem('user') && session){
            console.log('session',session);
            sessionStorage.setItem('user', JSON.stringify(session))
            sessionStorage.setItem('test', [])
            console.log('session creada');
            router.push('/')
          } 


        }else{
          console.log('no inicia sesion');
        }

      }else{
        console.log('no inicia sesion');
      }

    }

    return { login , doLoginPinia }
   
  })