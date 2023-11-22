import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { apiGetInfoDoctors, apiGetInfoDoctor, apiGetDoctors, apiGetDoctorSchedule, apiCreatetDoctorSchedule } from '../api';

export const useDataDoctorStore = defineStore({
    id: 'doctors',
    state: () => ({
        doctors: null,
        doctor: cache.getItem('doctor'),
        schedule: cache.getItem('schedule'),
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
                const { data } = await apiGetInfoDoctors();
                cache.setItem('doctors', data);
                this.doctors = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getDoctors() {
            try {
                const { data } = await apiGetDoctors();
                console.log(data);
                cache.setItem('doctors', data);
                this.doctors = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getInfoDoctor(cmp) {
            try {
                const { data } = await apiGetInfoDoctor(cmp);
                cache.setItem('doctor', data);
                this.doctor = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getDoctorSchedule(doctorId) {
            try {
                const { data } = await apiGetDoctorSchedule(doctorId);
                cache.setItem('schedule', data);
                this.schedule = data;
                return this.schedule;
            } catch (error) {
                console.log(error);
            }
        },
        async addDoctorSchedule(payload) {
            try {
                const { data } = await apiCreatetDoctorSchedule(payload);
                return data;
            } catch (error) {
                console.log(error);
            }
        }

        // buscar si el dni existe
    }
});
