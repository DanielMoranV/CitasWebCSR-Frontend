<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDataUserStore } from '../../stores/dataUser';
import { useAuthStore } from '../../stores/auth';
import { dformat, dparse, dparseFromFormat } from '../../utils/day';
import { updateDependent } from '../../api';
import * as XLSX from 'xlsx';

const toast = useToast();
const authStore = useAuthStore();
const dataUserStore = useDataUserStore();

const users = ref(null);
const disabledInput = ref(true);
const listPatients = ref([]);
const patient = ref({});
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const deleteUsersDialog = ref(false);
const selectedUsers = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sexItems = ref([
    { name: 'Masculino', code: 'Masculino' },
    { name: 'Femenino', code: 'Femenino' }
]);
const civilStatusItems = ref([
    { name: 'Soltero', code: 'Soltero' },
    { name: 'Casado', code: 'Casado' },
    { name: 'Viudo', code: 'Viudo' },
    { name: 'Divorciado', code: 'Divorciado' }
]);
watch([() => patient.value.dni], async ([newDni]) => {
    // También puedes acceder a newDni y realizar acciones según sea necesario
    if (isValidDni(newDni) && patient.value.documentType === 'DNI') {
        searchByDNI(newDni);
    }
});

const searchByDNI = async (dni) => {
    const infoReniec = await authStore.searchbydni(dni);
    if (!infoReniec) {
        patient.value.dni = '';
        patient.value.name = '';
        patient.value.surnames = '';
        toast.add({ severity: 'error', summary: 'Error', detail: 'DNI no encontrado; intente nuevamente', life: 3000 });
    } else {
        patient.value.name = infoReniec?.nombres || '';
        patient.value.surnames = infoReniec?.apellidop + ' ' + infoReniec?.apellidom;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'DNI encontrado', life: 3000 });
    }
};
const isValidPhone = (value) => {
    const phonePattern = /^[0-9]{9}$/; // Este patrón asume un número de 9 dígitos.

    return phonePattern.test(value);
};
const isValidDni = (value) => {
    if (patient.value.documentType === 'DNI') {
        disabledInput.value = true;
        // Para DNI, verificar que solo contiene 8 dígitos de 0-9
        return /^\d{8}$/.test(value);
    } else if (patient.value.documentType === 'CE') {
        disabledInput.value = false;
        // Para Carnet de extranjería, verificar que solo contiene 9 dígitos de 0-9
        return /^\d{9}$/.test(value);
    } else if (patient.value.documentType === 'Pasaporte') {
        disabledInput.value = false;
        // Para Pasaporte, verificar que contiene letras y números y tiene hasta 20 caracteres
        return /^[A-Za-z0-9]{5,20}$/.test(value);
    }
    return true; // Permitir otros tipos de documento sin restricciones
};

onBeforeMount(() => {
    initFilters();
});
const filename = `listpatients-${dformat(new Date(), 'DD-MM-YYYY')}`;
onMounted(async () => {
    await dataUserStore.getPatients().then((data) => {
        users.value = data.flatMap((user) => {
            // Crear un array que contiene tanto el usuario como sus dependientes
            const combinedArray = [{ accessId: user.accessId, user: user.user }, ...(user.user.dependents || []).map((dependent) => ({ accessId: dependent.accessId, user: dependent }))];
            return combinedArray;
        });
    });
    users.value.forEach((user) => {
        const currentUser = user.user;
        let birthDate = dformat(currentUser.birthDate, 'DD MMMM YYYY');
        currentUser.birthDate = birthDate;
        currentUser.accessId = user.accessId;
        listPatients.value.push(currentUser);
    });
    console.log(listPatients.value);
});

const openNew = () => {
    patient.value = {
        accessId: null,
        address: null,
        birthDate: null,
        civilStatus: null,
        dni: null,
        documentType: 'DNI',
        email: null,
        name: null,
        phone: null,
        photo: null,
        sex: null,
        surnames: null,
        userId: null
    };
    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const validateRequiredFields = () => {
    const userValue = patient.value;
    return userValue.name && userValue.name.trim() && userValue.surnames && userValue.dni && userValue.birthDate && userValue.sex && isValidDni(userValue.dni) && isValidPhone(userValue.phone);
};

const updateUser = async () => {
    console.log(patient.value);
    const payload = {
        address: patient.value.address,
        birthDate: dparse(patient.value.birthDate),
        civilStatus: patient.value.civilStatus,
        dni: patient.value.dni,
        documentType: patient.value.documentType,
        email: patient.value.email,
        name: patient.value.name,
        phone: patient.value.phone,
        photo: patient.value.photo,
        sex: patient.value.sex,
        surnames: patient.value.surnames,
        access: {
            username: `${patient.value.dni}`,
            password: patient.value.dni,
            roleId: 4
        }
    };
    if (patient.value.accessId || patient.value.dependentId) {
        //payload.birthDate = dparseFromFormat(patient.value.birthDate, 'DD MMMM YYYY');
        const userIndex = listPatients.value.findIndex((item) => item.accessId === patient.value.accessId);
        if (userIndex !== -1) {
            if (patient.value.accessId) {
                payload.access.accessId = patient.value.accessId;
                payload.userId = patient.value.userId;
                await dataUserStore.updatePatient(payload.dni, payload.access.accessId, payload);
            }
            if (patient.value.dependentId) {
                payload.dependentId = patient.value.dependentId;
                const { access, ...payloadDependent } = payload;
                await updateDependent(patient.value.dependentId, payloadDependent);
            }
            patient.value.birthDate = dformat(patient.value.birthDate, 'DD MMMM YYYY');
            listPatients.value[userIndex] = patient.value;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Paciente Actualizado', life: 3000 });
        }
    } else {
        const dataUser = await dataUserStore.addUsers(payload);
        console.log(dataUser);
        console.log(listPatients.value);
        patient.value.accessId = dataUser.access[0].accessId;
        patient.value.status = 'offline';
        patient.value.birthDate = dformat(patient.value.birthDate, 'DD MMMM YYYY');
        listPatients.value.push(patient.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Paciente Registrado', life: 3000 });
    }

    userDialog.value = false;
    patient.value = {};
    submitted.value = false;
};

const saveUser = async () => {
    submitted.value = true;
    console.log(patient.value);

    if (validateRequiredFields()) {
        console.log(patient.value);
        updateUser();
        console.log(patient.value);
    }
};

const editUser = (editUser) => {
    patient.value = { ...editUser };
    patient.value.birthDate = new Date(patient.value.birthDate);
    console.log(patient.value);
    console.log('editar paciente', dformat(patient.value.birthDate, 'DD/MM/YYYY'));

    userDialog.value = true;
};

const confirmDeleteUser = (editUser) => {
    patient.value = editUser;
    deleteUserDialog.value = true;
};

const deleteUser = async () => {
    console.log(patient.value);
    if (patient.value.accessId == undefined) {
        listPatients.value = listPatients.value.filter((val) => val.dni !== patient.value.dni);
        await dataUserStore.deleteUserDependents(patient.value.dependentId);
    } else {
        listPatients.value = listPatients.value.filter((val) => val.accessId !== patient.value.accessId);
        await dataUserStore.disableUser(patient.value.accessId);
    }

    console.log(patient.value);
    deleteUserDialog.value = false;
    patient.value = {};
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
const deleteSelectedUsers = () => {
    listPatients.value = listPatients.value.filter((val) => !selectedUsers.value.includes(val));
    const selectedIds = selectedUsers.value.map((user) => user.dni);

    selectedIds.forEach(async (accessId) => {
        console.log(accessId);
        //await dataUserStore.disableUser(accessId);
    });
    deleteUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Pacientes deshabilitados', life: 3000 });
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
                            <Button label="Deshabilitar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
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
                    :value="listPatients"
                    v-model:selection="selectedUsers"
                    dataKey="dni"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Pacientes"
                    responsiveLayout="scroll"
                    :exportFilename="filename"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Gestión de usuarios</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="user.dni" header="DNI" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">DNI</span>
                            {{ slotProps.data.dni }}
                        </template>
                    </Column>
                    <Column field="user.surnames" header="Apellidos" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Apellidos</span>
                            {{ slotProps.data.surnames }}
                        </template>
                    </Column>
                    <Column field="user.name" header="Nombre" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>

                    <Column field="roleName" header="Fecha de Nacimiento" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Nacimiento</span>
                            {{ slotProps.data.birthDate }}
                        </template>
                    </Column>
                    <Column field="status" header="Teléfono" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Teléfono</span>
                            {{ slotProps.data.phone }}
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;" header="Acciones">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUser(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUser(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="userDialog" :style="{ width: '500px' }" header="Detalle de colaborador" :modal="true" class="p-fluid">
                    <!-- <img :src="contextPath + 'demo/images/user/' + user.image" :alt="user.image" v-if="user.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label class="mb-3">Tipo de documento</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-4">
                                <RadioButton id="dni" name="option" value="DNI" v-model="patient.documentType" />
                                <label for="dni">DNI</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="ce" name="option" value="CE" v-model="patient.documentType" />
                                <label for="ce">CE</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="pasaport" name="option" value="Pasaporte" v-model="patient.documentType" />
                                <label for="pasaport">Pasaporte</label>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="dni">{{ patient.documentType }}</label>
                        <InputText id="name" v-model.trim="patient.dni" required="true" autofocus :class="{ 'p-invalid': (submitted && !patient.dni) || !isValidDni(patient.dni) }" />
                        <small class="p-invalid" v-if="(submitted && !patient.dni) || !isValidDni(patient.dni)">{{ patient.documentType }} es requerido o formato inválido</small>
                    </div>
                    <div class="field">
                        <label for="name">Nombre</label>
                        <InputText :disabled="disabledInput" id="name" v-model.trim="patient.name" required="true" autofocus :class="{ 'p-invalid': submitted && !patient.name }" />
                        <small class="p-invalid" v-if="submitted && !patient.name">Nombre es requerido.</small>
                    </div>

                    <div class="field">
                        <label for="name">Apellidos</label>
                        <InputText :disabled="disabledInput" id="name" v-model.trim="patient.surnames" required="true" autofocus :class="{ 'p-invalid': submitted && !patient.surnames }" />
                        <small class="p-invalid" v-if="submitted && !patient.surnames">Apellido es requerido.</small>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="birthDate">Fecha de Nacimiento</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="patient.birthDate" dateFormat="dd/mm/yy" required="true"></Calendar>
                            <small class="p-invalid" v-if="submitted && !patient.birthDate">Fecha de nacimiento es requerido.</small>
                        </div>
                        <div class="field col">
                            <label for="phone">Teléfono</label>
                            <InputText id="phone" v-model.trim="patient.phone" :class="{ 'p-invalid': (submitted && !patient.phone) || !isValidPhone(patient.phone) }" />
                            <small class="p-invalid" v-if="(submitted && !patient.phone) || !isValidPhone(patient.phone)"> Teléfono es requerido o formato inválido</small>
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="sex">Sexo</label>
                            <Dropdown id="sex" v-model="patient.sex" :options="sexItems" optionLabel="name" placeholder="Selecciona" optionValue="code"></Dropdown>
                        </div>
                        <div class="field col">
                            <label for="role">Estado Civil</label>
                            <Dropdown id="civilStatus" v-model="patient.civilStatus" :options="civilStatusItems" optionLabel="name" placeholder="Selecciona" optionValue="code"></Dropdown>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="patient"
                            >¿Estás seguro de que quieres eliminar <b>{{ patient.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="patient">¿Está seguro de que desea eliminar los usuarios seleccionados?</span>
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
