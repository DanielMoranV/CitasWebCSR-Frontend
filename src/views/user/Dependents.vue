<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { useDataUserStore } from '../../stores/dataUser';
import { useAuthStore } from '../../stores/auth';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const dataUserStore = useDataUserStore();
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

const showToast = (severity, summary, life) => {
    toast.add({ severity, summary, life });
};

const validateRequiredFields = () => {
    const requiredFields = ['documentType', 'dni', 'name', 'surnames', 'phone', 'email', 'address', 'birthDate', 'sex', 'civilStatus'];

    for (const field of requiredFields) {
        if (!dataUser[field]) {
            showToast('error', 'Por favor, complete todos los campos obligatorios.', 3000);
            return false; // Detener la función si falta algún dato
        }
    }

    return true; // Todos los campos están completos
};

const validateAge = () => {
    const today = new Date();
    const birthDate = new Date(dataUser.birthDate);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
        showToast('error', 'Debes ser mayor de edad para registrarte. Registra a tu padre o apoderado', 5000);
        return false; // Detener la función si es menor de edad
    }

    return true; // Es mayor de edad
};

const signinUser = async () => {
    if (!validateRequiredFields() || !validateAge()) {
        return; // Detener la función si no se cumplen las validaciones
    }

    loading.value = true;
    console.log(dataUser);

    await dataUserStore.addPatients(dataUser);

    if (dataUserStore.msg === 'Violación de la restricción única.') {
        showToast('error', 'DNI registrado anteriormente!', 5000);
        loading.value = false;
        return;
    }

    const loginUser = {
        username: dataUser.dni,
        password: dataUser.dni
    };

    console.log(loginUser);
    await authStore.login(loginUser);
    console.log('mensaje user', dataUserStore.msg);

    if (authStore.sessionUser) {
        showToast('success', 'Validación Correcta Bienvenido', 3000);
        //setTimeout(() => router.push('/quotes'), 2000);
    }

    setTimeout(() => (loading.value = false), 1000);
};
const loginUser = () => {
    setTimeout(() => router.push('/auth/login'), 500);
};
const displayConfirmation = ref(false);
const openConfirmation = () => {
    displayConfirmation.value = true;
};

const closeConfirmation = () => {
    displayConfirmation.value = false;
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
                <label for="birthDate">Fecha de Nacimiento</label>
                <Calendar :showIcon="true" :showButtonBar="true" v-model="dataUser.birthDate" dateFormat="dd/mm/yy"></Calendar>
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

        <Button label="Agendar Cita" icon="pi pi-calendar" class="p-button-success col-12 md:col-3 mr-2 mb-2" :loading="loading" @click="signinUser"></Button>
        <Button label="Ya estas registrado ?" icon="pi pi-user" class="p-button-info col-12 md:col-3 p-button-text mr-2 mb-2" @click="loginUser"></Button>
        <Dialog header="Confirmación" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>¿El paciente es menor de edad o dependiente?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
                <Button label="Yes" icon="pi pi-check" @click="closeConfirmation" class="p-button-text" autofocus />
            </template>
        </Dialog>
    </div>
</template>
<style></style>