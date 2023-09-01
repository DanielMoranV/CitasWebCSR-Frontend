<script setup>
import { useDataDoctorStore } from '../../../stores/dataDoctor';
import { onMounted, ref } from 'vue';
const dataDoctorStore = useDataDoctorStore();
const medico = ref([]);
console.log(dataDoctorStore.doctor[0].medico);
onMounted(() => {
    //const data = await dataDoctorStore.getInfoDoctors();
    medico.value = dataDoctorStore.doctor[0];
    console.log(medico.value);
});
</script>
<template>
    <div class="flex align-items-center py-5 px-3">
        <i class="pi pi-fw pi-check mr-2 text-2xl" />
        <p class="m-0 text-lg">Médico: {{ medico.medico }}</p>
    </div>
</template>
