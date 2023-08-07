<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const userStore = useAuthStore();

const calendarValue = ref(null);
const loading = ref(false);
const password = ref('');
const password1 = ref('');
const updatePassword = async () => {
    loading.value = true;
    // Verificar si el correo electrónico y la contraseña son campos requeridos
    if (!password.value || !password1.value) {
        loading.value = false;
        return toast.add({ severity: 'warn', summary: 'Por favor complete los campos requeridos', life: 3000 });
    }
    // Verificar si las contraseñas son iguales
    if (password.value != password1.value) {
        loading.value = false;
        return toast.add({ severity: 'warn', summary: 'Las contraseñas no coinciden', life: 3000 });
    }

    // Verificar si los campos contienen espacios en blanco
    if (/\s/.test(password.value)) {
        loading.value = false;
        return toast.add({ severity: 'warn', summary: 'Los campos no pueden contener espacios en blanco', life: 3000 });
    }

    // Verificar si la contraseña tiene al menos 6 caracteres
    if (password.value.length < 6) {
        loading.value = false;
        return toast.add({ severity: 'warn', summary: 'La contraseña debe tener al menos 6 caracteres', life: 3000 });
    }
    const response = await userStore.updateAccessUser(password.value);
    if (response == 1) {
        toast.add({ severity: 'success', summary: 'Contraseña actualizada', life: 4000 });
        password.value = '';
        password1.value = '';

        loading.value = false;
    }
};
</script>
<template>
    <div className="card">
        <h5>Información Personal</h5>
        <p>Su contraseña por defecto será su DNI, cambiela regularmente para mayor seguridad</p>
    </div>
    <div className="grid">
        <div class="col-12 md:col-6">
            <div class="card p-fluid">
                <h5>Perfil</h5>
                <div class="field">
                    <label for="dni">DNI</label>
                    <InputText id="dni" type="text" :disabled="true" />
                </div>
                <div class="field">
                    <label for="name">Nombre</label>
                    <InputText id="name" type="text" :disabled="true" />
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <InputText id="email" type="text" />
                </div>
                <div class="field">
                    <label for="city">Fecha de Nacimiento</label>
                    <Calendar :showIcon="true" :showButtonBar="true" v-model="calendarValue" :disabled="true"></Calendar>
                </div>
                <div class="field">
                    <label for="phone">Teléfono</label>
                    <InputText id="phone" type="text" />
                </div>
                <Button label="Modificar" icon="pi pi-user" class="p-button-success col-12 md:col-3 mr-2 mb-2" :loading="loading" @click="load"></Button>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="card p-fluid">
                <h5>Modificar Contraseña</h5>
                <span class="p-float-label mt-6">
                    <Password id="password" type="password" :toggleMask="true" v-model="password" />
                    <label for="password">Contraseña</label>
                </span>
                <span class="p-float-label mt-5">
                    <Password id="password1" type="password" :toggleMask="true" v-model="password1" />
                    <label for="password1">Confirmar Contraseña</label>
                </span>
                <Toast />
                <Button label="Modificar" icon="pi pi-unlock" class="p-button-success col-12 md:col-3 mr-2 mb-2 mt-5" :loading="loading" @click="updatePassword"></Button>
            </div>
        </div>
    </div>
</template>
<style></style>
