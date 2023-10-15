<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDataUserStore } from '../../stores/dataUser';
import { useAuthStore } from '../../stores/auth';
import { dformat, dparse } from '../../utils/day';
import { updateDependent } from '../../api';

const toast = useToast();
const dataUserStore = useDataUserStore();
const authStore = useAuthStore();

const dependents = ref(null);
const dependentDialog = ref(false);
const deleteDependentDialog = ref(false);
const deleteDependentsDialog = ref(false);
const dependent = ref({});

const selectedDependents = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sexItems = ref([
    { name: 'Masculino', code: 'Masculino' },
    { name: 'Femenino', code: 'Femenino' }
]);

onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    const userId = authStore.user.username;
    await dataUserStore.getUsersDependents(userId).then((data) => {
        dependents.value = data.map((dependent) => {
            let birthDate = dformat(dependent.birthDate, 'DD MMMM YYYY');
            dependent.birthDate = birthDate;
            return dependent;
        });
    });
});

const openNew = () => {
    dependent.value = {};
    dependent.value.documentType = 'DNI';
    submitted.value = false;
    dependentDialog.value = true;
};

const hideDialog = () => {
    dependentDialog.value = false;
    submitted.value = false;
};
const isValidDni = (value) => {
    if (dependent.value.documentType === 'DNI') {
        // Para DNI, verificar que solo contiene 8 dígitos de 0-9
        return /^\d{8}$/.test(value);
    } else if (dependent.value.documentType === 'CE') {
        // Para Carnet de extranjería, verificar que solo contiene 9 dígitos de 0-9
        return /^\d{9}$/.test(value);
    } else if (dependent.value.documentType === 'Pasaporte') {
        // Para Pasaporte, verificar que contiene letras y números y tiene hasta 20 caracteres
        return /^[A-Za-z0-9]{5,20}$/.test(value);
    }
    return true; // Permitir otros tipos de documento sin restricciones
};

const saveDependent = async () => {
    submitted.value = true;
    const { name, surnames, dni, birthDate, sex, dependentId } = dependent.value;

    if (name && name.trim() && surnames && dni && birthDate && sex && isValidDni(dependent.value.dni)) {
        const userId = authStore.user.userId;
        dependent.value.userId = userId;
        dependent.value.birthDate = new Date(dparse(birthDate));

        if (dependentId) {
            const dependentIndex = dependents.value.findIndex((item) => item.dependentId === dependentId);
            if (dependentIndex !== -1) {
                await updateDependent(dependentId, dependent.value);

                dependent.value.birthDate = dformat(dependent.value.birthDate, 'DD MMMM YYYY');
                dependents.value[dependentIndex] = dependent.value;
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Dependiente Actualizado', life: 3000 });
            }
        } else {
            const dataDependent = await dataUserStore.addUsersDependents(dependent.value);
            dependent.value.dependentId = dataDependent.dependentId;
            dependent.value.birthDate = dformat(dependent.value.birthDate, 'DD MMMM YYYY');
            dependents.value.push(dependent.value);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Dependiente Registrado', life: 3000 });
        }

        dependentDialog.value = false;
        dependent.value = {};
    }
};
const editDependent = (editDependent) => {
    dependent.value = { ...editDependent };
    dependentDialog.value = true;
};

const confirmDeleteDependent = (editDependent) => {
    dependent.value = editDependent;
    deleteDependentDialog.value = true;
};

const deleteDependent = async () => {
    dependents.value = dependents.value.filter((val) => val.dependentId !== dependent.value.dependentId);
    await dataUserStore.deleteUserDependents(dependent.value.dependentId);
    deleteDependentDialog.value = false;
    dependent.value = {};
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Dependiente eliminado', life: 3000 });
};

// const exportCSV = () => {
//     dt.value.exportCSV();
// };

const confirmDeleteSelected = () => {
    deleteDependentsDialog.value = true;
};
const deleteSelectedDependents = () => {
    dependents.value = dependents.value.filter((val) => !selectedDependents.value.includes(val));
    const selectedIds = selectedDependents.value.map((dependent) => dependent.dependentId);

    selectedIds.forEach(async (dependentId) => {
        await dataUserStore.deleteUserDependents(dependentId);
    });
    deleteDependentsDialog.value = false;
    selectedDependents.value = null;
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Dependientes eliminados', life: 3000 });
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
                            <Button label="Nuevo Dependiente" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedDependents || !selectedDependents.length" />
                        </div>
                    </template>

                    <!-- <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template> -->
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="dependents"
                    v-model:selection="selectedDependents"
                    dataKey="dependentId"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del  {first} al {last} de {totalRecords} dependientes"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Administrar dependientes</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="dni" header="DNI" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">DNI</span>
                            {{ slotProps.data.dni }}
                        </template>
                    </Column>
                    <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="surnames" header="Apellidos" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Apellidos</span>
                            {{ slotProps.data.surnames }}
                        </template>
                    </Column>
                    <Column field="birthDate" header="Fecha Nacimiento" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Nacimiento</span>
                            {{ slotProps.data.birthDate }}
                        </template>
                    </Column>
                    <Column field="sex" header="Sexo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Sexo</span>
                            {{ slotProps.data.sex }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editDependent(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteDependent(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="dependentDialog" :style="{ width: '450px' }" header="Datos de usuario" :modal="true" class="p-fluid">
                    <!-- <img :src="'demo/images/dependent/' + dependent.image" :alt="dependent.image" v-if="dependent.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label class="mb-3">Tipo de documento</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-4">
                                <RadioButton id="dni" name="option" value="DNI" v-model="dependent.documentType" />
                                <label for="dni">DNI</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="ce" name="option" value="CE" v-model="dependent.documentType" />
                                <label for="ce">CE</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="pasaport" name="option" value="Pasaporte" v-model="dependent.documentType" />
                                <label for="pasaport">Pasaporte</label>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="dni">{{ dependent.documentType }}</label>
                        <InputText id="name" v-model.trim="dependent.dni" required="true" autofocus :class="{ 'p-invalid': (submitted && !dependent.dni) || !isValidDni(dependent.dni) }" />
                        <small class="p-invalid" v-if="(submitted && !dependent.dni) || !isValidDni(dependent.dni)">{{ dependent.documentType }} es requerido o formato inválido</small>
                    </div>
                    <div class="field">
                        <label for="name">Nombre</label>
                        <InputText id="name" v-model.trim="dependent.name" required="true" autofocus :class="{ 'p-invalid': submitted && !dependent.name }" />
                        <small class="p-invalid" v-if="submitted && !dependent.name">Nombre es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="name">Apellidos</label>
                        <InputText id="name" v-model.trim="dependent.surnames" required="true" autofocus :class="{ 'p-invalid': submitted && !dependent.surnames }" />
                        <small class="p-invalid" v-if="submitted && !dependent.surnames">Apellido es requerido.</small>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="birthDate">Fecha de Nacimiento</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="dependent.birthDate" dateFormat="dd/mm/yy" required="true"></Calendar>
                            <small class="p-invalid" v-if="submitted && !dependent.birthDate">Fecha de nacimiento es requerido.</small>
                        </div>
                        <div class="field col">
                            <label for="sex">Sexo</label>
                            <Dropdown id="sex" v-model="dependent.sex" :options="sexItems" optionLabel="name" placeholder="Selecciona" optionValue="code"></Dropdown>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveDependent" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDependentDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dependent"
                            >¿Estás seguro de que quieres eliminar a <b>{{ dependent.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDependentDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDependent" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDependentsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dependent">¿Está seguro de que desea eliminar los dependientes seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDependentsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDependents" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
