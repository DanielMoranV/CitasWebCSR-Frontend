<script setup>
import { ref, onMounted } from 'vue';
const radioValue = ref(null);
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
const sexItem = ref(null);
const civilStatusItem = ref(null);
const calendarValue = ref(null);

const loading = ref(false);
const load = () => {
    loading.value = true;
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
                            <RadioButton id="dni" name="option" value="dni" v-model="radioValue" />
                            <label for="dni">DNI</label>
                        </div>
                    </div>
                    <div class="col-4 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="ce" name="option" value="ce" v-model="radioValue" />
                            <label for="ce">CE</label>
                        </div>
                    </div>
                    <div class="col-4 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="pasaport" name="option" value="passport" v-model="radioValue" />
                            <label for="pasaport">Pasaporte</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field col-12 md:col-6">
                <label for="document">Número de documento</label>
                <InputText id="document" type="text" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="name">Nombre</label>
                <InputText id="name" type="text" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="surnames">Apellidos</label>
                <InputText id="surnames" type="text" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="email">Email</label>
                <InputText id="email" type="text" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="address">Dirección</label>
                <InputText id="address" type="text" />
            </div>
            <div class="field col-12 md:col-3">
                <label for="city">Fecha de Nacimiento</label>
                <Calendar :showIcon="true" :showButtonBar="true" v-model="calendarValue"></Calendar>
            </div>
            <div class="field col-12 md:col-3">
                <label for="sex">Sexo</label>
                <Dropdown id="sex" v-model="sexItem" :options="sexItems" optionLabel="name" placeholder="Selecciona"></Dropdown>
            </div>
            <div class="field col-12 md:col-3">
                <label for="civilStatus">Estado Civil</label>
                <Dropdown id="civilStatus" v-model="civilStatusItem" :options="civilStatusItems" optionLabel="name" placeholder="Selecciona"></Dropdown>
            </div>
            <div class="field col-12 md:col-3">
                <label for="phone">Teléfono</label>
                <InputText id="phone" type="text" />
            </div>
        </div>
        <div class="buttoncalendar"><Button label="Agendar Cita" icon="pi pi-calendar" class="p-button-success col-12 md:col-3 mr-2 mb-2" :loading="loading" @click="load"></Button></div>
    </div>
</template>
<style>
.buttoncalendar {
    margin-top: 2em;
    display: flex;
    justify-content: right;
}
</style>
