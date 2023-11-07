<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useDataAppointmentStore } from '../../stores/dataAppointment';
import { useDataDoctorStore } from '../../stores/dataDoctor';
import { useAuthStore } from '../../stores/auth';
import { dformat } from '../../utils/day';

const router = useRouter();
const dataAuthStore = useAuthStore();
const dataDoctorStore = useDataDoctorStore();
const dataAppointment = useDataAppointmentStore();
const listDoctors = ref([]);
const appointmentLists = ref([]);
const appointment = ref(null);
const dt = ref(null);
const filters = ref({});
const loading = ref(null);
const displayScheduleAppointment = ref(false);
const autoCompletePatients = ref(true);

onBeforeMount(() => {
    initFilters();
});
const exportCSV = () => {
    dt.value.exportCSV();
};
const openNew = () => {
    router.push('/listdoctor');
};
onMounted(async () => {
    await dataDoctorStore.getDoctors().then((data) => {
        listDoctors.value = data.map((user) => {
            user.name = `${user.user.surnames} ${user.user.name}`;
            return user;
        });
    });
    await dataAppointment.getAppointment().then((res) => (appointmentLists.value = res));
    appointmentLists.value.forEach((appointment) => {
        appointment.orderlyTurn = new Date(appointment.orderlyTurn);
        appointment.specialization = appointment.Schedule.doctor.specialization;
        appointment.nameDoctor = `${appointment.Schedule.doctor.user.surnames} ${appointment.Schedule.doctor.user.name}`;
        if (appointment.Appointment[0]) {
            if (appointment.Appointment[0].dependent) {
                appointment.patient = `${appointment.Appointment[0].dependent.name} ${appointment.Appointment[0].dependent.surnames}`;
            } else {
                appointment.patient = `${appointment.Appointment[0].user.name} ${appointment.Appointment[0].user.surnames}`;
            }
        }
    });
    loading.value = false;
});
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nameDoctor: { value: null, matchMode: FilterMatchMode.IN },
        orderlyTurn: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
};
const scheduleAppointment = (data) => {
    console.log(data);
    appointment.value = data;
    displayScheduleAppointment.value = true;
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
                    dataKey="timeSlotId"
                    :paginator="true"
                    :rows="10"
                    :rowHover="true"
                    :filters="filters"
                    v-model:filters="filters"
                    filterDisplay="menu"
                    :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del  {first} al {last} de {totalRecords} Atenciones"
                    :globalFilterFields="['nTurn', 'patient', 'status', 'nameDoctor', 'status', 'specialization', 'orderlyTurn']"
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
                    <template #empty>No se encontraron citas médicas </template>
                    <template #loading> Cargando datos. Espere por favor. </template>
                    <Column field="nTurn" header="Nº Turno" :sortable="true" headerStyle="width:10%; min-width:2rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº Turno</span>
                            {{ slotProps.data.nTurn }}
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
                            <span :class="'user-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status || 'Disponible' }}</span>
                        </template>
                    </Column>
                    <Column field="nameDoctor" header="Médico" :sortable="true" :showFilterMatchModes="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Médico</span>
                            {{ slotProps.data.nameDoctor }}
                        </template>
                        <template #filter="{ filterModel }">
                            <MultiSelect v-model="filterModel.value" :options="listDoctors" optionLabel="name" optionValue="name" placeholder="Buscar Por Médico" class="p-column-filter">
                                <template #option="slotProps">
                                    <div class="p-multiselect-representative-option">
                                        <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </MultiSelect>
                        </template>
                    </Column>
                    <Column field="specialization" header="Especialidad" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Especialidad</span>
                            {{ slotProps.data.specialization }}
                        </template>
                    </Column>
                    <Column field="orderlyTurn" header="Fecha Consulta" :showFilterMatchModes="false" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Consulta</span>
                            {{ dformat(slotProps.data.orderlyTurn, 'DD MMMM YYYY hh:mm a') }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
                        </template>
                    </Column>
                    <Column headerStyle="width:10%; min-width:5rem;" header="Acciones">
                        <template #body="slotProps">
                            <!-- <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2 mr-2" @click="confirmDelete(slotProps.data)" /> -->
                            <Button icon="pi pi-calendar-plus" class="p-button-rounded p-button-success mt-2" @click="scheduleAppointment(slotProps.data)" />
                        </template>
                    </Column>
                    <!-- 
                    <Column field="priority.name" header="Prioridad" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Category</span>
                            {{ slotProps.data.priority.name }}
                        </template>
                    </Column>
                    <Column field="description" header="Descripción" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descripción</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
     
                   
                    <Column field="resolvedAt" header="F. Resolución" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">F. Resolución</span>
                            {{ slotProps.data.resolvedAt ? dformat(slotProps.data.resolvedAt, 'DD MMMM YYYY') : '- -' }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUserTicket(slotProps.data)" />
                        </template>
                    </Column> -->
                </DataTable>
                <!-- <Dialog v-model:visible="deleteDataTicketDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dataTicket"
                            >Estás seguro de que quieres eliminar ticket Nº <b>{{ dataTicket.ticketId }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDataTicketDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDataTicket" />
                    </template>
                </Dialog> -->

                <!-- <Dialog v-model:visible="deleteDataTicketsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dataTicket">Are you sure you want to delete the selected Tickets?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDataTicketsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDataTickets" />
                    </template>
                </Dialog> -->
                <Dialog v-model:visible="displayScheduleAppointment" :style="{ width: '450px' }" header="Agendar Cita Médica" :modal="true" class="grid p-fluid">
                    <p class="mb-1">Medico : {{ appointment ? appointment.nameDoctor : 'No disponible' }}</p>
                    <p class="mb-1">Especialidad : {{ appointment ? appointment.specialization : 'No disponible' }}</p>
                    <span>Fecha: {{ appointment ? dformat(appointment.orderlyTurn, 'DD MMMM YYYY hh:mm A') : 'No disponible' }} </span>
                    <div class="field col-12 md:col-4 mt-4">
                        <span class="p-float-label">
                            <AutoComplete id="patients" :dropdown="true" v-model="selectedPatient" :suggestions="autoFilteredPatientValue" @complete="searchPatient($event)" field="name" :disabled="autoCompletePatients" />
                            <label for="autocomplete">Paciente</label>
                        </span>
                    </div>

                    <Button label="Método de pago" icon="pi pi-money-bill" class="p-button-success col-12 mt-3" :disabled="buttonPaymentDisabled" :loading="loading" @click="openPaymentMethod"></Button>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
