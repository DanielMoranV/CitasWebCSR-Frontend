<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDataAppointmentStore } from '../../../stores/dataAppointment';
import { dformat } from '../../../utils/day';
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig, onMenuToggle } = useLayout();
const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
console.log(logoUrl.value);
const publicKey = import.meta.env.PUBLIC_KEY;

const dataAppointmentStore = useDataAppointmentStore();
const router = useRouter();

const appointment = ref(null);
const displayPaymentMethod = ref(false);
const displayYape = ref(false);
const displayCard = ref(false);
const loading = ref(false);
const documentType = ref(null);

const paymentValues = ref({
    amount: null,
    paymentDate: null,
    appointmentId: null,
    paymentMethodId: null,
    VoucherTypeId: null,
    userId: null
});

const close = () => {
    displayPaymentMethod.value = false;
};
const openYape = () => {
    displayYape.value = true;
    close();
};
const openCard = () => {
    displayCard.value = true;
    close();
};
const openPaymentMethod = () => {
    Culqi.settings({
        title: 'CSR Consultas Web',
        currency: 'PEN', // Este parámetro es requerido para realizar pagos yape
        amount: 1000 // Este parámetro es requerido para realizar pagos yape
        //order: 'ord_live_0CjjdWhFpEAZlxlz', // Este parámetro es requerido para realizar pagos con pagoEfectivo, billeteras y Cuotéalo
        //xculqirsaid: 'Inserta aquí el id de tu llave pública RSA',
        //rsapublickey: 'Inserta aquí tu llave pública RSA'
    });
    Culqi.options({
        lang: 'auto',
        installments: false, // Habilitar o deshabilitar el campo de cuotas
        paymentMethods: {
            tarjeta: true,
            yape: true,
            bancaMovil: true,
            agente: true,
            billetera: true,
            cuotealo: true
        }
    });
    Culqi.open();
    //displayPaymentMethod.value = true;
};
const payment = () => {
    displayYape.value = false;
    displayCard.value = false;
    loading.value = true;

    setTimeout(() => router.push('/quote/confirmation'), 1000);
    setTimeout(() => (loading.value = false), 1000);
};

Culqi.options({
    style: {
        maincolor: '#0ec1c1',
        buttontext: '#ffffff',
        maintext: '#4A4A4A',
        desctext: '#4A4A4A'
    }
});
const culqi = () => {
    if (Culqi.token) {
        // ¡Objeto Token creado exitosamente!
        const token = Culqi.token.id;
        console.log('Se ha creado un Token: ', token);
        //En esta linea de codigo debemos enviar el "Culqi.token.id"
        //hacia tu servidor con Ajax
    } else if (Culqi.order) {
        // ¡Objeto Order creado exitosamente!
        const order = Culqi.order;
        console.log('Se ha creado el objeto Order: ', order);
    } else {
        // Mostramos JSON de objeto error en consola
        console.log('Error : ', Culqi.error);
    }
};
onMounted(async () => {
    console.log(dataAppointmentStore.appointment.appointmentId);
    appointment.value = await dataAppointmentStore.getAppointmentId(dataAppointmentStore.appointment.appointmentId);
    console.log(appointment.value);
    const patientName = appointment.value.userId ? `${appointment.value.user.name} ${appointment.value.user.surnames}` : `${appointment.value.dependent.name} ${appointment.value.dependent.surnames}`;

    appointment.value.patient = patientName;
    console.log('paciente', appointment.value);
    paymentValues.value = {
        amount: appointment.value.doctor.personalizedPrices[0].personalizedPrice,
        paymentDate: new Date(),
        appointmentId: dataAppointmentStore.appointment.appointmentId,
        paymentMethodId: 2,
        VoucherTypeId: documentType.value,
        userId: appointment.value.user.userId
    };
});
</script>
<template>
    <div class="flex align-items-center py-5 px-3">
        <i class="pi pi-fw pi-money-bill mr-2 text-2xl" />
        <p class="m-0 text-lg">Pago de consultas médicas</p>
    </div>
    <div class="grid justify-content-center">
        <div class="col-12 md:col-6 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
            <div style="height: 250px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))">
                <div class="p-3 surface-card h-full" style="border-radius: 8px">
                    <div class="field">
                        <label class="mb-3">Tipo de comprobante</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="boleta" name="option" value="1" v-model="documentType" />
                                <label for="boleta">Boleta</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="factura" name="option" value="2" v-model="documentType" />
                                <label for="factura">Factura</label>
                            </div>
                        </div>
                    </div>
                    <p class="mt-3 mb-1">Medico : {{ appointment ? appointment.doctor.user.name + ' ' + appointment.doctor.user.surnames : 'No disponible' }}</p>
                    <p class="mb-1">Especialidad : {{ appointment ? appointment.doctor.specialization : 'No disponible' }}</p>
                    <p class="mb-1">Paciente : {{ appointment ? appointment.patient : 'No disponible' }}</p>
                    <p class="mb-1">Tipo de servicio : {{ appointment ? appointment.appointmentServices[0].medicalService.name : 'No disponible' }}</p>
                    <span>Fecha: {{ appointment ? dformat(appointment.timeSlot.orderlyTurn, 'DD MMMM YYYY hh:mm A') : 'No disponible' }} </span>
                    <p>Total: {{ appointment ? appointment.doctor.personalizedPrices[0].personalizedPrice : 'No disponible' }}</p>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
            <div style="padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))">
                <div class="p-3 surface-card h-full" style="border-radius: 8px">
                    <div id="cardPaymentBrick_container"></div>
                </div>
            </div>
        </div>
    </div>

    <Dialog header="Método de pago" v-model:visible="displayPaymentMethod" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <!-- <p class="line-height-3 m-0">Si el pago se realiza con tarjeta de crédito o débito, por favor ingrese los datos del titular</p>
        <Button label="Tarjeta" class="p-button-raised p-button-success mr-2 mt-3 col-12 md:col-5" @click="openCard" />
        <Button label="Yape" class="p-button-raised p-button-primary mr-2 col-12 md:col-6" @click="openYape" /> -->
        <div id="cardPaymentBrick_container">Holi</div>
    </Dialog>
    <Dialog header="Yape" v-model:visible="displayYape" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <p class="line-height-3 m-0">Paga con tu Código de aprobación</p>
        <p class="line-height-3 m-0">• Encuéntralo en el menú de tu aplicación Yape.</p>
        <p class="line-height-3 m-0">• Copia el código y pégalo abajo.</p>

        <div class="p-fluid formgrid grid mt-4">
            <div class="field col-12">
                <label for="phoneyape">Ingresa tu celular Yape</label>
                <InputText id="phoneyape" type="text" placeholder="+51" />
            </div>
            <div class="field col-12">
                <label for="codapro">Código de aprobación</label>
                <InputText id="codapro" type="text" />
            </div>
        </div>
        <Button label="Yapear S/. 120.00" icon="pi pi-money-bill" class="p-button-raised p-button-primary mr-2 mt-3 col-12" :loading="loading" @click="payment"></Button>
    </Dialog>
    <Dialog header="Tarjeta débito/crédito" v-model:visible="displayCard" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <div class="p-fluid formgrid grid">
            <div class="field col-12">
                <label for="ncard">Número de tarjeta</label>
                <InputText id="ncard" type="text" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="lastname2">Vencimiento</label>
                <InputText id="lastname2" type="text" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="city">Cod Seguridad</label>
                <InputText id="city" type="text" />
            </div>
            <div class="field col-12">
                <label for="email">Correo Electrónico</label>
                <InputText id="email" type="text" />
            </div>
        </div>
        <Button label="Tarjeta" icon="pi pi-money-bill" class="p-button-raised p-button-success mr-2 mt-3 col-12" @click="payment" />
    </Dialog>
    <Button label="Método de pago" icon="pi pi-money-bill" class="p-button-success col-12 md:col-3 mr-2 mb-2 mt-2" :loading="loading" @click="openPaymentMethod"></Button>
</template>
