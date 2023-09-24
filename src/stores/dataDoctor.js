/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { getInfoDoctors, getInfoDoctor, getDoctors } from '../api';

export const useDataDoctorStore = defineStore({
    id: 'doctors',
    state: () => ({
        doctors: cache.getItem('doctors'),
        doctor: cache.getItem('doctor'),
        msg: {},
        role: 'Invitado',
        loadingUser: false
    }),
    getters: {
        getEsential(state) {
            return {
                name: `${state.doctors.doctor.name} ${state.doctors.doctor.surnames}`,
                role: state.doctors.role.name
            };
        }
    },
    actions: {
        async getInfoDoctors() {
            try {
                const { data } = await getInfoDoctors();
                cache.setItem('doctors', data);
                this.doctors = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getDoctors() {
            try {
                const { data } = await getDoctors();
                cache.setItem('doctors', data);
                this.doctors = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getInfoDoctor(cmp) {
            try {
                const { data } = await getInfoDoctor(cmp);
                cache.setItem('doctor', data);
                this.doctor = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        }
        // buscar si el dni existe
    }
});
