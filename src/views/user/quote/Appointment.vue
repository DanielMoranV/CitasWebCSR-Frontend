<script setup>
import { useDataDoctorStore } from '../../../stores/dataDoctor';
import { useAuthStore } from '../../../stores/auth';
import { useDataUserStore } from '../../../stores/dataUser';
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
const dataUserStore = useDataUserStore();

const schedules = ref(null);
const timeSlot = ref(null);
const patients = ref(null);
const selectedTimeSlot = ref(null);
const selectedPatient = ref(null);
const autoFilteredValue = ref([]);
const autoFilteredPatientValue = ref([]);
const dependents = ref(null);
const availableSchedule = ref([]);
const disabledDates = ref([]);
const formattedAvailableSchedule = ref([]);
const medico = ref([]);
const date = ref();
const selectedDate = ref(null);
const startDay = ref(new Date());
const daysToAdd = 29;

// Calular las fechas a partir de mañana
startDay.value.setDate(startDay.value.getDate() + 1);
// Calcula la fecha una semana después de hoy
const endDay = new Date(startDay);
endDay.setDate(startDay.value.getDate() + daysToAdd);

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
    // Filtra los elementos de schedule.value que coincidan con la nueva fecha
    const filteredSchedules = schedules.value.filter((item) => {
        const itemDate = dformat(new Date(item.day), 'YYYY-MM-DD');
        return itemDate === formattedNewDate;
    });
    const timeSlotValues = [];
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
        } else {
            autoFilteredValue.value = timeSlot.value.filter((timeSlot) => {
                return timeSlot.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    } else {
        toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Seleccione una fecha de cita Médica', life: 3000 });
    }
};
const searchPatient = (event) => {
    if (!event.query.trim().length) {
        autoFilteredPatientValue.value = [...patients.value];
    } else {
        autoFilteredPatientValue.value = patients.value.filter((patient) => {
            return patient.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
};

// Observa el cambio en la variable date
watch(date, (newDate) => {
    selectedDate.value = newDate;
    handleDateChange(newDate);
});

const loading = ref(false);
const clickNext = async () => {
    if (!isValidData()) {
        toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Datos incompletos', life: 3000 });
        return;
    }
    loading.value = true;
    const payload = {
        origin: 'web',
        status: 'pendiente',
        createAt: new Date(),
        doctorId: medico.value.doctor_id,
        userId: dataAuthStore.user.userId,
        dependentId: null,
        timeSlotId: selectedTimeSlot.value.code,
        appointmentServices: {
            create: [
                {
                    medicalServiceId: 1
                }
            ]
        }
    };
    payload[selectedPatient.value.code === dataAuthStore.user.userId ? 'userId' : 'dependentId'] = selectedPatient.value.code;
    await dataAppointmentStore.addappointment(payload);
    router.push('/quote/payment');
    loading.value = false;
};
const isValidData = () => {
    // Lógica de validación aquí
    // Devuelve true si los datos son válidos, de lo contrario, false.
    return selectedPatient.value && selectedTimeSlot.value /* Otras condiciones de validación */;
};
const autoCompletePatients = ref(true);
onMounted(async () => {
    medico.value = dataDoctorStore.doctor[0];
    await dataDoctorStore.getDoctorScheduleAvailable(medico.value.doctor_id).then((data) => {
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
    for (let fecha = new Date(startDay.value); fecha <= endDay; fecha.setDate(fecha.getDate() + 1)) {
        dateArray.push(new Date(fecha));
    }
    // Formatea las fechas en availableSchedule para que coincidan con el formato de dateArray
    formattedAvailableSchedule.value = availableSchedule.value.map((fecha) => dformat(fecha, 'YYYY-MM-DD'));

    // Filtra las fechas disponibles
    disabledDates.value = dateArray.filter((fecha) => !formattedAvailableSchedule.value.includes(dformat(fecha, 'YYYY-MM-DD')));

    dependents.value = await dataUserStore.getUsersDependents(dataAuthStore.user.user.dni);
    const patientValues = [];
    patientValues.push({
        code: dataAuthStore.user.user.userId,
        name: dataAuthStore.user.user.name + ' ' + dataAuthStore.user.user.surnames
    });
    dependents.value.forEach((patient) => {
        patientValues.push({
            code: patient.dependentId,
            name: patient.name + ' ' + patient.surnames
        });
    });

    // Asigna timeSlotValues a timeSlot.value
    if (patientValues) {
        patients.value = patientValues;
        selectedPatient.value = patientValues[0];
        autoCompletePatients.value = false;
    }
});
</script>
<template>
    <div class="flex align-items-center py-5 px-3">
        <i class="pi pi-fw pi-check mr-2 text-2xl" />
        <p class="m-0 text-lg">Médico: {{ medico.medico }}</p>
    </div>
    <p class="text-yellow-500 font-medium text-xl">Las citas del dia {{ dformat(new Date(), 'DD/MM/YYYY') }} se recervan via Call Center llamado al 985586350</p>
    <div class="card p-fluid">
        <h6>Especialidad: {{ medico.specialization }}</h6>

        <h6>Detalle de consulta</h6>
        <div class="field grid">
            <label for="patients" class="col-12 mb-2 md:col-2 md:mb-0">Paciente</label>
            <div class="col-12 md:col-10">
                <Toast />
                <AutoComplete placeholder="Nombre del paciente" id="patients" :dropdown="true" v-model="selectedPatient" :suggestions="autoFilteredPatientValue" @complete="searchPatient($event)" field="name" :disabled="autoCompletePatients" />
            </div>
        </div>
        <div class="field grid">
            <label for="date" class="col-12 mb-2 md:col-2 md:mb-0">Fecha</label>
            <div class="col-12 md:col-10">
                <Calendar placeholder="Días disponibles" :showIcon="true" v-model="date" :manualInput="false" :minDate="startDay" :maxDate="endDay" :disabledDates="disabledDates">
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
        <Button label="Siguiente" icon="pi pi-arrow-right" class="p-button-success col-12 md:col-3 mr-2 mb-2" :loading="loading" @click="clickNext"></Button>
    </div>
</template>
<style>
.available-date:hover {
    background-color: green;
    color: white;
}
</style>
