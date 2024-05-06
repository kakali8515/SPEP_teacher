<template>
  <div class="feedback-record-videos">

    <div class="videos-record">
      <!-- <video v-show="recorded" ref="preview" autoplay style="width: 100%;"></video> -->
      <video id="videoElement" ref="video" autoplay style="width: 100%;"></video>
    </div>
    <canvas ref="canvasElement" style="display: none;"></canvas>
      <div class="record-btn">

        <button class="recodbtn" v-if="isCameraOn" @click="toggleCamera"><img src="@/assets/teacher/icons/video-camera.svg"></button>
        <button class="recodbtn red" v-else @click="toggleCamera"><img src="@/assets/teacher/icons/video-camera-red.svg"></button>
        <button class="recodbtn red" v-if="isMuted"  @click="toggleMute"><img src="@/assets/teacher/icons/microphone-red.svg"></button>
        <button class="recodbtn" v-else @click="toggleMute"><img src="@/assets/teacher/icons/microphone-grey.svg"></button>
        <button class="recodbtn" v-if="!recording" @click="startRecording"><img src="@/assets/teacher/icons/record.svg"></button>    
        <button class="recodbtn" v-else @click="stopRecording"><img src="@/assets/teacher/icons/record-red.svg"></button>
        <!-- <button @click="startRecording" :disabled="recording" class="recodbtn"><img src="@/assets/teacher/icons/video-camera.svg"></button>
        <button @click="stopRecording" :disabled="!recording" class="recodbtn red"><img src="@/assets/teacher/icons/video-camera-red.svg"/></button> -->
        <!-- <button @click="saveVideo" :disabled="recordedChunks.length === 0">Save Video</button>
        <button @click="retakeVideo" :disabled="!recordedBlob">Retake</button>
        <button @click="replay" :disabled="!recordedBlob">Replay</button> -->
      </div>
  </div>
</template>

<!-- <div class="feedback-record-videos">
  <div class="close">
      <img src="@/assets/icons/close.svg">
  </div>
  <div class="videos-record">
   <video controls >
       <source src="" type="video/mp4">
       <source src="movie.ogg" type="video/ogg">
       Your browser does not support the video tag.
   </video>
  </div>
  <div class="record-btn">
   <button class="recodbtn"><img src="@/assets/teacher/icons/video-camera.svg"></button>
   <button class="recodbtn red"><img src="@/assets/teacher/icons/video-camera-red.svg"></button>
   <button class="recodbtn"><img src="@/assets/teacher/icons/microphone-grey.svg"></button>
   <button class="recodbtn red"><img src="@/assets/teacher/icons/microphone-red.svg"></button>
   <button class="recodbtn"><img src="@/assets/teacher/icons/record.svg"></button>    
   <button class="recodbtn"><img src="@/assets/teacher/icons/record-red.svg"></button>
  </div>
</div> -->
  
<script>
export default {
  data() {
    return {
      recording: false,
      mediaRecorder: null,
      recordedChunks: [],
      recordedBlob: null,
      recorded: false,
      stream: null,
      isMuted: false,
      isCameraOn: true,
    };
  },
  mounted() {
    this.reset();
    this.setupCamera();
  },
  unmounted() {
    this.stopCamera();
  },
  methods: {
    reset() {
      // this.file = null;
      // this.capturedImage = null;
    },
    onRetry() {
      this.reset();
      this.setupCamera();
    },
    onClose() {
      this.reset();
      this.stopCamera();
      this.$emit('close')
    },
    async setupCamera() {
      try {
        const videoElement = this.$refs.video;
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = this.stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    },
    async startRecording() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: this.isCameraOn, audio: !this.isMuted });
        const videoElement = this.$refs.video;

        videoElement.srcObject = this.stream;

        this.mediaRecorder = new MediaRecorder(this.stream);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/mp4' });
          this.recordedBlob = blob;
          const url = URL.createObjectURL(blob);
          // const previewElement = this.$refs.preview;
          // previewElement.src = url;
          this.recordedChunks = [];
          this.$emit('getVideoData', this.recordedBlob)
          this.$emit('onClose')
        };

        this.mediaRecorder.start();
        this.recording = true;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    },

    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
        const videoElement = this.$refs.video;
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        this.recording = false;
        this.recorded = true;
        if (this.stream) {
          const tracks = this.stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    },
    stopCamera() {
      if (this.stream) {
        const tracks = this.stream.getTracks();
        tracks.forEach(track => track.stop());
        this.isCameraOn = false;
      }
    },
    async toggleCamera() {
      if (this.isCameraOn) {
        this.stream.getTracks().forEach(track => track.stop());
        this.isCameraOn = false;
        const videoElement = this.$refs.video;
        videoElement.srcObject = null;
      } else {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: !this.isMuted });
          const videoElement = this.$refs.video;
          videoElement.srcObject = this.stream;
          this.isCameraOn = true;
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      }
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => {
          track.enabled = !this.isMuted;
        });
      }
    },

    // saveVideo() {
    //   if (this.recordedBlob) {
    //     const url = URL.createObjectURL(this.recordedBlob);
    //     const a = document.createElement('a');
    //     document.body.appendChild(a);
    //     a.style = 'display: none';
    //     a.href = url;
    //     a.download = 'recorded-video.webm';
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //   }
    // },

    // retakeVideo() {
    //   const videoElement = this.$refs.video;
    //   const previewElement = this.$refs.preview;
    //   videoElement.srcObject = null;
    //   previewElement.src = null;
    //   this.recordedBlob = null;
    //   this.recorded = false;
    //   this.setupCamera()
    // },
    // replay() {
    //   this.$refs.preview.play()
    // }
  },
};
</script>
<style scoped lang="scss">
.overlay {
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: rgba(6, 13, 24, 0.9);
}

#videoElement {
  width: 500px;
  height: 375px;
  background-color: #666;
  /*Mirror code starts*/
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  /* Safari and Chrome */
  -moz-transform: rotateY(180deg);
  /* Firefox */
  /*Mirror code ends*/
}

.camera-btn {
  border: none;
  outline: none;
  background-color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 5px;
  font-size: 12px;
  cursor: pointer;

  &.success {
    background: rgb(23, 190, 23);
    color: white;
  }

  &.error {
    background: red;
    color: white;
  }
}</style>
  