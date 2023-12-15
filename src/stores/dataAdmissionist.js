import { defineStore } from 'pinia';
import cache from '../utils/cache';
import {
    getCashRegister,
    getCashRegisters,
    updateCashRegister,
    createCashRegister,
    getTodayCashRegisterForAdmissionist,
    getCashRegisterForAdmissionist,
    getPreviousCashRegisterForAdmissionist,
    createCashRegisterTransaction,
    sumIngressAmountByCashRegisterId
} from '../api';

export const useDataAdmissionistStore = defineStore({
    id: 'admissionist',
    state: () => ({
        cashRegisters: cache.getItem('cashRegisters'),
        cashRegister: cache.getItem('cashRegister'),
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
        async getCashRegisters() {
            try {
                const { data } = await getCashRegisters();
                cache.setItem('cashRegisters', data);
                this.cashRegisters = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getCashRegister(cashRegisterId) {
            try {
                const { data } = await getCashRegister(cashRegisterId);
                console.log(data);
                cache.setItem('cashRegister', data);
                this.cashRegister = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async sumIngressAmountByCashRegisterId(cashRegisterId) {
            try {
                const { data } = await sumIngressAmountByCashRegisterId(cashRegisterId);
                this.cashRegister = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getPreviousCashRegisterForAdmissionist(admissionistId) {
            try {
                const { data } = await getPreviousCashRegisterForAdmissionist(admissionistId);
                cache.setItem('cashRegister', data);
                this.cashRegister = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getTodayCashRegisterForAdmissionist(admissionistId) {
            try {
                const { data } = await getTodayCashRegisterForAdmissionist(admissionistId);
                cache.setItem('cashRegister', data);
                this.cashRegister = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async getCashRegisterForAdmissionist(admissionistId) {
            try {
                const { data } = await getCashRegisterForAdmissionist(admissionistId);
                cache.setItem('cashRegister', data);
                this.cashRegister = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async updateCashRegister(cashRegisterId, payload) {
            try {
                const { data } = await updateCashRegister(cashRegisterId, payload);
                console.log(data);
                cache.setItem('cashRegister', data);
                this.cashRegister = data;
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async createCashRegister(payload) {
            try {
                const { data } = await createCashRegister(payload);
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        async createCashRegisterTransaction(payload) {
            try {
                const { data } = await createCashRegisterTransaction(payload);
                return data;
            } catch (error) {
                console.log(error);
            }
        }

        // buscar si el dni existe
    }
});
