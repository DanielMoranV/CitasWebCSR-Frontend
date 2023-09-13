/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { createUser, fetchUsers, getUser, updateUser, deleteUser, createPatients, fetchCollaborators, getDependents } from '../api';

export const useDataUserStore = defineStore('datauserStore', {
    state: () => ({
        dataUser: [],
        loadingDataUser: false,
        dependents: cache.getItem('dependents'),
        msg: null
    }),
    actions: {
        async getCollaborators() {
            if (this.dataUser.length === 0) {
                this.loadingDataUser = true;
                try {
                    const { data } = await fetchCollaborators();
                    this.dataUser = data;
                    return this.dataUser;
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loadingDataUser = false;
                }
            }
        },
        async getUsers() {
            if (this.dataUser.length === 0) {
                this.loadingDataUser = true;
                try {
                    const { data } = await fetchUsers();
                    this.dataUser = data;
                    return this.dataUser;
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loadingDataUser = false;
                }
            }
        },
        async getUsersDependents(userId) {
            if (this.dataUser.length === 0) {
                this.loadingDataUser = true;
                try {
                    const { data } = await getDependents(userId);
                    cache.setItem('dependents', data.dependents);
                    this.dependents = data.dependents;
                    return this.dependents;
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
        async addPatients(payload) {
            try {
                const { data, message } = await createPatients(payload);
                this.dataUser = data;
                this.msg = message;
            } catch (error) {
                console.log(error);
                this.msg = error.message;
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
