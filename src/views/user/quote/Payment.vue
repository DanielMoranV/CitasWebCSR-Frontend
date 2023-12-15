<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useDataAppointmentStore } from '../../../stores/dataAppointment';
import { useAuthStore } from '../../../stores/auth';
import { dformat } from '../../../utils/day';

const culqiToken = ref(null);
const dataAppointmentStore = useDataAppointmentStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const appointment = ref(null);
const loading = ref(false);
const documentType = ref(null);
const buttonPaymentDisabled = ref(true);

const paymentValues = ref({
    amount: null,
    paymentDate: null,
    appointmentId: null,
    paymentMethodId: null,
    VoucherTypeId: null,
    userId: null
});

const openPaymentMethod = async () => {
    Culqi.settings({
        title: 'CSR Consultas Web',
        currency: 'PEN', // Este parámetro es requerido para realizar pagos yape
        amount: paymentValues.value.amount * 100 // Este parámetro es requerido para realizar pagos yape
        //order: 'ord_live_0CjjdWhFpEAZlxlz', // Este parámetro es requerido para realizar pagos con pagoEfectivo, billeteras y Cuotéalo
        //xculqirsaid: 'Inserta aquí el id de tu llave pública RSA',
        //rsapublickey: 'Inserta aquí tu llave pública RSA'
    });

    Culqi.open();
};

onMounted(async () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.culqi.com/js/v4';
    script.async = true;
    script.onload = () => {
        // Una vez que el script de Culqi se haya cargado, configura Culqi.settings y CulqiOptions
        Culqi.publicKey = 'pk_test_73e0f77c30643c37';
        buttonPaymentDisabled.value = false;
    };
    document.body.appendChild(script);
    appointment.value = await dataAppointmentStore.getAppointmentId(dataAppointmentStore.appointment.appointmentId);
    const patientName = appointment.value.dependentId ? `${appointment.value.dependent.name} ${appointment.value.dependent.surnames}` : `${appointment.value.user.name} ${appointment.value.user.surnames}`;

    appointment.value.patient = patientName;
    paymentValues.value = {
        amount: appointment.value.doctor.personalizedPrices[0].personalizedPrice,
        paymentDate: new Date(),
        appointmentId: dataAppointmentStore.appointment.appointmentId,
        paymentMethodId: 2,
        VoucherTypeId: documentType.value,
        userId: authStore.user.user.userId
    };
});

window.addEventListener('culqiTokenCreated', async (event) => {
    culqiToken.value = event.detail;
    console.log(culqiToken.value);
    culqiToken.value.metadata = {};
    culqiToken.value.metadata.appointmentId = dataAppointmentStore.appointment.appointmentId;
    culqiToken.value.metadata.paymentMethodId = 2;
    culqiToken.value.metadata.VoucherTypeId = 5;
    culqiToken.value.metadata.paymentDate = paymentValues.value.paymentDate;
    culqiToken.value.metadata.userId = authStore.user.user.userId;
    culqiToken.value.metadata.amount = paymentValues.value.amount * 100;
    culqiToken.value.client.address = authStore.user.user.address;
    culqiToken.value.client.phone = authStore.user.user.phone;
    culqiToken.value.client.name = authStore.user.user.name;
    culqiToken.value.client.surnames = authStore.user.user.surnames;
    console.log(appointment.value);
    culqiToken.value.dataPayment = {
        nameDoctor: appointment.value.doctor.user.name + ' ' + appointment.value.doctor.user.surnames,
        specialty: appointment.value.doctor.specialization,
        patient: appointment.value.patient,
        date: dformat(appointment.value.timeSlot.orderlyTurn, 'DD MMMM YYYY hh:mm A'),
        price: appointment.value.doctor.personalizedPrices[0].personalizedPrice
    };

    //En este punto, culqiToken contiene el token y puedes manejarlo
    const response = await dataAppointmentStore.addPayment(culqiToken.value);
    if (response.message) {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 4000 });
        await dataAppointmentStore.deleteAppointmentId(dataAppointmentStore.appointment.appointmentId);
        Culqi.close();
    } else {
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pago realizado correctamente', life: 4000 });
        Culqi.close();
        setTimeout(() => router.push('/quote/confirmation'), 1000);
    }
});
</script>
<template>
    <div class="flex align-items-center py-5 px-3">
        <i class="pi pi-fw pi-money-bill mr-2 text-2xl" />
        <p class="m-0 text-lg">Pago de consultas médicas</p>
    </div>
    <div class="grid justify-content-center">
        <Toast />
        <div class="col-12 md:col-6 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
            <div style="padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))">
                <div class="p-3 surface-card h-full" style="border-radius: 8px">
                    <!-- <div class="field">
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
                    </div> -->
                    <p class="mt-3 mb-1">Medico : {{ appointment ? appointment.doctor.user.name + ' ' + appointment.doctor.user.surnames : 'No disponible' }}</p>
                    <p class="mb-1">Especialidad : {{ appointment ? appointment.doctor.specialization : 'No disponible' }}</p>
                    <p class="mb-1">Paciente : {{ appointment ? appointment.patient : 'No disponible' }}</p>
                    <p class="mb-1">Tipo de servicio : {{ appointment ? appointment.appointmentServices[0].medicalService.name : 'No disponible' }}</p>
                    <span>Fecha: {{ appointment ? dformat(appointment.timeSlot.orderlyTurn, 'DD MMMM YYYY hh:mm A') : 'No disponible' }} </span>
                    <p>Total: {{ appointment ? appointment.doctor.personalizedPrices[0].personalizedPrice : 'No disponible' }}</p>
                    <Button label="Método de pago" icon="pi pi-money-bill" class="p-button-success col-12" :disabled="buttonPaymentDisabled" :loading="loading" @click="openPaymentMethod"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
