<script setup>
import { ref, onMounted, watch } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const defaultMenuModel = [
    {
        label: 'Citas Medicas',
        items: [
            { label: 'Registarse', icon: 'pi pi-fw pi-user', to: '/signin', roles: ['Invitado'] },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/profile', roles: ['Administrador', 'Admisionista', 'Médico', 'Paciente'] },
            { label: 'Agendar Cita', icon: 'pi pi-fw pi-calendar-plus', to: '/quotes', roles: ['Paciente'] }
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
            { label: 'Gestión de Usuarios', icon: 'pi pi-fw pi-users', to: '/users', roles: ['Administrador'] }
        ]
    }
];

const model = ref([]);

function updateMenuModel() {
    const userRole = authStore.sessionUser ? authStore.role : 'Invitado';

    model.value = defaultMenuModel
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => item.roles.includes(userRole))
        }))
        .filter((section) => section.items.length > 0);
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
