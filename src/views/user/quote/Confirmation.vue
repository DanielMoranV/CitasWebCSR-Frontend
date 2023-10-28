<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const clickNext = async () => {
    router.push('/tracking');
};
</script>
<template>
    <div class="flex align-items-center py-5 px-3">
        <i class="pi pi-fw pi-check mr-2 text-2xl" />
        <p class="m-0 text-lg">Pago realizado correctamente lo esperamos para su cita médica</p>
    </div>
    <p class="m-0 text-lg"><strong>Dirección:</strong> Av. Panamericana N° 332 - Urb. Santa Rosa, Sullana</p>
    <p class="m-0 text-lg"><strong>Call Center:</strong> 985 586 350</p>
    <p class="m-0 text-lg"><strong>Solicite su recibo por honorarios médicos con su DNI en admisión.</strong></p>
    <Button label="Segimiento Consulta" icon="pi pi-chart-line" class="p-button-success col-12 md:col-4 mr-2 mb-2 mt-2" @click="clickNext"></Button>
</template>
