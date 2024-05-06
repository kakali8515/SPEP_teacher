<template>
  <div>
    <h1>Live Transcription</h1>
    <textarea v-model="audioText" rows="10" cols="50" readonly></textarea>
    <input type="file" @change="handleFileChange">
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      audioText: ''
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Convert audio file to base64
      this.convertAudioToBase64(file);
    },
    async convertAudioToBase64(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1];
        await this.sendAudioToDeepgram(base64Audio);
      };
    },
    async sendAudioToDeepgram(base64Audio) {
      const apiKey = '495eefa3837c937a529f08a1c71d7b8a64ac7c2d';
      const url = 'ws://api.deepgram.com/v1/listen';
      const websocket = new WebSocket(url);
      
      websocket.onopen = () => {
        websocket.send(JSON.stringify({
          action: 'start',
          encoding: 'base64',
          sampleRateHertz: 44100
        }));
        websocket.send(base64Audio);
        websocket.send(JSON.stringify({action: 'stop'}));
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'final') {
          this.audioText = data.payload.transcript;
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }
};
</script>