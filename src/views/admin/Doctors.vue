<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDataDoctorStore } from '../../stores/dataDoctor';
import { useDataUserStore } from '../../stores/dataUser';
import { dformat, dparse } from '../../utils/day';
//import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useRouter } from 'vue-router';
import cache from '../../utils/cache';

const router = useRouter();
const toast = useToast();
const dataDoctorStore = useDataDoctorStore();
const dataUserStore = useDataUserStore();

const users = ref(null);
const user = ref({});
const userDialog = ref(false);
const priceDialog = ref(false);
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
const nextSchedule = (dataDoctor) => {
    dataDoctorStore.doctor = dataDoctor;
    cache.setItem('doctor', dataDoctor);

    router.push('/timetable');
};
const roleItems = ref([{ name: 'Médico', code: 3 }]);

const roleNames = ref({
    3: 'Médico'
});
const isValidDni = (value) => {
    if (user.value.user.documentType === 'DNI') {
        // Para DNI, verificar que solo contiene 8 dígitos de 0-9
        return /^\d{8}$/.test(value);
    } else if (user.value.user.documentType === 'CE') {
        // Para Carnet de extranjería, verificar que solo contiene 9 dígitos de 0-9
        return /^\d{9}$/.test(value);
    } else if (user.value.user.documentType === 'Pasaporte') {
        // Para Pasaporte, verificar que contiene letras y números y tiene hasta 20 caracteres
        return /^[A-Za-z0-9]{5,20}$/.test(value);
    }
    return true; // Permitir otros tipos de documento sin restricciones
};

onBeforeMount(() => {
    initFilters();
});
const filename = `listcolaborator-${dformat(new Date(), 'DD-MM-YYYY')}`;
onMounted(async () => {
    await dataDoctorStore.getDoctors().then((data) => {
        users.value = data.map((user) => {
            let birthDate = dformat(user.user.birthDate, 'DD MMMM YYYY');
            user.user.birthDate = birthDate;
            // Agrega el campo roleName basado en roleId
            user.roleName = roleNames.value[user.roleId];
            return user;
        });
    });
});

const openNew = () => {
    user.value = {
        accessId: null,
        active: null,
        createAt: null,
        lastSession: null,
        password: null,
        roleId: null,
        roleName: null,
        status: null,
        user: {
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
            userId: null,
            Doctor: {
                cpm: null,
                doctorId: null,
                rne: null,
                specialization: null,
                status: null,
                userId: null,
                personalizedPrices: [
                    {
                        personalizedPrice: null,
                        medicalServiceId: 1
                    }
                ]
            }
        }
    };
    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    priceDialog.value = false;
    submitted.value = false;
};

const validateRequiredFields = () => {
    const userValue = user.value.user;
    return userValue.name && userValue.name.trim() && userValue.surnames && userValue.dni && userValue.birthDate && userValue.sex && user.value.user.Doctor.status && isValidDni(userValue.dni);
};

const updateUser = async () => {
    const payload = {
        address: user.value.user.address,
        birthDate: dparse(new Date(user.value.user.birthDate)),
        civilStatus: user.value.user.civilStatus,
        dni: user.value.user.dni,
        documentType: user.value.user.documentType,
        email: user.value.user.email,
        name: user.value.user.name,
        phone: user.value.user.phone,
        photo: user.value.user.photo,
        sex: user.value.user.sex,
        surnames: user.value.user.surnames,
        access: {
            username: `${user.value.user.dni}-${3}`,
            password: user.value.user.dni,
            roleId: 3
        },
        Doctor: {
            status: user.value.user.Doctor.status,
            cmp: user.value.user.Doctor.cmp,
            rne: user.value.user.Doctor.rne,
            specialization: user.value.user.Doctor.specialization,
            personalizedPrices: [
                {
                    personalizedPrice: user.value.user.Doctor.personalizedPrices[0].personalizedPrice,
                    medicalServiceId: 1
                }
            ]
        }
    };
    if (user.value.accessId) {
        const userIndex = users.value.findIndex((item) => item.accessId === user.value.accessId);
        if (userIndex !== -1) {
            payload.access.accessId = user.value.accessId;
            payload.userId = user.value.user.userId;
            payload.Doctor.doctorId = user.value.user.Doctor.doctorId;
            // payload.Doctor.personalizedPrices = [
            //     {
            //         personalizedPriceId: user.value.user.Doctor.personalizedPrices[0].personalizedPriceId,
            //         doctorId: user.value.user.Doctor.doctorId
            //     }
            // ];
            payload.Doctor.personalizedPrices[0].personalizedPriceId = user.value.user.Doctor.personalizedPrices[0].personalizedPriceId;
            payload.Doctor.personalizedPrices[0].doctorId = user.value.user.Doctor.doctorId;
            console.log('user:', user.value);
            console.log('payload', payload);
            await dataUserStore.updateUser(payload.dni, payload.access.accessId, payload.Doctor.doctorId, payload.Doctor.personalizedPrices[0].personalizedPriceId, payload);

            user.value.roleName = roleNames.value[user.value.roleId];
            users.value[userIndex] = user.value;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Médico Actualizado', life: 3000 });
        }
    } else {
        console.log(payload);
        const dataUser = await dataUserStore.addUsers(payload);
        console.log(dataUser);
        if (dataUser == 'Violación de la restricción única.') {
            toast.add({ severity: 'error', summary: 'Error', detail: 'DNI o CMP ya registrados, corregir', life: 3000 });
            return;
        } else {
            console.log(dataUser.value);
            user.value.accessId = dataUser.access[0].accessId;
            user.value.roleName = roleNames.value[dataUser.access[0].roleId];
            user.value.status = 'offline';
            users.value.push(user.value);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Médico Registrado', life: 3000 });
        }
    }

    userDialog.value = false;
    user.value = {};
};

const saveUser = async () => {
    submitted.value = true;

    if (validateRequiredFields()) {
        updateUser();
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Datos imcompletos por favor llenar todo el formulario', life: 3000 });
    }
};

const editUser = (editUser) => {
    console.log(editUser);
    user.value = { ...editUser };
    userDialog.value = true;
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
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Médico deshabilitado', life: 3000 });
};

const exportCSV = () => {
    console.log(dt.value);
    dt.value.exportCSV();
};
// const exportToExcel = () => {
//     // Obtén los datos de la tabla
//     const data = dt.value.value.map((row) => ({ ...row }));

//     // Crea una hoja de cálculo a partir de los datos
//     const worksheet = XLSX.utils.json_to_sheet(data);

//     // Crea un libro de trabajo y añade la hoja de cálculo
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//     // Escribe el libro de trabajo a un archivo Excel
//     const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

//     // Guarda el archivo en el sistema del cliente
//     saveAs(new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${filename}.xlsx`);
// };

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
    users.value = users.value.filter((val) => !selectedUsers.value.includes(val));
    const selectedIds = selectedUsers.value.map((user) => user.accessId);

    selectedIds.forEach(async (accessId) => {
        await dataUserStore.disableUser(accessId);
    });
    deleteUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Médicos deshabilitados', life: 3000 });
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
                    :value="users"
                    v-model:selection="selectedUsers"
                    dataKey="accessId"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Colaboradores"
                    responsiveLayout="scroll"
                    :exportFilename="filename"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Gestión de Médicos</h5>
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
                            {{ slotProps.data.user.dni }}
                        </template>
                    </Column>
                    <Column field="user.name" header="Nombre" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre</span>
                            {{ slotProps.data.user.name }}
                        </template>
                    </Column>
                    <Column field="user.surnames" header="Apellidos" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Apellidos</span>
                            {{ slotProps.data.user.surnames }}
                        </template>
                    </Column>
                    <Column field="roleName" header="Rol" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Rol</span>
                            {{ slotProps.data.roleName }}
                        </template>
                    </Column>
                    <Column field="user.doctors.specialization" header="Especialidad" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Rol</span>
                            {{ slotProps.data.user.Doctor.specialization }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span :class="'user-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;" header="Acciones">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUser(slotProps.data)" />
                            <Button icon="pi pi-calendar-plus" class="p-button-rounded p-button-info mr-2" @click="nextSchedule(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUser(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="userDialog" :style="{ width: '500px' }" header="Detalle de Médico" :modal="true" class="p-fluid">
                    <!-- <img :src="contextPath + 'demo/images/user/' + user.image" :alt="user.image" v-if="user.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label class="mb-3">Tipo de documento</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-4">
                                <RadioButton id="dni" name="option" value="DNI" v-model="user.user.documentType" />
                                <label for="dni">DNI</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="ce" name="option" value="CE" v-model="user.user.documentType" />
                                <label for="ce">CE</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="pasaport" name="option" value="Pasaporte" v-model="user.user.documentType" />
                                <label for="pasaport">Pasaporte</label>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="dni">{{ user.documentType }}</label>
                        <InputText id="dni" v-model.trim="user.user.dni" required="true" autofocus :class="{ 'p-invalid': (submitted && !user.user.dni) || !isValidDni(user.user.dni) }" />
                        <small class="p-invalid" v-if="(submitted && !user.user.dni) || !isValidDni(user.user.dni)">{{ user.user.documentType }} es requerido o formato inválido</small>
                    </div>
                    <div class="field">
                        <label for="name">Nombre</label>
                        <InputText id="name" v-model.trim="user.user.name" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.name }" />
                        <small class="p-invalid" v-if="submitted && !user.user.name">Nombre es requerido.</small>
                    </div>

                    <div class="field">
                        <label for="surnames">Apellidos</label>
                        <InputText id="surnames" v-model.trim="user.user.surnames" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.surnames }" />
                        <small class="p-invalid" v-if="submitted && !user.user.surnames">Apellido es requerido.</small>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="birthDate">Fecha de Nacimiento</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="user.user.birthDate" dateFormat="dd/mm/yy" required="true"></Calendar>
                            <small class="p-invalid" v-if="submitted && !user.birthDate">Fecha de nacimiento es requerido.</small>
                        </div>
                        <div class="field col">
                            <label for="phone">Teléfono</label>
                            <InputText id="phone" v-model.trim="user.user.phone" />
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="sex">Sexo</label>
                            <Dropdown id="sex" v-model="user.user.sex" :options="sexItems" optionLabel="name" placeholder="Selecciona" optionValue="code"></Dropdown>
                            <small class="p-invalid" v-if="submitted && !user.user.sex">Sexo es requerido.</small>
                        </div>
                        <div class="field col">
                            <label for="status">Estado</label><br />
                            <InputSwitch id="status" v-model.trim="user.user.Doctor.status" />
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="cpm">CMP</label>
                            <InputText id="cmp" v-model.trim="user.user.Doctor.cmp" />
                        </div>
                        <div class="field col">
                            <label for="rne">RNE</label>
                            <InputText id="rne" v-model.trim="user.user.Doctor.rne" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="specialization">Especialidad</label>
                        <InputText id="specialization" v-model.trim="user.user.Doctor.specialization" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.Doctor.specialization }" />
                        <small class="p-invalid" v-if="submitted && !user.user.Doctor.specialization">Especialidad es requerida.</small>
                    </div>
                    <div class="field">
                        <label for="personalizedPrice">Costo de Consulta</label>
                        <InputNumber
                            v-model="user.user.Doctor.personalizedPrices[0].personalizedPrice"
                            inputId="personalizedPrice"
                            mode="currency"
                            currency="PEN"
                            locale="es-PE"
                            required="true"
                            autofocus
                            :class="{ 'p-invalid': submitted && !user.user.Doctor.personalizedPrices[0].personalizedPrice }"
                        />
                        <small class="p-invalid" v-if="submitted && !user.user.Doctor.personalizedPrices[0].personalizedPrice">Especialidad es requerida.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >¿Estás seguro de que quieres eliminar <b>{{ user.user.name }}</b
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
