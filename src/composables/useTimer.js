// timerComposition.js
import { ref } from 'vue';

export default function useTimer() {
  // Define variables
  const timer = ref('00:00:00');
  const recording = ref(false);
  let intervalId = null;

  // Function to start recording
  const startRecording = () => {
    if (!recording.value) {
      recording.value = true;
      let seconds = 0;
      intervalId = setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        timer.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      }, 1000);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (recording.value) {
      recording.value = false;
      clearInterval(intervalId);
    }
  };
  const resetTimer = () =>  {
    timer.value = '00:00:00'
  }

  return {
    timer,
    recording,
    startRecording,
    stopRecording,
    resetTimer
  };
}
