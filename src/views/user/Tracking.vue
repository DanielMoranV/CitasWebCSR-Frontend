<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useDataAppointmentStore } from '../../stores/dataAppointment';
import { useAuthStore } from '../../stores/auth';
import { dformat } from '../../utils/day';

const router = useRouter();
const dataAuthStore = useAuthStore();
const dataAppointment = useDataAppointmentStore();
const appointmentLists = ref([]);
const attention = ref(null);
const dt = ref(null);
const filters = ref({});
const visibleInfo = ref(null);

onBeforeMount(() => {
    initFilters();
});
const exportCSV = () => {
    dt.value.exportCSV();
};
const openNew = () => {
    router.push('/listdoctor');
};
const medicalRecord = (data) => {
    console.log(data);
    attention.value = data;
    visibleInfo.value = true;
};
onMounted(async () => {
    await dataAppointment.getAppointmentUserId(dataAuthStore.user.user.userId).then((res) => (appointmentLists.value = res));

    appointmentLists.value.forEach((appointment) => {
        appointment.nameDoctor = `${appointment.doctor.user.surnames} ${appointment.doctor.user.name}`;
        if (appointment.dependent) {
            appointment.patient = `${appointment.dependent.name} ${appointment.dependent.surnames}`;
        } else {
            appointment.patient = `${appointment.user.name} ${appointment.user.surnames}`;
        }
        if (appointment.appointmentHistories.length >= 1) {
            console.log(appointment.appointmentHistories);
            appointment.reason = appointment.appointmentHistories[0].reason;
            appointment.treatment = appointment.appointmentHistories[0].treatment;
            appointment.diagnosis = appointment.appointmentHistories[0].diagnosis;
        }
    });
    console.log(appointmentLists.value);
});
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Agendar Cita Médica" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="appointmentLists"
                    dataKey="appointmentId"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del  {first} al {last} de {totalRecords} Atenciones"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Citas Médicas</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <Column field="timeSlot.nTurn" header="Nº" :sortable="true" headerStyle="width:5%; min-width:2rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº</span>
                            {{ slotProps.data.timeSlot.nTurn }}
                        </template>
                    </Column>
                    <Column field="patient" header="Paciente" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Paciente</span>
                            {{ slotProps.data.patient }}
                        </template>
                    </Column>
                    <Column field="status" header="Estado" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Estado</span>
                            <span :class="'user-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                        </template>
                    </Column>
                    <Column field="nameDoctor" header="Médico" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Médico</span>
                            {{ slotProps.data.nameDoctor }}
                        </template>
                    </Column>
                    <Column field="doctor.specialization" header="Especialidad" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Especialidad</span>
                            {{ slotProps.data.doctor.specialization }}
                        </template>
                    </Column>
                    <Column field="timeSlot.orderlyTurn" header="Fecha Consulta" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Consulta</span>
                            {{ dformat(slotProps.data.timeSlot.orderlyTurn, 'DD MMMM YYYY hh:mm a') }}
                        </template>
                    </Column>
                    <Column headerStyle="width:10%; min-width:5rem;" header="Resultados">
                        <template #body="slotProps">
                            <Button v-if="slotProps.data.status == 'atendido'" icon="pi pi-eye" class="p-button-rounded p-button-success mt-2" @click="medicalRecord(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="visibleInfo" modal header="Información de la consulta" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <h6>Motivo de la consulta:</h6>
                    <p>{{ attention.reason }}</p>
                    <h6>Diágnostico:</h6>
                    <p>{{ attention.diagnosis }}</p>
                    <h6>Tratamiento:</h6>
                    <p>{{ attention.treatment }}</p>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
