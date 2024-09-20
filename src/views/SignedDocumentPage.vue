<template>
    <ion-page>
        <ion-content>
            <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
            <iframe v-else :key="documentData" :src="documentData" frameborder="0" width="100%" height="100%"></iframe>
            
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                <ion-button expand="block" href="/home">Continue</ion-button>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonButton, IonSpinner, IonContent, IonToolbar, IonFooter } from '@ionic/vue';
import router from '@/router';
import { eSignService, ESignGetDocumentResponseData } from '@/services/esign.service';

// Get the document ID from the URL
const documentId = router.currentRoute.value.params.id;

// Get the document from the service
const getDocumentResponseData = ref<ESignGetDocumentResponseData | null>(null);
const documentData = ref<string | undefined>(undefined);
const isLoading = ref<boolean>(true);

onMounted(async () => {
    getDocumentResponseData.value = await eSignService.getDocument(documentId.toString());
    if (getDocumentResponseData.value && getDocumentResponseData.value.image) {
        // Convert base64 string to data URL
        documentData.value = `data:application/pdf;base64,${getDocumentResponseData.value.image}`;
    }
    isLoading.value = false;
});
</script>