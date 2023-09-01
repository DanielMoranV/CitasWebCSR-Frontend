/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { getInfoDoctors } from '../api';

export const useDataDoctorStore = defineStore({
    id: 'doctors',
    state: () => ({
        doctors: cache.getItem('doctors'),
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
                return data;
            } catch (error) {
                console.log(error);
            }
        }
        // buscar si el dni existe
    }
});
