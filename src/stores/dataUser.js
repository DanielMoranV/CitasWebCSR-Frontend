/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia';
import { createUser, fetchUsers, getUser, updateUser, deleteUser } from '../api';

export const useDataauthStore = defineStore('dataauthStore', {
    state: () => ({
        dataUser: [],
        loadingDataUser: false
    }),
    actions: {
        async getUsers() {
            if (this.dataUser.length === 0) {
                this.loadingDataUser = true;
                try {
                    const { data } = await fetchUsers();
                    this.dataUser = data;
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loadingDataUser = false;
                }
            }
        },

        async addUsers(payload) {
            try {
                const { data } = await createUser(payload);
                this.dataUser = data;
            } catch (error) {
                console.log(error);
            } finally {
                console.log('Finalizado');
            }
        },
        async profileUser(dni) {
            try {
                const { data } = await getUser(dni);
                this.dataUser = data;
            } catch (error) {
                console.log(error.message);
            } finally {
                console.log('Finalizada la carga de datos del perfil');
            }
        },
        async updateUser(dni, payload) {
            try {
                const { data } = await updateUser(dni, payload);
                this.dataUser = this.dataUser.map((item) => (item.dni === dni ? { ...item, ...data } : item));
            } catch (error) {
                console.log(error.message);
            }
        },
        async deleteUser(dni) {
            try {
                await deleteUser(dni);
                this.dataUser = this.dataUser.filter((item) => item.dni !== dni);
            } catch (error) {
                console.log(error.message);
            } finally {
                console.log('Finalizado');
            }
        }
    }
});
