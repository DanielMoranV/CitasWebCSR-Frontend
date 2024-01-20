<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useDataAppointmentStore } from '../../stores/dataAppointment';
import { useDataDoctorStore } from '../../stores/dataDoctor';
import { useAuthStore } from '../../stores/auth';
import { useDataUserStore } from '../../stores/dataUser';
import { useToast } from 'primevue/usetoast';
import { dformat } from '../../utils/day';
import { useRouter } from 'vue-router';
import cache from '../../utils/cache';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const dataUserStore = useDataUserStore();
const dataDoctorStore = useDataDoctorStore();
const dataAppointmentStore = useDataAppointmentStore();
const listDoctors = ref([]);
const appointmentLists = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(null);
const selectedPatient = ref(null);
const buttonPaymentDisabled = ref(true);

onBeforeMount(() => initFilters());

const exportCSV = () => dt.value.exportCSV();

watch(selectedPatient, (newSelectedPatient) => {
    if (newSelectedPatient != null) buttonPaymentDisabled.value = false;
});

onMounted(async () => {
    await dataDoctorStore.getDoctors().then((data) => {
        listDoctors.value = data.map((user) => {
            user.name = `${user.user.surnames} ${user.user.name}`;
            return user;
        });
    });
    appointmentLists.value = await dataAppointmentStore.getAppointmentDoctorId(authStore.user.user.Doctor.doctorId);
    formatAppointmentList();

    loading.value = false;
});

const initFilters = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nameDoctor: { value: null, matchMode: FilterMatchMode.IN },
        orderlyTurn: { operator: FilterOperator.AND, constraints: [{ value: today, matchMode: FilterMatchMode.DATE_IS }] }
    };
};
const medicalRecord = (data) => {
    dataAppointmentStore.$state.appointment = data;
    router.push('/patientcare');
};

function formatAppointmentList() {
    appointmentLists.value.forEach((appointment) => {
        appointment.orderlyTurn = new Date(appointment.orderlyTurn);
        appointment.specialization = appointment.Schedule.doctor.specialization;
        appointment.nameDoctor = `${appointment.Schedule.doctor.user.surnames} ${appointment.Schedule.doctor.user.name}`;
        appointment.price = appointment.Schedule.doctor.personalizedPrices[0].personalizedPrice;
        if (appointment.Appointment[0]) {
            appointment.status = appointment.Appointment[0].status;
            appointment.origin = appointment.Appointment[0].origin;
            appointment.appointmentId = appointment.Appointment[0].appointmentId;
            if (appointment.Appointment[0].dependent) {
                appointment.patient = `${appointment.Appointment[0].dependent.name} ${appointment.Appointment[0].dependent.surnames}`;
            } else {
                appointment.patient = `${appointment.Appointment[0].user.name} ${appointment.Appointment[0].user.surnames}`;
            }
        }
    });
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <h6>{{ authStore.user.user.surnames }} {{ authStore.user.user.name }} | {{ authStore.user.user.Doctor.specialization }}</h6>
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
                    :globalFilterFields="['nTurn', 'patient', 'status', 'nameDoctor', 'status', 'specialization', 'orderlyTurn', 'origin']"
                    responsiveLayout="scroll"
                    showGridlines
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Lista de pacientes {{ dformat(new Date(), 'DD MMMM YYYY') }}</h5>
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
                    <Column field="origin" header="Origen" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Origen</span>
                            {{ slotProps.data.origin }}
                        </template>
                    </Column>
                    <Column field="orderlyTurn" header="Fecha Consulta" :showFilterMatchModes="false" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Consulta</span>
                            {{ dformat(slotProps.data.orderlyTurn, 'DD MMMM YYYY hh:mm a') }}
                        </template>
                    </Column>
                    <Column headerStyle="width:10%; min-width:5rem;" header="Acciones">
                        <template #body="slotProps">
                            <Button v-if="slotProps.data.patient" icon="pi pi-list" class="p-button-rounded p-button-success mt-2" @click="medicalRecord(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
