<script setup>
import { ref } from 'vue';
const nestedRouteItems = ref([
    {
        label: 'Agendar Cita',
        to: '/quotes'
    },
    {
        label: 'Pago',
        to: '/quote/payment'
    },
    {
        label: 'Confirmación',
        to: '/quote/confirmation'
    }
]);
</script>

<template>
    <div class="card card-w-title">
        <h5>Registro de Citas medicas</h5>
        <br />
        <Steps :model="nestedRouteItems" :readonly="true" />
        <router-view />
    </div>
</template>
