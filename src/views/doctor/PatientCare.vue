<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useDataAppointmentStore } from '../../stores/dataAppointment';
import { useAuthStore } from '../../stores/auth';
import { dformat, dparse } from '../../utils/day';
import { useToast } from 'primevue/usetoast';

const dataAppointmentStore = useDataAppointmentStore();
const dataAuthStore = useAuthStore();
const appointment = ref(null);
const toast = useToast();
const loading = ref(null);
const appointmentHistory = ref(null);
const attention = ref(null);
const filters = ref(null);
const dt = ref(null);
const submitted = ref(null);
const appointmentHistoryDialog = ref(null);
const disabledNew = ref(true);
const doctor = ref(true);

const exportCSV = () => dt.value.exportCSV();
const openNew = () => {
    attention.value = {
        reason: '',
        diagnosis: '',
        treatment: ''
    };
    submitted.value = false;
    appointmentHistoryDialog.value = true;
};
const updateAttention = (data) => {
    attention.value = data;
    console.log(attention.value);
    submitted.value = false;
    appointmentHistoryDialog.value = true;
};
const hideDialog = () => {
    appointmentHistoryDialog.value = false;
    submitted.value = false;
};
const saveAppointmentHistory = async () => {
    let payload = {
        reason: attention.value.reason,
        diagnosis: attention.value.diagnosis,
        treatment: attention.value.treatment,
        userId: appointment.value.userId,
        doctorId: appointment.value.Schedule.doctorId,
        appointmentId: appointment.value.appointmentId
    };
    if (attention.value.appointmentHistoryId) {
        const userIndex = appointmentHistory.value.findIndex((item) => item.appointmentHistoryId === attention.value.appointmentHistoryId);
        if (userIndex !== -1) {
            console.log('payload', payload);
            await dataAppointmentStore.updateAppointmentHistory(attention.value.appointmentHistoryId, payload);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle de Atención Actualizado', life: 3000 });
        }
    } else {
        attention.value = await dataAppointmentStore.createAppointmentHistory(payload);
        attention.value.doctor = doctor.value;
        attention.value.date = dformat(new Date(), 'DD MMMM YYYY');
        appointmentHistory.value.push(attention.value);

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle de Atención Guardado', life: 3000 });
    }
    submitted.value = true;

    hideDialog();
};
onBeforeMount(() => initFilters());

onMounted(async () => {
    console.log(dataAppointmentStore.appointment);
    doctor.value = (await dataAuthStore.user.user.name) + ' ' + dataAuthStore.user.user.surnames;
    appointment.value = await dataAppointmentStore.appointment;
    appointment.value.userId = await appointment.value.Appointment[0].user.userId;
    await dataAppointmentStore.getAppointmentHistoryUserId(appointment.value.userId).then((data) => {
        appointmentHistory.value = data.map((attention) => {
            attention.date = dformat(attention.appointment.timeSlot.orderlyTurn, 'DD MMMM YYYY');
            attention.doctor = attention.doctor.user.name + ' ' + attention.doctor.user.surnames;
            console.log(attention.appointmentId);
            return attention;
        });
    });
    console.log(appointment.value.appointmentId);
    console.log(appointmentHistory.value);

    const existeEnHistorial = appointmentHistory.value.some((historialItem) => historialItem.appointmentId === appointment.value.appointmentId);
    disabledNew.value = existeEnHistorial;
    console.log(existeEnHistorial);
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
                    <template v-slot:start> <Button :disabled="disabledNew" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" /> </template>
                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="appointmentHistory"
                    dataKey="appointmentHistoryId"
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
                    :globalFilterFields="['appointmentHistoryId', 'diagnosis', 'tratament', 'reason']"
                    responsiveLayout="scroll"
                    showGridlines
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">{{ appointment ? appointment.patient : '--' }}</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <template #empty>No se encontraron citas médicas </template>
                    <template #loading> Cargando datos. Espere por favor. </template>
                    <Column field="appointmentHistoryId" header="Nº" :sortable="true" headerStyle="width:10%; min-width:2rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha</span>
                            {{ slotProps.data.date }}
                        </template>
                    </Column>
                    <Column field="reason" header="Motivo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Motivo</span>
                            {{ slotProps.data.reason }}
                        </template>
                    </Column>
                    <Column field="diagnosis" header="Diágnostico" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Diágnostico</span>
                            {{ slotProps.data.diagnosis }}
                        </template>
                    </Column>
                    <Column field="treatment" header="Tratamiento" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tratamiento</span>
                            {{ slotProps.data.treatment }}
                        </template>
                    </Column>

                    <Column field="doctor" header="Médico" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Médico</span>
                            {{ slotProps.data.doctor }}
                        </template>
                    </Column>
                    <Column headerStyle="width:10%; min-width:5rem;" header="Acciones">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mt-2" @click="updateAttention(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="appointmentHistoryDialog" :style="{ width: '500px' }" header="Detalle de Consulta" :modal="true" class="p-fluid">
                    <!-- <img :src="contextPath + 'demo/images/user/' + user.image" :alt="user.image" v-if="user.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label for="name">Motivo de la consulta</label>
                        <Textarea cols="5" id="name" v-model.trim="attention.reason" autofocus />
                    </div>
                    <div class="field">
                        <label for="name">Diagnostico</label>
                        <Textarea cols="5" id="name" v-model.trim="attention.diagnosis" autofocus />
                    </div>

                    <div class="field">
                        <label for="surnames">Tratamiendo</label>
                        <Textarea cols="5" id="surnames" v-model.trim="attention.treatment" autofocus />
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveAppointmentHistory" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
