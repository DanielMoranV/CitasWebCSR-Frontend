/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { createPayment, createappointment, getAppointmentId } from '../api';

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
        async addPayment(payload) {
            try {
                const data = await createPayment(payload);
                cache.setItem('payload', data);
                this.payment = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        }

        // buscar si el dni existe
    }
});
