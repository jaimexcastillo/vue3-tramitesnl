import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useLogin } from '../store'
import moment from 'moment';


export const useListadoTramites = defineStore('listadoTramites', () => {
    const router = useRouter(); 
    const login = ref(null)
    const userStorage = sessionStorage.getItem('user')
    const user = JSON.parse(userStorage)?.user
    const url = 'http://10.153.162.47'
   
    async function doSearchTramites(porPage, type, currentPage, dateRange, searchString, searchBy){
        let params = {
            limit : porPage,
            group_by : 'clave',
            status : type,
            page : currentPage,
            start_date : moment(dateRange.start_date).format('YYYY-MM-DD'),
            end_date : moment(dateRange.end_date).format('YYYY-MM-DD')
        };
        if(searchString != ''){
            params.search = searchString;
            params.search_by = searchBy.name
        }
        const response = await fetch(`${url}/get-all-tramites/${user.id}?${new URLSearchParams(params)}`)
        const listado = await response.json()
        
        return listado
    }

    return { doSearchTramites }
   
  })

