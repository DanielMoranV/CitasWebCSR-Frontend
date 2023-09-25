/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { createUser, fetchUsers, getUser, updateUser, deleteUser, createPatients, fetchCollaborators, getDependents, createDependents, deleteDependent, updateAccessId } from '../api';

export const useDataUserStore = defineStore('datauserStore', {
    state: () => ({
        dataUser: cache.getItem('collaborator'),
        loadingDataUser: false,
        dependents: cache.getItem('dependents'),
        msg: null
    }),
    actions: {
        async getCollaborators() {
            this.loadingDataUser = true;
            try {
                const { data } = await fetchCollaborators();
                cache.setItem('collaborator', data);
                this.dataUser = data;
                return this.dataUser;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataUser = false;
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
        async addUsersDependents(payload) {
            try {
                const { data } = await createDependents(payload);
                return data;
                //this.getUsersDependents()
            } catch (error) {
                console.log(error);
            }
        },
        async updateUserDependents(dependentId, payload) {
            try {
                const { data } = await updateUser(dependentId, payload);
                this.dependents = this.dependents.map((item) => (item.dependentId === dependentId ? { ...item, ...data } : item));
                console.log(this.dependents);
            } catch (error) {
                console.log(error.message);
            }
        },
        async deleteUserDependents(dependentId) {
            try {
                await deleteDependent(dependentId);
                this.dataUser = this.dataUser.filter((item) => item.dni !== dependentId);
            } catch (error) {
                console.log(error.message);
            } finally {
                console.log('Finalizado');
            }
        },

        async addUsers(payload) {
            try {
                const { data } = await createUser(payload);
                this.dataUser = data;
                return data;
            } catch (error) {
                console.log(error);
            } finally {
                console.log('Finalizado');
            }
        },
        async updateUser(userId, accessId, payload) {
            try {
                const { access, Doctor, ...user } = payload;
                console.log(payload);
                const { personalizedPrices, ...dataDoctor } = Doctor;
                console.log(user);
                console.log(access);
                console.log(personalizedPrices[0]);
                console.log(dataDoctor);
                await updateUser(userId, user);
                await updateAccessId(accessId, access);
            } catch (error) {
                console.log(error.message);
            }
        },
        async disableUser(accessId) {
            try {
                const payload = { active: false };
                await updateAccessId(accessId, payload);
            } catch (error) {
                console.log(error.message);
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
