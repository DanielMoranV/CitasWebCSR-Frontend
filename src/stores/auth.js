import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { sigin, currentUser, updateAccessUser, updateUser, urlProfilePhoto } from '../api';
import axios from 'axios';
//import useResponse from '../composables/useResponse';
export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: cache.getItem('user'),
        msg: {},
        role: 'Invitado',
        returnUrl: '',
        sessionUser: false,
        loadingUser: false,
        urlProfilePhoto: ''
    }),
    getters: {
        hasRole: (state) => (roles) => {
            if (!state.user || !state.user.role) return false;
            return roles.includes(state.user.role);
        },
        getEsential(state) {
            return {
                name: `${state.user.user.name} ${state.user.user.surnames}`,
                role: state.user.role.name
            };
        },
        token(state) {
            if (state.user) {
                return state.user.token;
            }
        }
    },
    actions: {
        async searchbydni(dni) {
            try {
                const data = await axios.get(`https://api-utilidades.serveo.net/api/v1/users/searchbydni/${dni}`);
                //const data = await axios.get(`https://api-utilidades.serveo.net/api/v1/users/searchbydni/${dni}`);
                return data.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async login(payload) {
            try {
                const { data } = await sigin(payload);
                cache.setItem('user', data);
                this.user = data;
                this.sessionUser = true;
                this.role = this.user.role.name;
            } catch (error) {
                this.msg = error.message;
                this.user = null;
                this.sessionUser = false;
            }
        },
        async logout() {
            if (this.user?.username) {
                const payload = { status: 'offline' };
                await updateAccessUser(this.user.username, payload);
            }

            this.user = null;
            this.sessionUser = false;
            this.role = 'Invitado';
            cache.cleanAll();
        },
        async currentUser(dni) {
            try {
                const { data } = await currentUser(dni);
                //const token = this.user.token;
                const email = data.user.email;
                const phone = data.user.phone;
                const birthDate = data.user.birthDate;
                const photo = data.user.photo;
                this.user.user.email = email;
                this.user.user.phone = phone;
                this.user.user.birthDate = birthDate;
                this.user.user.photo = photo;
                this.sessionUser = true;
                this.role = this.user.role.name;
            } catch (error) {
                this.user = null;
                this.sessionUser = false;
                this.role = 'Invitado';
            }
        },
        async updateAccessUser(payload) {
            try {
                const username = this.user.username;
                const { data } = await updateAccessUser(username, payload);
                return data.count;
            } catch (error) {
                console.log(error);
            }
        },
        async updateDataUser(payload) {
            try {
                const dni = this.user.user.dni;
                const { data } = await updateUser(dni, payload);
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getUrlProfilePhoto() {
            try {
                const namePhoto = this.user.user.photo;
                const { url } = await urlProfilePhoto(namePhoto);
                this.urlProfilePhoto = url;
                console.log(url);
                return url;
            } catch (error) {
                console.log(error);
            }
        }
        // buscar si el dni existe
    }
});
