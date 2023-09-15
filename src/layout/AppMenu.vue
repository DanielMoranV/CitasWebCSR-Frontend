<script setup>
import { ref, onMounted, watch } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useAuthStore } from '../stores/auth';
import { useDataDoctorStore } from '../stores/dataDoctor';

const dataDoctorStore = useDataDoctorStore();

const authStore = useAuthStore();

const defaultMenuModel = [
    {
        label: 'Citas Medicas',
        items: [
            { label: 'Registarse', icon: 'pi pi-fw pi-user', to: '/signin', roles: ['Invitado'] },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/profile', roles: ['Administrador', 'Admisionista', 'Médico', 'Paciente'] },
            { label: 'Dependientes', icon: 'pi pi-fw pi-users', to: '/dependents', roles: ['Paciente'] },
            { label: 'Médicos', icon: 'pi pi-fw pi-plus', to: '/listdoctor', roles: ['Paciente'] },
            { label: 'Agendar Cita', icon: 'pi pi-fw pi-calendar-plus', to: '/quotes', roles: ['Paciente'] },
            { label: 'Seguimiento', icon: 'pi pi-fw pi-chart-line', to: '/tracking', roles: ['Paciente'] }
        ]
    },
    {
        label: 'Admisión',
        items: [{ label: 'Turnos Medicós', icon: 'pi pi-fw pi-list', to: '/shifts', roles: ['Admisionista'] }]
    },
    {
        label: 'Médico',
        items: [{ label: 'Atenciones', icon: 'pi pi-fw pi-book', to: '/attentions', roles: ['Médico'] }]
    },
    {
        label: 'Administración',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard', roles: ['Administrador'] },
            { label: 'Colaboradores', icon: 'pi pi-fw pi-users', to: '/users', roles: ['Administrador'] }
        ]
    }
];

const model = ref([]);

function updateMenuModel() {
    // Obtiene el rol del usuario actual desde el objeto authStore
    const userRole = authStore.sessionUser ? authStore.role : 'Invitado';

    // Verifica si existe un objeto doctor en dataDoctorStore
    const hasDoctor = dataDoctorStore.doctor !== null && typeof dataDoctorStore.doctor === 'object';

    // Filtra y modifica el modelo de menú en función del rol del usuario y la existencia de un doctor
    model.value = defaultMenuModel
        .map((section) => {
            if (section.label === 'Citas Medicas' && userRole === 'Paciente' && !hasDoctor) {
                // Si el usuario es 'Paciente' y no existe un doctor, excluye el elemento "Agendar Cita"
                return {
                    ...section,
                    items: section.items.filter((item) => item.roles.includes(userRole) && item.label !== 'Agendar Cita')
                };
            } else {
                // En otros casos, simplemente filtra según el rol del usuario
                return {
                    ...section,
                    items: section.items.filter((item) => item.roles.includes(userRole))
                };
            }
        })
        .filter((section) => section.items.length > 0);

    // Si existe un objeto doctor en dataDoctorStore, se muestra un mensaje en la consola
    if (hasDoctor) {
        console.log(dataDoctorStore.doctor);
    }
}
onMounted(async () => {
    await authStore.currentUser();
    updateMenuModel();
});

watch(
    () => authStore.sessionUser,
    async (newSession) => {
        model.value = defaultMenuModel;
        if (newSession) {
            await authStore.currentUser();
            updateMenuModel();
        }
    }
);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
