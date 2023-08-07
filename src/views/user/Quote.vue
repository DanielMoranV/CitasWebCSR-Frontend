<script setup>
import { ref } from 'vue';
const nestedRouteItems = ref([
    {
        label: 'Especialidad',
        to: '/quotes'
    },
    {
        label: 'Agendar Cita',
        to: '/quote/appointment'
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
        <p>Steps and TabMenu are integrated with the same child routes.</p>
        <Steps :model="nestedRouteItems" :readonly="false" />
        <router-view />
    </div>
</template>
