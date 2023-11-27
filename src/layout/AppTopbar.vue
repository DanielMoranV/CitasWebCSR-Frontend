<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const { logout } = useAuthStore();
const { layoutConfig, onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const dataUser = ref({ name: 'Bienvenido' });
const authStore = useAuthStore();
const getEssentialData = () => {
    try {
        if (authStore.sessionUser) {
            const userData = authStore.getEsential;
            dataUser.value = userData;
        }
    } catch (error) {
        console.log(error);
    }
};
onMounted(async () => {
    if (authStore.user) {
        await authStore.currentUser(authStore.user.username);
        getEssentialData();
    }

    bindOutsideClickListener();
});
// Observa cambios en la sesión del usuario
watch(
    () => authStore.sessionUser,
    async (newSession) => {
        if (newSession && authStore.user) {
            // La sesión del usuario ha cambiado, realiza acciones aquí
            await authStore.currentUser(authStore.user.username);
            getEssentialData();
            //console.log('La sesión del usuario ha cambiado topbar:', newSession);
        }
    }
);

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});
const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const signOutClick = async () => {
    topbarMenuActive.value = false;
    await logout();
    router.push('/');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
const onProfileClick = () => {
    topbarMenuActive.value = false;
    router.push('/profile');
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onProfileClick()" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>{{ dataUser.name }}</span>
            </button>
            <button @click="onSettingsClick()" class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>{{ dataUser.role }}</span>
            </button>

            <button @click="signOutClick()" class="p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
