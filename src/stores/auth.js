/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { sigin, currentUser, updateAccessUser } from '../api';
//import useResponse from '../composables/useResponse';
export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: cache.getItem('user'),
        msg: {},
        role: 'Invitado',
        returnUrl: '',
        sessionUser: false,
        loadingUser: false
    }),
    getters: {
        hasRole: (state) => (roles) => {
            if (!state.user || !state.user.role) return false;
            return roles.includes(state.user.role);
        },
        getEsential(state) {
            return {
                name: `${state.user.user.name} ${state.user.user.surnames}`
            };
        },
        token(state) {
            if (state.user) {
                return state.user.token;
            }
        }
    },
    actions: {
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
            this.user = null;
            this.sessionUser = false;
            this.role = 'Invitado';
            cache.cleanAll();
        },
        async currentUser() {
            try {
                const { data } = await currentUser();
                //const token = this.user.token;
                const email = data.user.email;
                const phone = data.user.phone;
                this.user.user.email = email;
                this.user.user.phone = phone;
                this.sessionUser = true;
                this.role = this.user.role.name;
            } catch (error) {
                //console.log(error);
                this.user = null;
                this.sessionUser = false;
                this.role = 'Invitado';
            }
        },
        async updateAccessUser(payload) {
            try {
                const username = this.user.username;
                console.log(username);
                console.log(this.user);
                const updatePassword = { password: payload };
                const { data } = await updateAccessUser(username, updatePassword);
                return data.count;
            } catch (error) {
                console.log(error);
            }
        }
    }
});
