<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title size="small">Accept with your signature</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="isProccesing" class="loader">Processing...</div>
      <canvas ref="canvas" width="300" height="300"
        :disabled="isProccesing"
        @mousedown="startDrawing" @mouseup="stopDrawing" @mousemove="draw" 
        @touchstart="startDrawing" @touchend="stopDrawing" @touchmove="draw"></canvas>
      <ion-grid>
        <ion-row>
          <ion-col size="6"><span>Cuida que tu firma coincida con la de tu identificación.</span></ion-col>
          <ion-col><ion-button expand="block" @click="cleanCanvas" :disabled="isProccesing">Clean</ion-button></ion-col>
          <ion-col><ion-button expand="block" @click="sendSign" :disabled="isProccesing">Send</ion-button></ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCol, IonGrid, IonRow } from '@ionic/vue';
import { eSignService, ESignAddSignatureRequestData } from '@/services/esign.service';
import { base64Document } from '@/services/document.demo';
import router from '@/router';

const canvas = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const context = ref<CanvasRenderingContext2D | null>(null);
const savedImage = ref<string | null>(null);
const isProccesing = ref(false);

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
  if (isDrawing.value && context.value && isProccesing.value === false) {
    const pos = event instanceof MouseEvent ? { x: event.offsetX, y: event.offsetY } : getTouchPos(canvas.value!, event);
    context.value.lineTo(pos.x, pos.y);
    context.value.stroke();
  }
};

const sendSign = () => {
  if (canvas.value) {
    savedImage.value = canvas.value.toDataURL('image/png');

    // Generate a random identifier for demo purposes
    const identifier = Math.random().toString(36).substring(5);
    console.log('Identifier:', identifier);
    const base64Image = savedImage.value!.split(',')[1];

    // Create a new eSign request
    const requestData: ESignAddSignatureRequestData = {
      identifier: identifier, // Set a random identifier for demo purposes
      name: 'Aaron', // Replace with the name of your customer
      email: 'aaron@tuidentidad.com', // Replace with the email of your customer
      imageSignature: base64Image, // Base64 encoded image
      firstName: 'Munguia',
      lastName: 'Martinez',
      rfc: 'MUMA890234XD1',
      document: base64Document, // Base64 encoded document to be signed
      showSignature: 1
    };

    isProccesing.value = true;
    eSignService.addSignature(requestData).then((response: any) => {
      console.log('Response:', response);
      isProccesing.value = false;
      // Go to the next page
      router.push({ name: 'Signed', params: { id: identifier } });
    });
  }
};

const isCanvasEmpty = () => {
  if (!canvas.value || !context.value) return true;
  const blank = document.createElement('canvas');
  blank.width = canvas.value.width;
  blank.height = canvas.value.height;
  return canvas.value.toDataURL() === blank.toDataURL();
};

const cleanCanvas = () => {
  if (context.value) {
    context.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  }
};

const resizeCanvas = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight - 128;
  }
};

onMounted(() => {
  if (Object.hasOwn(screen.orientation, 'lock')) {
    (screen.orientation as any).lock('landscape-primary');
  }
  // Resize the canvas when the window is resized
  window.addEventListener('resize', () => {
    resizeCanvas();
  });
  // Initialize the canvas
  if (canvas.value) {
    resizeCanvas();
    context.value = canvas.value.getContext('2d');
    if (context.value) {
      context.value.strokeStyle = 'black';
      context.value.lineWidth = 2;
    }
  }
});
onUnmounted(() => {
  screen.orientation.unlock();
});
</script>

<style scoped>
canvas {
  display: block;
  margin: 0 auto;
  background: white;
}
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 1em;
  border-radius: 5px;
  z-index: 1000;
}
</style>