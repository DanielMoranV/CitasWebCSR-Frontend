<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDataDoctorStore } from '../../stores/dataDoctor';
import { useDataUserStore } from '../../stores/dataUser';
import { dformat, dparse } from '../../utils/day';
import { useRouter } from 'vue-router';
import cache from '../../utils/cache';

const router = useRouter();
const toast = useToast();
const dataDoctorStore = useDataDoctorStore();
const dataUserStore = useDataUserStore();

const users = ref(null);

const dt = ref(null);
const filters = ref({});

const nextSchedule = (dataDoctor) => {
    dataDoctorStore.doctor = dataDoctor;
    cache.setItem('doctor', dataDoctor);

    router.push('/timetable');
};

const roleNames = ref({
    3: 'Médico'
});

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

                <DataTable
                    ref="dt"
                    :value="users"
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
                            <h5 class="m-0">Lista de Médicos</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
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
                    <Column field="user.Doctor.specialization" header="Especialidad" :sortable="true" headerStyle="width:14%; min-width:10rem;">
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
                            <Button icon="pi pi-calendar-plus" class="p-button-rounded p-button-info mr-2" @click="nextSchedule(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
@import '@/assets/styles/badges.scss';
</style>
