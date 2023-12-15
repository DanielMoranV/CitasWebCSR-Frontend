/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { createPayment, createappointment, getAppointmentId, getAppointmentUserId, getAppointment, deleteAppointment, getLastPayment, createPaymentCash, getAppointmentDoctorId } from '../api';

export const useDataAppointmentStore = defineStore({
    id: 'appointment',
    state: () => ({
        appointments: cache.getItem('appointments'),
        appointment: cache.getItem('appointment'),
        payment: cache.getItem('payment'),
        msg: {},
        loadingUser: false
    }),
    // getters: {
    //     getEsential(state) {
    //         return {
    //             name: `${state.doctors.doctor.name} ${state.doctors.doctor.surnames}`,
    //             role: state.doctors.role.name
    //         };
    //     }
    // },
    actions: {
        async addappointment(payload) {
            try {
                const { data } = await createappointment(payload);
                cache.setItem('appointment', data);
                this.appointment = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getAppointmentId(appointmentId) {
            try {
                const { data } = await getAppointmentId(appointmentId);
                cache.setItem('appointment', data);
                this.appointment = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getAppointmentUserId(userId) {
            try {
                const { data } = await getAppointmentUserId(userId);
                cache.setItem('appointments', data);
                this.appointments = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getAppointmentDoctorId(userId) {
            try {
                const { data } = await getAppointmentDoctorId(userId);
                cache.setItem('appointments', data);
                this.appointments = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },

        async getAppointment() {
            try {
                const { data } = await getAppointment();
                cache.setItem('appointments', data);
                this.appointments = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },

        async addPayment(payload) {
            try {
                const { data } = await createPayment(payload);
                cache.setItem('payload', data);
                this.payment = data;
                return data;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
        async createPaymentCash(payload) {
            try {
                const { data } = await createPaymentCash(payload);
                cache.setItem('payload', data);
                this.payment = data;
                return data;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
        async getLastPayment() {
            try {
                const { data } = await getLastPayment();
                this.payment = data;
                return data;
            } catch (error) {
                console.log;
                return error;
            }
        },
        async deleteAppointmentId(AppointmentId) {
            try {
                await deleteAppointment(AppointmentId);
            } catch (error) {
                console.log(error.message);
            }
        }

        // buscar si el dni existe
    }
});
