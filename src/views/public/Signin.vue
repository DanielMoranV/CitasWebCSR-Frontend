<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { useDataauthStore } from '../../stores/dataUser';
import { useAuthStore } from '../../stores/auth';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const authDataStore = useDataauthStore();
// Observa cambios en la sesión del usuario
watch(
    () => authStore.sessionUser,
    async (newSession) => {
        if (newSession) {
            // La sesión del usuario ha cambiado, realiza acciones aquí
            await authStore.currentUser();
            //console.log('La sesión del usuario ha cambiado signin:', newSession);
        }
        //console.log('La sesión del usuario ha cambiado signin else:', newSession);
    }
);
const sexItems = ref([
    { name: 'Masculino', code: 'Masculino' },
    { name: 'Femenino', code: 'Femenino' }
]);
const civilStatusItems = ref([
    { name: 'Soltero', code: 'Soltero' },
    { name: 'Casado', code: 'Casado' },
    { name: 'Divorciado', code: 'Divorciado' },
    { name: 'Viudo', code: 'Viudo' }
]);

const dataUser = reactive({
    documentType: '',
    dni: '',
    name: '',
    surnames: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    sex: '',
    civilStatus: ''
});

const loading = ref(false);
const signinUser = async () => {
    loading.value = true;
    await authDataStore.addPatients(dataUser);
    const loginUser = {
        username: dataUser.dni,
        password: dataUser.dni
    };
    console.log(loginUser);
    await authStore.login(loginUser);
    console.log(authStore.msg);
    if (authStore.sessionUser) {
        // Mostrar el toast
        toast.add({ severity: 'success', summary: 'Validación Correcta Bienvenido', life: 3000 });
        //window.location.reload();
        setTimeout(() => router.push('/profile'), 2000);
    }
    setTimeout(() => (loading.value = false), 1000);
};
onMounted(() => {
    //console.log(radioValue);
});
</script>
<template>
    <div class="card">
        <h5>Datos Personales</h5>

        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
                <label>Tipo de documento</label>
                <div class="grid mt-2">
                    <div class="col-4 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="dni" name="option" value="DNI" v-model="dataUser.documentType" />
                            <label for="dni">DNI</label>
                        </div>
                    </div>
                    <div class="col-4 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="ce" name="option" value="CE" v-model="dataUser.documentType" />
                            <label for="ce">CE</label>
                        </div>
                    </div>
                    <div class="col-4 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="pasaport" name="option" value="passport" v-model="dataUser.documentType" />
                            <label for="pasaport">Pasaporte</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field col-12 md:col-6">
                <label for="document">Número de documento</label>
                <InputText id="document" type="text" v-model="dataUser.dni" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="name">Nombre</label>
                <InputText id="name" type="text" v-model="dataUser.name" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="surnames">Apellidos</label>
                <InputText id="surnames" type="text" v-model="dataUser.surnames" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="email">Email</label>
                <InputText id="email" type="text" v-model="dataUser.email" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="address">Dirección</label>
                <InputText id="address" type="text" v-model="dataUser.address" />
            </div>
            <div class="field col-12 md:col-3">
                <label for="city">Fecha de Nacimiento</label>
                <Calendar :showIcon="true" :showButtonBar="true" v-model="dataUser.birthDate"></Calendar>
            </div>
            <div class="field col-12 md:col-3">
                <label for="sex">Sexo</label>
                <Dropdown id="sex" v-model="dataUser.sex" :options="sexItems" optionLabel="name" placeholder="Selecciona" optionValue="code"></Dropdown>
            </div>
            <div class="field col-12 md:col-3">
                <label for="civilStatus">Estado Civil</label>
                <Dropdown id="civilStatus" v-model="dataUser.civilStatus" :options="civilStatusItems" optionLabel="name" placeholder="Selecciona" optionValue="code"></Dropdown>
            </div>
            <div class="field col-12 md:col-3">
                <label for="phone">Teléfono</label>
                <InputText id="phone" type="text" v-model="dataUser.phone" />
            </div>
        </div>
        <Toast />
        <div class="buttoncalendar"><Button label="Agendar Cita" icon="pi pi-calendar" class="p-button-success col-12 md:col-3 mr-2 mb-2" :loading="loading" @click="signinUser"></Button></div>
    </div>
</template>
<style>
.buttoncalendar {
    margin-top: 2em;
    display: flex;
    justify-content: right;
}
</style>
