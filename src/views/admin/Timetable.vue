<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDataUserStore } from '../../stores/dataUser';
import { useDataDoctorStore } from '../../stores/dataDoctor';
import { dformat } from '../../utils/day';
import cache from '../../utils/cache';
//import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const toast = useToast();
const dataUserStore = useDataUserStore();
const dataDoctorStore = useDataDoctorStore();

const nameDoctor = ref(null);
const dataDoctor = ref(null);
const schedules = ref(null);
const schedule = ref(null);
const daysSchedule = ref(null);
const users = ref(null);
const user = ref({});
const userDialog = ref(false);
const timeSlotDialog = ref(false);
const deleteUserDialog = ref(false);
const deleteUsersDialog = ref(false);
const selectedUsers = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const availableScheduleDialog = ref(false);

onBeforeMount(() => {
    initFilters();
});
const filename = `listcolaborator-${dformat(new Date(), 'DD-MM-YYYY')}`;
onMounted(async () => {
    dataDoctor.value = cache.getItem('doctor');
    // Verificar si dataDoctor tiene datos antes de utilizarlo
    if (dataDoctor.value !== null && dataDoctor.value !== undefined) {
        // Accede a los datos y realiza las operaciones necesarias
        nameDoctor.value = dataDoctor.value.user.name + ' ' + dataDoctor.value.user.surnames;
        // Verificar si dataDoctor.value.user.Doctor existe antes de acceder a sus propiedades
        if (dataDoctor.value.user.Doctor) {
            await dataDoctorStore.getDoctorSchedule(dataDoctor.value.user.Doctor.doctorId).then((data) => {
                schedules.value = data.map((schedule) => {
                    let startTime = dformat(schedule.startTime, 'hh:mm A');
                    let endTime = dformat(schedule.endTime, 'hh:mm A');
                    //let day = dformat(schedule.day, 'DD MMMM YYYY');
                    schedule.startTime = startTime;
                    schedule.endTime = endTime;
                    //schedule.day = day;
                    return schedule;
                });
            });
            console.log(schedules.value);
        } else {
            // Manejar el caso en el que dataDoctor.value.user.Doctor no existe
            console.error('No se encontraron datos del doctor en dataDoctor.');
        }
    } else {
        // Manejar el caso en el que dataDoctor no tiene datos
        console.error('No se encontraron datos en dataDoctor.');
    }
});

const openNew = () => {
    schedule.value = {
        day: null,
        startTime: null,
        endTime: null,
        interval: null,
        capacity: null,
        availableSchedule: true,
        doctorId: dataDoctor.value.user.Doctor.doctorId
    };
    daysSchedule.value = null;

    submitted.value = false;
    userDialog.value = true;
    // Utilizamos watch para realizar un seguimiento de los cambios en startTime, endTime e interval
    watch([() => schedule.value.startTime, () => schedule.value.endTime, () => schedule.value.interval], ([newStartTime, newEndTime, newInterval]) => {
        if (newStartTime !== null && newEndTime !== null && newInterval !== null) {
            const startTime = new Date(newStartTime);
            const endTime = new Date(newEndTime);
            const interval = newInterval;

            const timeDiffMinutes = (endTime - startTime) / (1000 * 60);

            schedule.value.capacity = Math.floor(timeDiffMinutes / interval);
        } else {
            schedule.value.capacity = null;
        }
    });
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const validateRequiredFields = () => {
    return schedule.value.startTime && schedule.value.endTime && schedule.value.interval && schedule.value.capacity && schedule.value.availableSchedule && schedule.value.doctorId && daysSchedule.value;
};

const updateSchedule = async () => {
    if (schedule.value.scheduleId) {
        // const userIndex = users.value.findIndex((item) => item.accessId === user.value.accessId);
        // if (userIndex !== -1) {
        //     payload.access.accessId = user.value.accessId;
        //     payload.userId = user.value.user.userId;

        //     await dataUserStore.updateUser(payload.dni, payload.access.accessId, payload);

        //     user.value.roleName = roleNames.value[user.value.roleId];
        //     users.value[userIndex] = user.value;
        //     toast.add({ severity: 'success', summary: 'Éxito', detail: 'Colaborador Actualizado', life: 3000 });
        // }
        console.log('voy a editar');
    } else {
        for (const date of daysSchedule.value) {
            // Crea un nuevo objeto schedule para cada fecha
            const newSchedule = {
                ...schedule.value,
                startTime: new Date(date.setHours(schedule.value.startTime.getHours(), schedule.value.startTime.getMinutes())),
                endTime: new Date(date.setHours(schedule.value.endTime.getHours(), schedule.value.endTime.getMinutes())),
                day: date // Asigna la fecha a day
            };

            // Envía newSchedule al servidor para guardarlo en la base de datos
            await dataDoctorStore.addDoctorSchedule(newSchedule);
        }
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Dias y turnos de citas generados correctamente', life: 3000 });
    }
    await dataDoctorStore.getDoctorSchedule(dataDoctor.value.user.Doctor.doctorId).then((data) => {
        schedules.value = data.map((schedule) => {
            let startTime = dformat(schedule.startTime, 'hh:mm A');
            let endTime = dformat(schedule.endTime, 'hh:mm A');
            schedule.startTime = startTime;
            schedule.endTime = endTime;
            return schedule;
        });
    });

    userDialog.value = false;
    schedule.value = {};
};

const saveUser = async () => {
    submitted.value = true;

    if (validateRequiredFields()) {
        updateSchedule();
    }
};

const editUser = (editschedule) => {
    schedule.value = { ...editschedule };
    daysSchedule.value = schedule.value.day;
    userDialog.value = true;
};
const editTimeSlot = (timeSlot) => {
    schedule.value = { ...timeSlot };
    timeSlotDialog.value = true;
};
const confirmDeleteUser = (editUser) => {
    user.value = editUser;
    deleteUserDialog.value = true;
};

const deleteUser = async () => {
    users.value = users.value.filter((val) => val.accessId !== user.value.accessId);
    await dataUserStore.disableUser(user.value.accessId);
    deleteUserDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
};

const exportCSV = () => {
    console.log(dt.value);
    dt.value.exportCSV();
};

const onUpload = (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Ahora jsonData contiene los datos del archivo Excel en formato JSON
        console.log(jsonData);
    };

    reader.readAsArrayBuffer(file);
};

const confirmDeleteSelected = () => {
    deleteUsersDialog.value = true;
};
const confirmAvailableSchedule = (data) => {
    console.log(data);
    schedule.value = data;
    availableScheduleDialog.value = true;
};
const editAvalibleSchedule = async (schedule) => {
    console.log(schedule);
    let payload = {
        availableSchedule: schedule.availableSchedule
    };
    await dataDoctorStore.updateSchedule(schedule.scheduleId, payload);
    availableScheduleDialog.value = false;
};
const deleteSelectedUsers = () => {
    users.value = users.value.filter((val) => !selectedUsers.value.includes(val));
    const selectedIds = selectedUsers.value.map((user) => user.scheduleId);

    selectedIds.forEach(async (accessId) => {
        await dataUserStore.disableUser(accessId);
    });
    deleteUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Colaboradores deshabilitados', life: 3000 });
};

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
                            <Button label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload
                            mode="basic"
                            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            :auto="true"
                            :maxFileSize="1000000"
                            label="Importar"
                            chooseLabel="Importar"
                            class="mr-2 inline-block"
                            @upload="onUpload"
                        />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="schedules"
                    v-model:selection="selectedUsers"
                    dataKey="scheduleId"
                    selectionMode="multiple"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Horarios"
                    responsiveLayout="scroll"
                    :exportFilename="filename"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Gestión de Horarios Dr. {{ nameDoctor }}</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="day" header="Fecha" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha</span>
                            {{ dformat(slotProps.data.day, 'DD MMMM YYYY') }}
                        </template>
                    </Column>
                    <Column field="startTime" header="Inicio" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Inicio</span>
                            {{ slotProps.data.startTime }}
                        </template>
                    </Column>
                    <Column field="endTime" header="Fin" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fin</span>
                            {{ slotProps.data.endTime }}
                        </template>
                    </Column>
                    <Column field="capacity" header="Turnos" :sortable="true" headerStyle="width:10%; min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Turnos</span>
                            {{ slotProps.data.capacity }}
                        </template>
                    </Column>
                    <Column field="availableSchedule" header="Habilitado" :sortable="true" headerStyle="width:8%; min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Habilitado</span>
                            <InputSwitch v-model="slotProps.data.availableSchedule" @change="confirmAvailableSchedule(slotProps.data)" />
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;" header="Acciones">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-primary mr-2" @click="editUser(slotProps.data)" />
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="editTimeSlot(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2" @click="confirmDeleteUser(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="userDialog" :style="{ width: '500px' }" header="Horario de consultas" :modal="true" class="p-fluid">
                    <!-- <img :src="contextPath + 'demo/images/user/' + user.image" :alt="user.image" v-if="user.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label for="dni">Días</label>
                        <Calendar
                            :showIcon="true"
                            :showButtonBar="true"
                            v-model="daysSchedule"
                            dateFormat="dd/mm/yy"
                            required="true"
                            selectionMode="multiple"
                            :class="{ 'p-invalid': submitted && !schedule.daysSchedule }"
                            :minDate="new Date()"
                        ></Calendar>
                        <small class="p-invalid" v-if="submitted && !daysSchedule">Días es requerido.</small>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="startTime">Hora Inicio</label>
                            <Calendar id="calendar-timeonly" v-model="schedule.startTime" timeOnly hourFormat="12" required="true" :showIcon="true" :manualInput="true" :class="{ 'p-invalid': submitted && !schedule.startTime }" />
                            <small class="p-invalid" v-if="submitted && !schedule.startTime">Hora inicio es requerido.</small>
                        </div>
                        <div class="field col">
                            <label for="endTime">Hora Fin</label>
                            <Calendar id="calendar-timeonly" v-model="schedule.endTime" timeOnly hourFormat="12" required="true" :showIcon="true" :manualInput="true" :class="{ 'p-invalid': submitted && !schedule.endTime }" />
                            <small class="p-invalid" v-if="submitted && !schedule.endTime">Hora inicio es requerido.</small>
                        </div>
                    </div>

                    <div class="field">
                        <label for="interval">Duracion por consulta (minutos)</label>
                        <InputNumber id="interval" v-model.trim="schedule.interval" required="true" autofocus :class="{ 'p-invalid': submitted && !schedule.interval }" />
                        <small class="p-invalid" v-if="submitted && !schedule.interval">Intervalo es requerido.</small>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="capacity">Capacidad</label>
                            <InputNumber id="capacity" v-model.trim="schedule.capacity" required="true" autofocus :class="{ 'p-invalid': submitted && !schedule.capacity }" :disabled="true" />
                            <small class="p-invalid" v-if="submitted && !schedule.capacity">Capacidad es requerido.</small>
                        </div>
                        <div class="field col">
                            <p>Disponible</p>
                            <InputSwitch v-model="schedule.availableSchedule" />
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveUser" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="timeSlotDialog" :style="{ width: '500px' }" header="Turnos de consulta" :modal="true" class="p-fluid">
                    <h5>{{ dformat(schedule.day, 'DD MMMM YYYY') }}</h5>
                    <DataTable :value="schedule.timeSlot" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 25rem">
                        <Column field="nTurn" header="Turno" style="width: 5%"></Column>
                        <Column field="orderlyTurn" header="Hora" style="width: 20%">
                            <template #body="slotProps">
                                <span class="p-column-title">Turno</span>
                                {{ dformat(slotProps.data.orderlyTurn, 'hh:mm a') }}
                            </template>
                        </Column>
                        <Column field="availableTurn" header="Estado" style="width: 30%">
                            <template #body="slotProps">
                                <span class="p-column-title">Estado</span>
                                {{ slotProps.data.availableTurn ? 'Libre' : 'En Consulta' }}
                            </template>
                        </Column>
                        <Column field="availableTurn" header="Estado" style="width: 25%">
                            <template #body="slotProps">
                                <span class="p-column-title">Estado</span>
                                <InputSwitch v-model="slotProps.data.availableTurn" @change="confirmAvailableSchedule(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="schedule"
                            >¿Estás seguro de que quieres eliminar <b>{{ user.user.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="availableScheduleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="schedule"
                            >¿Estás seguro de querer {{ schedule.availableSchedule ? 'habilitar' : 'deshabilitar' }} este horario del día <b>{{ dformat(schedule.day, 'DD MMMM YYYY') }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="(availableScheduleDialog = false), (schedule.availableSchedule = !schedule.availableSchedule)" />
                        <Button label="Si" icon="pi pi-check" class="p-button-text" @click="editAvalibleSchedule(schedule)" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user">¿Está seguro de que desea eliminar los usuarios seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedUsers" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
@import '@/assets/styles/badges.scss';
</style>
