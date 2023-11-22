import axios from 'axios';
import backendURL from '../config';
export default class UserService {
    getUsers() {
        // URL de la API que deseas consumir
        const apiUrl = `${backendURL}/api/v1/users`;
        axios
            .get(apiUrl)
            .then((response) => {
                // Aquí puedes trabajar con los datos obtenidos de la API
                return response.data;
            })
            .catch((error) => {
                // Manejar errores en caso de que ocurran durante la solicitud
                return console.error('Error al consumir la API:', error);
            });
    }
}
