import { defineStore } from "pinia";

export const useFeedback= defineStore({
  id: "useFeedback",
  state: () => ({
    is_recording_ongoing: false,
    is_audio_play_ongoing: false,
    is_transcripting_ongoing: false,
    store_id: null,
  }),

  actions: {
    setFieldValue(_state, _value) {
        this[_state] = _value;
    }
  },
  getters: {
    getRecordingStatus: (state) => state.is_recording_ongoing,
    getAudioPlayingStatus: (state) => state.is_audio_play_ongoing,
    getTranscriptingStatus: (state) => state.is_transcripting_ongoing,
    getStoreID: (state) => state.store_id,
  },
});
