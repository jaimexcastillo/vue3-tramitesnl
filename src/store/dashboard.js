import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useDashboard = defineStore('dashboard', () => {

    const userStorage = sessionStorage.getItem('user')
    const user = JSON.parse(userStorage)?.user
    const url = 'http://10.153.162.47'
   //​http://10.153.162.47/solicitudes-filtrar/count

    async function doSearchTramitesDashboard(){
        console.log('dashboard js');
        //$solicitudes = curlSendRequest('POST', getenv("TESORERIA_HOSTNAME")."/solicitudes-filtrar/count", [
    	// 	"data" => [
    	// 		[ "estatus" => 80, "id_usuario" => (int)$user->id , "max" => (int)5 ],
    	// 		[ "estatus" => 99, "id_usuario" => (int)$user->id , "max" => (int)5 ],
    	// 		[ "estatus" => 5, "id_usuario" => (int)$user->id  , "max" => (int)5],
    	// 		[ "estatus" => 3, "id_usuario" => (int)$user->id  , "max" => (int)5],
    	// 		[ "estatus" => 1, "id_usuario" => (int)$user->id  , "max" => (int)5],
    	// 		[ "estatus" => 98, "id_usuario" => (int)$user->id , "max" => (int)5 ]
    	// 		// [ "estatus" => 2, "id_usuario" => (int)$user->id ] //se comenta para que no haga la consulta por estatus de finalizado porque truena al entrar al dashboard
    	// 	]
    	// ]);

        const data = [
                { estatus : 80, id_usuario: 113, max: 5 },
                { estatus : 99, id_usuario: 113, max: 5 },
                { estatus : 5, id_usuario: 113, max: 5 },
                { estatus : 3, id_usuario: 113, max: 5 },
                { estatus : 1, id_usuario: 113, max: 5 },
                { estatus : 98, id_usuario: 113, max: 5 }
        ]
        let info = {}
        info['data'] = data
        
        const response = await fetch(`${url}/solicitudes-filtrar/count`,{
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const listado = await response.json()
        console.log(listado);
        return listado
    }

    return { doSearchTramitesDashboard }
   
  })

