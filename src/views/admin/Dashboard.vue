<script setup>
import { onMounted, ref } from 'vue';
import ProductService from '@/service/ProductService';
import { io } from 'socket.io-client';
import { backendURL } from '@/config.js';
import { getQrWp, connectionWp } from '../../api';
//import QRCode from 'qrcode';

const socket = io.connect(backendURL, { forceNew: true });
const products = ref(null);

const sessionStarted = ref(true);
const loading = ref(true);

// URL de la imagen QR
const qrImageUrl = ref('');

const productService = new ProductService();
onMounted(async () => {
    const { data } = await connectionWp();
    sessionStarted.value = data;
    console.log(sessionStarted.value);
    socket.on('newQr', async (qr) => {
        console.log(qr);
        getQrWp().then(({ url }) => (qrImageUrl.value = url));
        sessionStarted.value = false;
        loading.value = false;
        localStorage.removeItem('sessionStarted');
    });
    socket.on('wpReady', (wpReady) => {
        sessionStarted.value = wpReady;
        localStorage.setItem('sessionStarted', 'true');
    });

    getQrWp().then(({ url }) => (qrImageUrl.value = url));
    productService.getProductsSmall().then((data) => (products.value = data));
    console.log(sessionStarted.value);
});
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">QR Whatapp</span>
                        <div class="text-900 font-medium text-xl">Escanea el código</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-whatsapp text-blue-500 text-xl"></i>
                    </div>
                </div>
                <div class="flex justify-content-center">
                    <ProgressSpinner v-if="loading && !sessionStarted" style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" class="mb-4" />
                    <Image v-if="!sessionStarted && !loading" :src="qrImageUrl" alt="Image" width="200" />
                </div>
                <div :class="sessionStarted ? 'text-green-500' : 'text-red-500'" class="font-medium text-xl">
                    {{ sessionStarted ? 'Sesión iniciada correctamente' : 'Whatsapp Offline' }}
                </div>
            </div>
        </div>
    </div>
</template>
