<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import { ref, onBeforeMount, watch, onMounted, reactive } from 'vue';
import { useDataUserStore } from '../../../stores/dataUser';
import { fetchUsers } from '../../../api';
const dataUserStore = useDataUserStore();
const medicalTable = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);

const state = reactive({
    users: [],
    loading: false
});
async function fetchData() {
    state.loading = true;
    const value = await fetchUsers();
    state.users = value.data;
    state.loading = false;
}

// Observar cambios en la propiedad dataUser del store
watch(
    () => dataUserStore.dataUser,
    (newDataUser) => {
        // Actualizar users.value con los nuevos datos de usuario
        users.value = newDataUser;
    }
);

const users = ref(null);
const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const customerService = new CustomerService();

onBeforeMount(() => {
    customerService.getCustomersLarge().then((data) => {
        medicalTable.value = data;
        loading1.value = false;
        medicalTable.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });

    initFilters1();
});
onMounted(async () => {
    fetchData();
    await dataUserStore.getUsers();
    users.value = dataUserStore.dataUser;
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter1 = () => {
    initFilters1();
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
</script>
<template>
    <div class="flex align-items-center py-5 px-3">
        <i class="pi-fw fa-solid fa-user-doctor mr-2 text-3xl" />
        <p class="m-0 text-lg">Seleccione el médico a consultar.</p>
    </div>
    <DataTable
        :value="medicalTable"
        :paginator="true"
        class="p-datatable-gridlines"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters1"
        filterDisplay="menu"
        :loading="loading1"
        :filters="filters1"
        responsiveLayout="scroll"
        :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
    >
        <template #header>
            <div class="flex justify-content-between flex-column sm:flex-row">
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar Filtros" class="p-button-outlined mb-2" @click="clearFilter1()" />
                <span class="p-input-icon-left mb-2">
                    <i class="pi pi-search" />
                    <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                </span>
            </div>
        </template>
        <template #empty> No se encontraron resultados </template>
        <template #loading> Cargando datos de médicos. Espere por favor.</template>
        <Column header="Especialidad" filterField="country.name" style="min-width: 12rem">
            <template #body="{ data }">
                <img src="/demo/images/flag/flag_placeholder.png" :alt="data.country.name" :class="'flag flag-' + data.country.code" width="30" />
                <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.country.name }}</span>
            </template>
            <template #filter="{ filterModel }">
                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country" />
            </template>
            <template #filterclear="{ filterCallback }">
                <Button type="button" icon="pi pi-times" @click="filterCallback()" class="p-button-secondary"></Button>
            </template>
            <template #filterapply="{ filterCallback }">
                <Button type="button" icon="pi pi-check" @click="filterCallback()" class="p-button-success"></Button>
            </template>
        </Column>
        <Column header="Médico" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
            <template #body="{ data }">
                <img :alt="data.representative.name" :src="'demo/images/avatar/' + data.representative.image" width="32" style="vertical-align: middle" />
                <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.representative.name }}</span>
            </template>
            <template #filter="{ filterModel }">
                <div class="mb-3 text-bold">Agent Picker</div>
                <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Todos" class="p-column-filter">
                    <template #option="slotProps">
                        <div class="p-multiselect-representative-option">
                            <img :alt="slotProps.option.name" :src="'demo/images/avatar/' + slotProps.option.image" width="32" style="vertical-align: middle" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ slotProps.option.name }}</span>
                        </div>
                    </template>
                </MultiSelect>
            </template>
        </Column>
        <Column header="Horario" filterField="date" dataType="date" style="min-width: 10rem">
            <template #body="{ data }">
                {{ formatDate(data.date) }}
            </template>
            <template #filter="{ filterModel }">
                <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
            </template>
        </Column>
        <Column header="Precio Consulta" filterField="balance" dataType="numeric" style="min-width: 10rem">
            <template #body="{ data }">
                {{ formatCurrency(data.balance) }}
            </template>
            <template #filter="{ filterModel }">
                <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
            </template>
        </Column>
        <Column header="Acción" bodyClass="text-center" style="min-width: 8rem">
            <template #body><Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2 mb-2" /> </template>
        </Column>
    </DataTable>
</template>
