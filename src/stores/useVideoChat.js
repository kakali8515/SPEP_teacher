import { defineStore } from "pinia";
import { computed, reactive } from "vue";
// import usePostMessage from "@/composables/usePostMessage";
// const {onPostMessageFire} = usePostMessage();
export const useVideoChat= defineStore("useVideoChat", () => {
    const state = reactive({
        chat_members_list: [],
        peer_status: null,
        channel_name: null,
        room_id: null,
        caller: null,
        remoteData: {},
        invitation_time_span: 30000,
        call_ongoing: false, // running || ''
        end_running_call: false
    })

    // ======== FUNCTIONS =========
    const setFieldValue = (_field, _value) => {
        state[_field] = _value;
    }
    const resetData = () => {
        state.peer_status = null
        state.channel_name = null
        state.room_id = null
        state.caller = null
        state.remoteData = {}
        state.call_ongoing = false
        state.end_running_call = false
    }
    // ======= GETTERS =========
    const getChatMemberList = computed(() => state.chat_members_list)
    const getPeerStatus = computed(() => state.peer_status)
    const getRemoteData = computed(() => state.remoteData)
    const getRunningCallStatus = computed(() => state.call_ongoing)
    const getEndCallInvokeStatus = computed(() => state.end_running_call)

    return { state, getChatMemberList, setFieldValue, getPeerStatus, resetData, getRemoteData, getRunningCallStatus, getEndCallInvokeStatus }
});
