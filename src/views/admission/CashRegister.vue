<script setup>
import { useDataAdmissionistStore } from '../../stores/dataAdmissionist';
import { useAuthStore } from '../../stores/auth';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const dataAdmissionistStore = useDataAdmissionistStore();
const dataAuthStore = useAuthStore();
const disabledBtnNewRegister = ref(true);
const oldCashRegister = ref(null);

const todayCashRegister = ref();
const newCashRegister = async () => {
    const { accessId } = dataAuthStore.user;
    const { value: oldRegister } = oldCashRegister;

    const payload = {
        admissionistId: accessId,
        currentBalance: 0,
        openingBalance: oldRegister ? oldRegister.closingBalance : 0
    };

    todayCashRegister.value = await dataAdmissionistStore.createCashRegister(payload);
    disabledBtnNewRegister.value = true;
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Registro de caja aperturado', life: 3000 });
    console.log(todayCashRegister.value);
};
const currencyFormat = (valor) => {
    valor = valor / 100;
    return valor.toLocaleString('es-PE', {
        style: 'currency',
        currency: 'PEN'
    });
};

onMounted(async () => {
    oldCashRegister.value = await dataAdmissionistStore.getPreviousCashRegisterForAdmissionist(dataAuthStore.user.accessId);
    todayCashRegister.value = await dataAdmissionistStore.getTodayCashRegisterForAdmissionist(dataAuthStore.user.accessId);
    if (todayCashRegister.value === null) {
        disabledBtnNewRegister.value = false;
        oldCashRegister.value = await dataAdmissionistStore.getCashRegisterForAdmissionist(dataAuthStore.user.accessId);
    } else {
        disabledBtnNewRegister.value = true;
        todayCashRegister.value.currentBalance = await dataAdmissionistStore.sumIngressAmountByCashRegisterId(todayCashRegister.value.cashRegisterId);
    }

    //console.log(await dataAdmissionistStore.getCashRegisters());
});
</script>
<template>
    <div class="card">
        <div class="flex align-items-center justify-content-between mb-4">
            <h5>Caja Registradora</h5>
            <div>
                <Toast />
                <Button icon="pi pi-plus" class="p-button-text p-button-plain p-button-rounded" :disabled="disabledBtnNewRegister" @click="newCashRegister"></Button>
            </div>
        </div>

        <span class="block text-600 font-medium mb-3">
            {{ todayCashRegister !== null && todayCashRegister !== undefined ? `HOY (Registro de caja N°: ${todayCashRegister.cashRegisterId})` : 'HOY (Registro de caja aún sin generar)' }}
        </span>
        <ul class="p-0 mx-0 mt-0 mb-4 list-none">
            <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-green-100 border-circle mr-3 flex-shrink-0">
                    <i class="pi pi-dollar text-xl text-green-500"></i>
                </div>
                <span class="text-900 line-height-3"
                    >Balance de apertura
                    <span class="text-blue-500"> {{ todayCashRegister !== null && todayCashRegister !== undefined ? `${currencyFormat(todayCashRegister.openingBalance)}` : 'S/. --.--' }}</span>
                    <!-- <span class="text-700">has purchased a black jacket for </span> -->
                </span>
            </li>
            <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-yellow-100 border-circle mr-3 flex-shrink-0">
                    <i class="pi pi-chart-line text-xl text-yellow-500"></i>
                </div>
                <span class="text-900 line-height-3"
                    >Balance de actual
                    <span class="text-blue-500"> {{ todayCashRegister !== null && todayCashRegister !== undefined ? `${currencyFormat(todayCashRegister.currentBalance)}` : 'S/. --.--' }}</span>
                </span>
            </li>
            <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                    <i class="pi pi-wallet text-xl text-pink-500"></i>
                </div>
                <span class="text-900 line-height-3"
                    >Balance de Cierre (Saldo en Caja)
                    <span class="text-red-500"> {{ todayCashRegister !== null && todayCashRegister !== undefined ? `${currencyFormat(todayCashRegister.closingBalance)}` : 'S/. --.--' }}</span>
                </span>
            </li>
        </ul>

        <span class="block text-600 font-medium mb-3"> {{ oldCashRegister !== null && oldCashRegister !== undefined ? `AYER (Registro de caja N°: ${oldCashRegister.cashRegisterId})` : 'AYER (Registro de caja aún sin generar)' }}</span>
        <ul class="p-0 m-0 list-none">
            <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-green-100 border-circle mr-3 flex-shrink-0">
                    <i class="pi pi-dollar text-xl text-green-500"></i>
                </div>
                <span class="text-900 line-height-3"
                    >Balance de apertura
                    <span class="text-blue-500"> {{ oldCashRegister !== null && oldCashRegister !== undefined ? `${currencyFormat(oldCashRegister.openingBalance)}` : 'S/. --.--' }}</span>
                    <!-- <span class="text-700">has purchased a black jacket for </span> -->
                </span>
            </li>
            <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-yellow-100 border-circle mr-3 flex-shrink-0">
                    <i class="pi pi-chart-line text-xl text-yellow-500"></i>
                </div>
                <span class="text-900 line-height-3"
                    >Balance de actual
                    <span class="text-blue-500"> {{ oldCashRegister !== null && oldCashRegister !== undefined ? `${currencyFormat(oldCashRegister.currentBalance)}` : 'S/. --.--' }}</span>
                </span>
            </li>
            <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                    <i class="pi pi-wallet text-xl text-pink-500"></i>
                </div>
                <span class="text-900 line-height-3"
                    >Balance de Cierre (Saldo en Caja)
                    <span class="text-red-500"> {{ oldCashRegister !== null && oldCashRegister !== undefined ? `${currencyFormat(oldCashRegister.closingBalance)}` : 'S/. --.--' }}</span>
                </span>
            </li>
        </ul>
    </div>
</template>
