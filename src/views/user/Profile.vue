<script setup>
import { ref } from 'vue';

const calendarValue = ref(null);
const loading = ref(false);
const updatePassword = () => {
    loading.value = true;
    setTimeout(() => (loading.value = false), 1000);
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
                <div class="field grid">
                    <label for="password1" class="col-12 mb-2 md:col-2 md:mb-0">Contraseña</label>
                    <div class="col-12 md:col-10">
                        <InputText id="password1" type="text" />
                    </div>
                </div>
                <div class="field grid">
                    <label for="password2" class="col-12 mb-2 md:col-2 md:mb-0">Confirmar Contraseña</label>
                    <div class="col-12 md:col-10">
                        <InputText id="password2" type="text" />
                    </div>
                </div>
                <Button label="Modificar" icon="pi pi-unlock" class="p-button-success col-12 md:col-3 mr-2 mb-2" :loading="loading" @click="updatePassword"></Button>
            </div>
        </div>
    </div>
</template>
<style></style>
