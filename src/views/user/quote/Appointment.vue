<script setup>
import { useDataDoctorStore } from '../../../stores/dataDoctor';
import { useAuthStore } from '../../../stores/auth';
import { useDataAppointmentStore } from '../../../stores/dataAppointment';
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { dformat } from '../../../utils/day';

import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const dataDoctorStore = useDataDoctorStore();
const dataAuthStore = useAuthStore();
const dataAppointmentStore = useDataAppointmentStore();

const schedules = ref(null);
const timeSlot = ref(null);
const selectedTimeSlot = ref(null);
const autoFilteredValue = ref([]);
const schedule = ref(null);
const availableSchedule = ref([]);
const disabledDates = ref([]);
const formattedAvailableSchedule = ref([]);
const medico = ref([]);
const date = ref();
const selectedDate = ref(null);
const today = new Date();
const daysToAdd = 29;

// Calcula la fecha una semana después de hoy
const oneWeekLater = new Date(today);
oneWeekLater.setDate(today.getDate() + daysToAdd);

const formattedDate = computed(() => {
    return (date) => {
        const year = date.year;
        const month = (date.month + 1).toString().padStart(2, '0');
        const day = date.day.toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
});

// Función que se ejecutará cuando date cambie
const handleDateChange = (newDate) => {
    // Realiza alguna acción en respuesta al cambio de fecha
    const formattedNewDate = dformat(newDate, 'YYYY-MM-DD');
    console.log(schedules.value);
    // Filtra los elementos de schedule.value que coincidan con la nueva fecha
    const filteredSchedules = schedules.value.filter((item) => {
        const itemDate = dformat(new Date(item.day), 'YYYY-MM-DD');
        return itemDate === formattedNewDate;
    });

    // Ahora, filteredSchedules contiene los elementos de schedule.value que coinciden con la nueva fecha
    const timeSlotValues = [];
    console.log(filteredSchedules);
    filteredSchedules[0].timeSlot.forEach((slot) => {
        timeSlotValues.push({
            code: slot.timeSlotId,
            name: dformat(slot.orderlyTurn, 'hh:mm A')
        });
    });
    // Asigna timeSlotValues a timeSlot.value
    timeSlot.value = timeSlotValues;
};
const searchTimeSlot = (event) => {
    if (timeSlot.value) {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...timeSlot.value];
            console.log(autoFilteredValue.value);
        } else {
            autoFilteredValue.value = timeSlot.value.filter((timeSlot) => {
                return timeSlot.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    } else {
        toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Seleccione una fecha de cita Médica', life: 3000 });
    }
};

// Observa el cambio en la variable date
watch(date, (newDate) => {
    selectedDate.value = newDate;
    handleDateChange(newDate);
});

const loading = ref(false);
const clickNext = async () => {
    console.log(date.value);
    console.log(selectedTimeSlot.value.code);
    loading.value = true;
    const payload = {
        origin: 'web',
        status: 'pendiente',
        createAt: new Date(),
        doctorId: medico.value.doctor_id,
        userId: dataAuthStore.user.userId,
        timeSlotId: selectedTimeSlot.value.code,
        appointmentServices: {
            create: [
                {
                    medicalServiceId: 1
                }
            ]
        }
    };
    console.log(payload);
    await dataAppointmentStore.addappointment(payload);
    router.push('/quote/payment');
    loading.value = false;
};

onMounted(async () => {
    medico.value = dataDoctorStore.doctor[0];
    await dataDoctorStore.getDoctorSchedule(medico.value.doctor_id).then((data) => {
        schedules.value = data.map((schedule) => {
            let startTime = dformat(schedule.startTime, 'hh:mm A');
            let endTime = dformat(schedule.endTime, 'hh:mm A');
            schedule.startTime = startTime;
            schedule.endTime = endTime;
            availableSchedule.value.push(new Date(schedule.day));
            return schedule;
        });
    });

    // Crea un array de fechas desde today hasta oneWeekLater
    const dateArray = [];
    for (let fecha = new Date(today); fecha <= oneWeekLater; fecha.setDate(fecha.getDate() + 1)) {
        dateArray.push(new Date(fecha));
    }
    // Formatea las fechas en availableSchedule para que coincidan con el formato de dateArray
    formattedAvailableSchedule.value = availableSchedule.value.map((fecha) => dformat(fecha, 'YYYY-MM-DD'));

    // Filtra las fechas disponibles
    disabledDates.value = dateArray.filter((fecha) => !formattedAvailableSchedule.value.includes(dformat(fecha, 'YYYY-MM-DD')));
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
                <Calendar :showIcon="true" v-model="date" :manualInput="false" :minDate="today" :maxDate="oneWeekLater" :disabledDates="disabledDates">
                    <template #date="slotProps">
                        <div v-if="formattedAvailableSchedule.includes(formattedDate(slotProps.date))" style="padding: 50%; color: green; font-size: 1.1em; background-color: lightgreen; border-radius: 50%" class="available-date">
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
                <Toast />
                <AutoComplete placeholder="Hora disponible" id="timeSlot" :dropdown="true" v-model="selectedTimeSlot" :suggestions="autoFilteredValue" @complete="searchTimeSlot($event)" field="name" />
            </div>
        </div>
        <div class="field grid">
            <label for="hour" class="col-12 mb-2 md:col-2 md:mb-0">Precio Consulta</label>
            <div class="col-12 md:col-10"><InputText id="price" type="text" v-model="medico.price" :disabled="true" /></div>
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
