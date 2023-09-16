<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDataUserStore } from '../../stores/dataUser';
import { dformat, dparse } from '../../utils/day';

const toast = useToast();
const dataUserStore = useDataUserStore();

const users = ref(null);
const user = ref({
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
        documentType: null,
        email: null,
        name: null,
        phone: null,
        photo: null,
        sex: null,
        surnames: null,
        userId: null
    }
});
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
const roleNames = ref({
    1: 'Administrador',
    2: 'Admisionista',
    3: 'Médico',
    4: 'Paciente'
});

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    await dataUserStore.getCollaborators().then((data) => {
        users.value = data.map((user) => {
            let birthDate = dformat(user.birthDate, 'DD MMMM YYYY');
            user.user.birthDate = birthDate;
            // Agrega el campo roleName basado en roleId
            user.roleName = roleNames.value[user.roleId];
            return user;
        });
    });

    console.log(users.value);
});

// const formatCurrency = (value) => {
//     return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
// };

const openNew = () => {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const saveUser = async () => {
    submitted.value = true;

    const { name, surnames, dni, birthDate, sex, userId } = user.value;

    if (name && name.trim() && surnames && dni && birthDate && sex) {
        const userId = authStore.user.userId;
        user.value.userId = userId;
        user.value.birthDate = new Date(dparse(birthDate));

        if (userId) {
            const userIndex = users.value.findIndex((item) => item.userId === userId);
            if (userIndex !== -1) {
                await updateDependent(userId, user.value);

                user.value.birthDate = dformat(user.value.birthDate, 'DD MMMM YYYY');
                users.value[userIndex] = user.value;
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Dependiente Actualizado', life: 3000 });
            }
        } else {
            const dataDependent = await dataUserStore.addUsersDependents(user.value);
            user.value.userId = dataDependent.userId;
            user.value.birthDate = dformat(user.value.birthDate, 'DD MMMM YYYY');
            users.value.push(user.value);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Dependiente Registrado', life: 3000 });
        }

        userDialog.value = false;
        user.value = {};
    }
};

const editUser = (editUser) => {
    user.value = { ...editUser };
    console.log('user', user);
    userDialog.value = true;
};

const confirmDeleteUser = (editUser) => {
    user.value = editUser;
    deleteUserDialog.value = true;
};

const deleteUser = () => {
    users.value = users.value.filter((val) => val.id !== user.value.id);
    deleteUserDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.value.length; i++) {
        if (users.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};
console.log(dt);

const confirmDeleteSelected = () => {
    deleteUsersDialog.value = true;
};
const deleteSelectedUsers = () => {
    users.value = users.value.filter((val) => !selectedUsers.value.includes(val));
    deleteUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
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
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                        </div>
                    </template>

                    <template v-slot:end>
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
                    <Column field="status" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span :class="'user-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                        </template>
                    </Column>
                    <!-- <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="contextPath + 'demo/images/user/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
                        </template>
                    </Column> -->
                    <!-- <Column field="price" header="Price" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Price</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="category" header="Category" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Category</span>
                            {{ slotProps.data.category }}
                        </template>
                    </Column>
                    <Column field="rating" header="Reviews" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Rating</span>
                            <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                        </template>
                    </Column>-->
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
                                <RadioButton id="dni" name="option" value="DNI" v-model="user.user.documentType" />
                                <label for="dni">DNI</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="ce" name="option" value="CE" v-model="user.user.documentType" />
                                <label for="ce">CE</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="pasaport" name="option" value="passport" v-model="user.user.documentType" />
                                <label for="pasaport">Pasaporte</label>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="dni">DNI</label>
                        <InputText id="name" v-model.trim="user.user.dni" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.dni }" />
                        <small class="p-invalid" v-if="submitted && !user.user.dni">DNI es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="name">Nombre</label>
                        <InputText id="name" v-model.trim="user.user.name" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.name }" />
                        <small class="p-invalid" v-if="submitted && !user.name">Nombre es requerido.</small>
                    </div>

                    <div class="field">
                        <label for="name">Apellidos</label>
                        <InputText id="name" v-model.trim="user.user.surnames" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.surnames }" />
                        <small class="p-invalid" v-if="submitted && !user.user.surnames">Apellido es requerido.</small>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="birthDate">Fecha de Nacimiento</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="user.user.birthDate" dateFormat="dd/mm/yy" required="true"></Calendar>
                            <small class="p-invalid" v-if="submitted && !user.birthDate">Fecha de nacimiento es requerido.</small>
                        </div>
                        <div class="field col">
                            <label for="sex">Sexo</label>
                            <Dropdown id="sex" v-model="user.user.sex" :options="sexItems" optionLabel="name" placeholder="Selecciona" optionValue="code"></Dropdown>
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
                        <span v-if="user"
                            >Are you sure you want to delete <b>{{ user.name }}</b
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
                        <span v-if="user">Are you sure you want to delete the selected users?</span>
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
