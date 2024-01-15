import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { apiGetInfoDoctors, apiGetInfoDoctor, apiGetDoctors, apiGetDoctorSchedule, apiCreatetDoctorSchedule, apiUpdateSchedule, apiGetDoctorScheduleAvailable } from '../api';

export const useDataDoctorStore = defineStore({
    id: 'doctors',
    state: () => ({
        doctors: cache.getItem('doctors'),
        doctor: cache.getItem('doctor'),
        schedule: cache.getItem('schedule'),
        msg: {},
        msgError: null,
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
                this.msgError = error;
            }
        },
        async getDoctors() {
            try {
                const { data } = await apiGetDoctors();
                cache.setItem('doctors', data);
                this.doctors = data;
                return data;
            } catch (error) {
                this.msgError = error;
            }
        },
        async getInfoDoctor(cmp) {
            try {
                const { data } = await apiGetInfoDoctor(cmp);
                cache.setItem('doctor', data);
                this.doctor = data;
                return data;
            } catch (error) {
                this.msgError = error;
            }
        },
        async getDoctorSchedule(doctorId) {
            try {
                const { data } = await apiGetDoctorSchedule(doctorId);
                cache.setItem('schedule', data);
                this.schedule = data;
                return this.schedule;
            } catch (error) {
                this.msgError = error;
            }
        },
        async getDoctorScheduleAvailable(doctorId) {
            try {
                const { data } = await apiGetDoctorScheduleAvailable(doctorId);
                cache.setItem('schedule', data);
                this.schedule = data;
                return this.schedule;
            } catch (error) {
                this.msgError = error;
            }
        },
        async updateSchedule(scheduleId, payload) {
            try {
                const { data } = await apiUpdateSchedule(scheduleId, payload);
                cache.setItem('schedule', data);
                this.schedule = data;
                return this.schedule;
            } catch (error) {
                this.msgError = error;
            }
        },
        async addDoctorSchedule(payload) {
            try {
                const { data } = await apiCreatetDoctorSchedule(payload);
                return data;
            } catch (error) {
                this.msgError = error;
            }
        }

        // buscar si el dni existe
    }
});
