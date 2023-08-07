<script setup>
import { ref, onMounted } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useAuthStore } from '../stores/auth';

const userStore = useAuthStore();
const model = ref([
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
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard', roles: ['Administrador'] }]
    }
]);

onMounted(async () => {
    await userStore.currentUser();
    if (userStore.sessionUser) {
        const role = userStore.role;

        // Filter items based on the user's role
        model.value = model.value.map((section) => {
            return {
                ...section,
                items: section.items.filter((item) => item.roles.includes(role))
            };
        });
    } else {
        // Filter items for 'Invitado' role
        model.value = model.value.map((section) => {
            return {
                ...section,
                items: section.items.filter((item) => item.roles.includes('Invitado'))
            };
        });
    }
    // Remove sections with no items after filtering
    model.value = model.value.filter((section) => section.items.length > 0);
});
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
