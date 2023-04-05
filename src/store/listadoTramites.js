import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useLogin } from '../store'


export const useListadoTramites = defineStore('listadoTramites', () => {
    const router = useRouter(); 
    const login = ref(null)
    const userStorage = sessionStorage.getItem('user')
    const user = JSON.parse(userStorage)?.user
    const url = 'http://10.153.162.47'
   
    async function doSearchTramites(){
        const response = await fetch(`${url}/get-all-tramites/${user.id}?limit=30&group_by=clave&status=2&page=1&start_date=2023-03-06&end_date=2023-04-05`)
        const listado = await response.json()
        
        return listado
    }

    return { doSearchTramites }
   
  })