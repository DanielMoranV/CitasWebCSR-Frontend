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
const dt = ref(null);
const filters = ref({});

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
    await dataAppointment.getAppointmentUserId(dataAuthStore.user.user.userId).then((res) => (appointmentLists.value = res));
    // console.log(appointmentLists.value);
    appointmentLists.value.forEach((appointment) => {
        console.log(appointment);
        appointment.nameDoctor = `${appointment.doctor.user.surnames} ${appointment.doctor.user.name}`;
        if (appointment.dependent) {
            appointment.patient = `${appointment.dependent.name} ${appointment.dependent.surnames}`;
        } else {
            appointment.patient = `${appointment.user.name} ${appointment.user.surnames}`;
        }
    });
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
                    <Column field="timeSlot.nTurn" header="Nº Turno" :sortable="true" headerStyle="width:10%; min-width:2rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº Turno</span>
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
                <Dialog v-model:visible="deleteDataTicketDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
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
                </Dialog>

                <Dialog v-model:visible="deleteDataTicketsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dataTicket">Are you sure you want to delete the selected Tickets?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDataTicketsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDataTickets" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
