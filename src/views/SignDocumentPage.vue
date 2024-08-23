<template>
  <ion-page>
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="small">Accept with your signature</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-content>
          <canvas ref="canvas" width="300" height="300" 
            @mousedown="startDrawing" @mouseup="stopDrawing" @mousemove="draw" 
            @touchstart="startDrawing" @touchend="stopDrawing" @touchmove="draw"></canvas>
          <ion-button expand="block" @click="cleanCanvas">Clean</ion-button>
          <ion-button expand="block" @click="sendSign">Send</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent } from '@ionic/vue';
import { eSignService, ESignAddSignatureRequestData } from '@/services/esign.service';
import { base64Document } from '@/services/document.demo';
import router from '@/router';

const canvas = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const context = ref<CanvasRenderingContext2D | null>(null);
const savedImage = ref<string | null>(null);

const getTouchPos = (canvasDom: HTMLCanvasElement, touchEvent: TouchEvent) => {
  const rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
};

const startDrawing = (event: MouseEvent | TouchEvent) => {
  if (context.value) {
    isDrawing.value = true;
    context.value.beginPath();
    const pos = event instanceof MouseEvent ? { x: event.offsetX, y: event.offsetY } : getTouchPos(canvas.value!, event);
    context.value.moveTo(pos.x, pos.y);
  }
};

const stopDrawing = () => {
  if (context.value) {
    isDrawing.value = false;
    context.value.closePath();
  }
};

const draw = (event: MouseEvent | TouchEvent) => {
  if (isDrawing.value && context.value) {
    const pos = event instanceof MouseEvent ? { x: event.offsetX, y: event.offsetY } : getTouchPos(canvas.value!, event);
    context.value.lineTo(pos.x, pos.y);
    context.value.stroke();
  }
};

const sendSign = () => {
  if (canvas.value) {
    savedImage.value = canvas.value.toDataURL('image/png');
    console.log('Saved Image:', savedImage.value);  

    // Generate a random identifier for demo purposes
    const identifier = Math.random().toString(36).substring(5);
    console.log('Identifier:', identifier);
    const base64Image = savedImage.value!.split(',')[1];

    // Create a new eSign request
    const requestData: ESignAddSignatureRequestData = {
      identifier: identifier, // Set a random identifier for demo purposes
      name: 'Aaron', // Replace with your name
      email: 'aaron@tuidentidad.com', // Replace with your email
      imageSignature: base64Image, // Base64 encoded image
      firstName: 'Munguia',
      lastName: 'Martinez',
      rfc: 'MUMA890234XD1',
      document: base64Document, // Base64 encoded document to be signed
      showSignature: 1
    };

    eSignService.addSignature(requestData).then((response: any) => {
      console.log('Response:', response);
      // Go to the next page
      router.push({ name: 'Signed', params: { id: identifier } });
    });
  }
};

const cleanCanvas = () => {
  if (context.value) {
    context.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  }
};

onMounted(() => {
  if (canvas.value) {
    context.value = canvas.value.getContext('2d');
    if (context.value) {
      context.value.strokeStyle = 'black';
      context.value.lineWidth = 2;
    }

    eSignService.getToken().then((token: string) => {
      console.log('Token:', token);
    });
  }
});

</script>

<style scoped>
canvas {
  border: 1px solid #000;
  display: block;
  margin: 0 auto;
}

/* @media screen and (orientation: portrait) {
  .ion-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
  }

  ion-card {
    transform: rotate(90deg);
    width: 100vh;
    height: 100vw;
  }
} */
</style>