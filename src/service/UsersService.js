import axios from 'axios';

export default class UserService {
    getUsers() {
        // URL de la API que deseas consumir
        const apiUrl = 'http://localhost:8080/api/v1/users';
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
