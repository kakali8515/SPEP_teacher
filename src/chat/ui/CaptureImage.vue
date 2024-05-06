<template>
    <div class="feedback-record-videos">
        <div class="videos-record">
            <video id="videoElement" ref="videoElement" autoplay v-show="!capturedImage" style="width: 100%;"></video>
            <img v-if="capturedImage" :src="capturedImage" alt="Captured Image" style="width: 100%; height: 375px; object-fit: contain;" />
        </div>
        <canvas ref="canvasElement" style="display: none;"></canvas>
        <div class="record-btn">
            <button class="camera-btn primary" type="button" @click="captureImage" v-if="!capturedImage" >
                Capture Image
            </button>
            <button v-if="!capturedImage" class="camera-btn error" type="button" @click="onClose">
                Cancel
            </button>
            <button class="camera-btn error"  type="button" v-if="capturedImage" @click="onRetry">Retry</button>
            <button class="camera-btn primary" type="button" v-if="capturedImage" @click="onSave">Ok</button>
            <!-- <button class="recodbtn" v-if="isCameraOn" @click="toggleCamera"><img src="@/assets/teacher/icons/video-camera.svg"></button>
        <button class="recodbtn red" v-else @click="toggleCamera"><img src="@/assets/teacher/icons/video-camera-red.svg"></button>
        <button class="recodbtn red" v-if="isMuted"  @click="toggleMute"><img src="@/assets/teacher/icons/microphone-red.svg"></button>
        <button class="recodbtn" v-else @click="toggleMute"><img src="@/assets/teacher/icons/microphone-grey.svg"></button>
        <button class="recodbtn" v-if="!recording" @click="startRecording"><img src="@/assets/teacher/icons/record.svg"></button>    
        <button class="recodbtn" v-else @click="stopRecording"><img src="@/assets/teacher/icons/record-red.svg"></button> -->
            <!-- <button @click="startRecording" :disabled="recording" class="recodbtn"><img src="@/assets/teacher/icons/video-camera.svg"></button>
        <button @click="stopRecording" :disabled="!recording" class="recodbtn red"><img src="@/assets/teacher/icons/video-camera-red.svg"/></button> -->
            <!-- <button @click="saveVideo" :disabled="recordedChunks.length === 0">Save Video</button>
        <button @click="retakeVideo" :disabled="!recordedBlob">Retake</button>
        <button @click="replay" :disabled="!recordedBlob">Replay</button> -->
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            capturedImage: null,
            file: null,
            stream: null,
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
            this.file = null;
            this.capturedImage = null;
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
                const videoElement = this.$refs.videoElement;
                this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoElement.srcObject = this.stream;
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        },
        stopCamera() {
            if (this.stream) {
                const tracks = this.stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        },
        captureImage() {
            const videoElement = this.$refs.videoElement;
            const canvasElement = this.$refs.canvasElement;
            const context = canvasElement.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            canvasElement.toBlob((blob) => {
                this.file = new File([blob], "fileName.jpg", { type: "image/jpeg" })
            }, 'image/jpeg');
            const imageDataURL = canvasElement.toDataURL('image/jpeg');
            this.capturedImage = imageDataURL;
            this.stopCamera()
        },
        onSave() {
            this.$emit('save', this.file)
            this.$emit('close')
            this.reset();
        }
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
    padding-inline: 10px;
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
    &.primary {
        background: #0C60C2;
        color: white;
    }
}
</style>
  