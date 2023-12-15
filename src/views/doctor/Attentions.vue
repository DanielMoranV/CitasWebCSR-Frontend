<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useDataAppointmentStore } from '../../stores/dataAppointment';
import { useDataAdmissionistStore } from '../../stores/dataAdmissionist';
import { useDataDoctorStore } from '../../stores/dataDoctor';
import { useAuthStore } from '../../stores/auth';
import { useDataUserStore } from '../../stores/dataUser';
import { useToast } from 'primevue/usetoast';
import { dformat } from '../../utils/day';

const toast = useToast();
const authStore = useAuthStore();
const dataUserStore = useDataUserStore();
const dataDoctorStore = useDataDoctorStore();
const dataAdmissionistStore = useDataAdmissionistStore();
const dataAppointmentStore = useDataAppointmentStore();
const listDoctors = ref([]);
const appointmentLists = ref([]);
const appointment = ref(null);
const dt = ref(null);
const filters = ref({});
const loading = ref(null);
const displayScheduleAppointment = ref(false);
const deleteAppointmentDialog = ref(false);
const autoCompletePatients = ref(true);
const listPatients = ref(null);
const patients = ref(null);
const selectedPatient = ref(null);
const autoFilteredPatientValue = ref([]);
const buttonPaymentDisabled = ref(true);
const todayCashRegister = ref(null);
const paymentValues = ref({
    amount: null,
    paymentDate: null,
    appointmentId: null,
    paymentMethodId: null,
    VoucherTypeId: null,
    userId: null
});

onBeforeMount(() => initFilters());

const exportCSV = () => dt.value.exportCSV();

const searchPatient = (event) => {
    const searchText = event.query.toLowerCase();
    autoFilteredPatientValue.value = searchText.trim().length ? patients.value.filter((patient) => patient.fullName.toLowerCase().includes(searchText)) : [...patients.value];
};

watch(selectedPatient, (newSelectedPatient) => {
    console.log(newSelectedPatient);
    if (newSelectedPatient != null) buttonPaymentDisabled.value = false;
});

onMounted(async () => {
    await dataDoctorStore.getDoctors().then((data) => {
        listDoctors.value = data.map((user) => {
            user.name = `${user.user.surnames} ${user.user.name}`;
            return user;
        });
    });
    console.log(authStore.user.user.Doctor.doctorId);
    appointmentLists.value = await dataAppointmentStore.getAppointmentDoctorId(authStore.user.user.Doctor.doctorId);
    formatAppointmentList();

    loading.value = false;

    listPatients.value = await dataUserStore.getPatients();
    patients.value = formatPatientValues(listPatients.value);
    autoCompletePatients.value = false;
    todayCashRegister.value = await dataAdmissionistStore.getTodayCashRegisterForAdmissionist(authStore.user.accessId);
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nameDoctor: { value: null, matchMode: FilterMatchMode.IN },
        orderlyTurn: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
};
const confirmDelete = (data) => {
    appointment.value = data;
    console.log(appointment.value);
    deleteAppointmentDialog.value = true;
};

const deleteeAppointmentId = async () => {
    await dataAppointmentStore.deleteAppointmentId(appointment.value.Appointment[0].appointmentId);
    deleteAppointmentDialog.value = false;
    appointment.value = {};
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cita médica eliminada', life: 3000 });
};
const scheduleAppointment = async (data) => {
    if (todayCashRegister.value !== null) {
        appointment.value = data;
        displayScheduleAppointment.value = true;
        buttonPaymentDisabled.value = true;
        selectedPatient.value = null;
        console.log(appointment.value);
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Caja registradora NO APERTURADA', life: 4000 });
    }
};

const openPaymentMethodCash = async () => {
    const payload = createAppointmentPayload();
    let newAppointment = await dataAppointmentStore.addappointment(payload);
    console.log(newAppointment.value);
    appointmentLists.value = await dataAppointmentStore.getAppointment();
    formatAppointmentList();
    let lastPayment = await dataAppointmentStore.getLastPayment();
    lastPayment = Number(lastPayment.paymentId) + 1;
    paymentValues.value = {
        amount: Number(appointment.value.price) * 100,
        voucherNumber: '000' + lastPayment,
        paymentDate: new Date(),
        appointmentId: newAppointment.appointmentId,
        paymentMethodId: 1,
        VoucherTypeId: 5,
        userId: newAppointment.userId,
        admissionistId: authStore.user.accessId,
        chargeId: null
    };
    console.log(paymentValues.value);
    let newPaymentCash = await dataAppointmentStore.createPaymentCash(paymentValues.value);
    let payloadCashRegister = {
        transactionDate: new Date(),
        transactionType: 'Ingreso',
        amount: newPaymentCash.amount,
        cashRegisterId: todayCashRegister.value.cashRegisterId,
        voucherNumber: newPaymentCash.voucherNumber,
        paymentId: newPaymentCash.paymentId,
        category: 'Consultas Médicas'
    };

    console.log(payloadCashRegister);
    await dataAdmissionistStore.createCashRegisterTransaction(payloadCashRegister);
    displayScheduleAppointment.value = false;
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cita médica pagada correctamente', life: 3000 });
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
            if (appointment.Appointment[0].dependent) {
                appointment.patient = `${appointment.Appointment[0].dependent.name} ${appointment.Appointment[0].dependent.surnames}`;
            } else {
                appointment.patient = `${appointment.Appointment[0].user.name} ${appointment.Appointment[0].user.surnames}`;
            }
        }
    });
}

function formatPatientValues(patientsList) {
    const patientValues = [];
    patientsList.forEach((patient) => {
        // Formatea los elementos de la lista de pacientes
        patientValues.push({
            userId: patient.user.userId,
            fullName: patient.user.name + ' ' + patient.user.surnames + ' ' + patient.user.dni,
            dependents: patient.user.dependents,
            name: patient.user.name,
            surnames: patient.user.surnames,
            address: patient.user.address,
            phone: patient.user.phone
        });
        if (patient.user.dependents.length) {
            patient.user.dependents.forEach((dependent) => {
                patientValues.push({
                    userId: dependent.userId,
                    fullName: dependent.name + ' ' + dependent.surnames + ' ' + dependent.dni,
                    dependentId: dependent.dependentId,
                    name: patient.user.name,
                    surnames: patient.user.surnames,
                    address: patient.user.address,
                    phone: patient.user.phone
                });
            });
        }
    });
    return patientValues;
}

function createAppointmentPayload() {
    const payload = {
        origin: 'admisión',
        status: 'pendiente',
        createAt: new Date(),
        doctorId: appointment.value.Schedule.doctor.doctorId,
        userId: selectedPatient.value.userId,
        dependentId: selectedPatient.value.dependentId,
        timeSlotId: appointment.value.timeSlotId,
        appointmentServices: {
            create: [
                {
                    medicalServiceId: 1
                }
            ]
        }
    };
    return payload;
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <!-- <template v-slot:start>
                        <div class="my-2">
                            <Button label="Agendar Cita Médica" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template> -->

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
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
                        </template>
                    </Column>
                    <Column headerStyle="width:10%; min-width:5rem;" header="Acciones">
                        <template #body="slotProps">
                            <Button v-if="slotProps.data.status" icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2 mr-2" @click="confirmDelete(slotProps.data)" />
                            <Button v-if="!slotProps.data.status" icon="pi pi-calendar-plus" class="p-button-rounded p-button-success mt-2" @click="scheduleAppointment(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="deleteAppointmentDialog" :style="{ width: '450px' }" header="Eliminar Cita" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="appointment"
                            >Estás seguro de que quieres eliminar atención Nº <b>{{ appointment.Appointment[0].appointmentId }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAppointmentDialog = false" />
                        <Button label="Si" icon="pi pi-check" class="p-button-text" @click="deleteeAppointmentId" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="displayScheduleAppointment" :style="{ width: '450px' }" header="Agendar Consulta Médica" :modal="true" class="grid p-fluid">
                    <p class="mb-1">Medico : {{ appointment ? appointment.nameDoctor : 'No disponible' }}</p>
                    <p class="mb-1">Especialidad : {{ appointment ? appointment.specialization : 'No disponible' }}</p>
                    <p class="mb-1">Fecha: {{ appointment ? dformat(appointment.orderlyTurn, 'DD MMMM YYYY hh:mm A') : 'No disponible' }}</p>
                    <p class="mb-1">Total : S/ {{ appointment ? appointment.price : 'No disponible' }}</p>
                    <div class="field col-12 md:col-12 mt-12 mt-4">
                        <span class="p-float-label">
                            <AutoComplete id="patients" :dropdown="true" v-model="selectedPatient" :suggestions="autoFilteredPatientValue" @complete="searchPatient($event)" field="fullName" :disabled="autoCompletePatients" />
                            <label for="autocomplete">Paciente</label>
                        </span>
                    </div>

                    <Button label="Pagar Consulta Médica" icon="pi pi-money-bill" class="p-button-default col-12 mb-2" :disabled="buttonPaymentDisabled" :loading="loading" @click="openPaymentMethodCash"></Button>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
