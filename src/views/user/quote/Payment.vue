<script setup>
import { ref, onMounted } from 'vue';

const displayPaymentMethod = ref(false);
const displayYape = ref(false);
const displayCard = ref(false);

const close = () => {
    displayPaymentMethod.value = false;
};
const openYape = () => {
    displayYape.value = true;
    close();
};
const openCard = () => {
    displayCard.value = true;
    close();
};
const openPaymentMethod = () => {
    displayPaymentMethod.value = true;
};
</script>
<template>
    <div class="flex align-items-center py-5 px-3">
        <i class="pi pi-fw pi-money-bill mr-2 text-2xl" />
        <p class="m-0 text-lg">Pago de consultas médicas</p>
    </div>
    <div class="grid justify-content-center">
        <div class="col-12 md:col-6 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
            <div style="height: 230px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))">
                <div class="p-3 surface-card h-full" style="border-radius: 8px">
                    <h5 class="mb-2 text-900">Ticket Nº : 001-0001</h5>
                    <p class="mt-4 mb-1">Medico :</p>
                    <p class="mb-1">Especialidad :</p>
                    <p class="mb-1">Paciente :</p>
                    <p class="mb-1">Tipo de servicio :</p>
                    <span>Fecha: 06-09-2023 </span>
                    <span class="ml-4">Hora: </span>
                    <p>Total:</p>
                </div>
            </div>
        </div>
    </div>
    <Dialog header="Método de pago" v-model:visible="displayPaymentMethod" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <p class="line-height-3 m-0">Si el pago se realiza con tarjeta de crédito o débito, por favor ingrese los datos del titular</p>
        <Button label="Tarjeta" class="p-button-raised p-button-success mr-2 mt-3 col-12 md:col-5" @click="openCard" />
        <Button label="Yape" class="p-button-raised p-button-primary mr-2 col-12 md:col-6" @click="openYape" />
    </Dialog>
    <Dialog header="Yape" v-model:visible="displayYape" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <p class="line-height-3 m-0">Paga con tu Código de aprobación</p>
        <p class="line-height-3 m-0">• Encuéntralo en el menú de tu aplicación Yape.</p>
        <p class="line-height-3 m-0">• Copia el código y pégalo abajo.</p>

        <div class="formgrid grid mt-5">
            <div class="field col">
                <label for="phoneyape">Ingresa tu celular Yape</label>
                <InputText id="phoneyape" type="text" placeholder="+51" />
            </div>
            <div class="field col">
                <label for="codapro">Código de aprobación</label>
                <InputText id="codapro" type="text" />
            </div>
        </div>
        <Button label="Yapear S/. 120.00" icon="pi pi-money-bill" class="p-button-primary col-12" :loading="loading"></Button>
    </Dialog>
    <Dialog header="Método de pago" v-model:visible="displayCard" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <p class="line-height-3 m-0">tarjeta</p>
    </Dialog>
    <Button label="Método de pago" icon="pi pi-money-bill" class="p-button-success col-12 md:col-3 mr-2 mb-2" :loading="loading" @click="openPaymentMethod"></Button>
</template>
