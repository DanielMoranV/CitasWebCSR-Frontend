/* eslint-disable prettier/prettier */
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
//import { useResponse } from '../composables/useResponse';

const api_url = 'https://csrapi.serveo.net/api/v1';

const instance = axios.create({
    baseURL: api_url,
    timeout: 10000
});

instance.interceptors.request.use(
    (config) => {
        const { token } = useAuthStore();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        let errData = {
            message: error.response.data.message || error.message,
            status_code: 'offline',
            success: false,
            details: null,
            data: null
        };
        if (error.response.me) {
            errData = error.response.data;

            if ([401, 403].indexOf(error.response.status) !== -1) {
                //useResponse().showAlert(errData);
                console.log('if', errData);
            }
        }
        return Promise.reject(errData);
    }
);

export default instance;
