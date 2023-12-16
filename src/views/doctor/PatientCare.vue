<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useDataAppointmentStore } from '../../stores/dataAppointment';

const dataAppointmentStore = useDataAppointmentStore();
onMounted(async () => {
    console.log(dataAppointmentStore.appointment);
});
</script>
<template>
    <div>holiwi</div>
</template>
