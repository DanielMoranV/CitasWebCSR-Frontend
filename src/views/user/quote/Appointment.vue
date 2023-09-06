<script setup>
import { useDataDoctorStore } from '../../../stores/dataDoctor';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

import CountryService from '@/service/CountryService';
const countryService = new CountryService();

const dataDoctorStore = useDataDoctorStore();
const medico = ref([]);
const listboxServices = ref([]);

const date = ref();
const today = new Date();
const daysToAdd = 15;

// Calcula la fecha una semana después de hoy
const oneWeekLater = new Date(today);
oneWeekLater.setDate(today.getDate() + daysToAdd);

// Array de fechas disponibles para el médico
const availableDates = ['2023-09-05', '2023-09-07', '2023-09-10'];

// Crea un array de fechas desde today hasta oneWeekLater
const fechasArray = [];
for (let fecha = new Date(today); fecha <= oneWeekLater; fecha.setDate(fecha.getDate() + 1)) {
    fechasArray.push(new Date(fecha));
}

// Filtra las fechas disponibles
const fechasDeshabilitadas = fechasArray.filter((fecha) => !availableDates.includes(fecha.toISOString().split('T')[0]));
const formattedDate = computed(() => {
    return (date) => {
        const year = date.year;
        const month = (date.month + 1).toString().padStart(2, '0');
        const day = date.day.toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
});

const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const searchCountry = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...autoValue.value];
        } else {
            autoFilteredValue.value = autoValue.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};
const loading = ref(false);
const clickNext = async () => {
    loading.value = true;

    setTimeout(() => router.push('/quote/payment'), 2000);
    setTimeout(() => (loading.value = false), 1000);
};

onMounted(() => {
    countryService.getCountries().then((data) => (autoValue.value = data));
    console.log(autoValue.value);

    medico.value = dataDoctorStore.doctor[0];

    listboxServices.value = dataDoctorStore.doctor.map((service) => ({
        name: `${service.name} S/.${service.price}`,
        medical_service_id: service.medical_service_id
    }));
});
</script>
<template>
    <div class="flex align-items-center py-5 px-3">
        <i class="pi pi-fw pi-check mr-2 text-2xl" />
        <p class="m-0 text-lg">Médico: {{ medico.medico }}</p>
    </div>

    <div class="card p-fluid">
        <h6>Especialidad: {{ medico.specialization }}</h6>

        <h6>Detalle de consulta</h6>
        <div class="field grid">
            <label for="date" class="col-12 mb-2 md:col-2 md:mb-0">Fecha</label>
            <div class="col-12 md:col-10">
                <Calendar :showIcon="true" v-model="date" :manualInput="false" :minDate="today" :maxDate="oneWeekLater" :disabledDates="fechasDeshabilitadas">
                    <template #date="slotProps">
                        <div v-if="availableDates.includes(formattedDate(slotProps.date))" style="padding: 50%; color: green; font-size: 1.1em; background-color: lightgreen; border-radius: 50%" class="available-date">
                            {{ slotProps.date.day }}
                        </div>
                        <div v-else>{{ slotProps.date.day }}</div>
                    </template>
                </Calendar>
            </div>
        </div>
        <div class="field grid">
            <label for="hour" class="col-12 mb-2 md:col-2 md:mb-0">Horario</label>
            <div class="col-12 md:col-10">
                <AutoComplete placeholder="Hora disponible" id="dd" :dropdown="true" v-model="selectedAutoValue" :suggestions="autoFilteredValue" @complete="searchCountry($event)" field="name" />
            </div>
        </div>
    </div>
    <Button label="Siguiente" icon="pi pi-arrow-right" class="p-button-success col-12 md:col-3 mr-2 mb-2" :loading="loading" @click="clickNext"></Button>
</template>
<style>
.available-date:hover {
    background-color: green;
    color: white;
}
</style>
