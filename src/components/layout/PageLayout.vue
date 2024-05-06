<template>
  <div v-if="fullscreenPage">
    <RouterView />
  </div>
  <!-- Teacher Layout -->
  <div class="main-structure-area" v-else>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-2 col-xs-12" style="padding-left:0;">
          <Sidebar></Sidebar>
        </div>
        <div class="col-md-10 col-xs-12">
          <div class="fixed-header-area">
            <MobileBackHeader v-if="store.getIsMobileViewReady" />
            <Header v-else />
          </div>
          <div class="inner-body-content-area pad-53">
            <RouterView />
          </div>

        </div>
      </div>
    </div>
  </div>
  <audio class="d-none" ref="callerTune" id="callerTune">
    <source src="/src/assets/audio/ringtone.mp3">
  </audio>
  <CallInvitationModal v-if="incomingCall" v-model="incomingCall" @handle-decline-call="onDeclineCall" @handle-accept-call="onAcceptCall" />
</template>
<script setup>
import axios from 'axios';
import AgoraRTM from "agora-rtm-sdk";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
import MobileBackHeader from "./MobileBackHeader.vue";
import CallInvitationModal from "@/chat/ui/CallInvitationModal.vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { onBeforeMount, ref, computed, watch, onBeforeUnmount } from "vue";
import { Token } from "@/services/Token";
import { useUserData } from "@/stores/useUserDataCopy";
import { useVideoChat } from "@/stores/useVideoChat";
const tokenUtil = new Token();
const store = useUserData();
const videoStore = useVideoChat();
const isToken = ref(false);
const route = useRoute()
const router = useRouter()
const incomingCall = ref(false)
const callerTune = ref()
let rtmClient
let rtmChannel;
const rtm_token = ref()
const channelName = import.meta.env.VITE_GLOBAL_GROUP_NAME;
const BASE_URL = import.meta.env.VITE_APP_CHAT_BASE_API_URL;
const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const fullscreenPage = computed(() => route.name === 'SpepVideoChat');
let UID = sessionStorage.getItem("uid");
if (!UID) {
  UID = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem("uid", UID);
}

const generateToken = async (id) => {
  try {
    const res = await axios.get(
      `${BASE_URL}api/v1/chat/agora/token/rtm?userId=${id}`
    );
    rtm_token.value = res.data.token;
    return res;
  } catch (error) {
    console.log(error);
  }
};
const logoutUser = async () => {
  console.log("destroyed!!!");
  await rtmClient.logout();
};
// Initialize RTM instance
const initRtmInstance = async () => {
  // initialize an Agora RTM instance
  rtmClient = await AgoraRTM.createInstance(APP_ID, {
    enableLogUpload: false,
  });

  // RTM Channel to be used
  // Generate the RTM token
  const { data } = await generateToken(`${store.getUserData.id}${UID}`);
  // Login when it mounts
  await rtmClient.login({ uid: `${store.getUserData.id}${UID}`, token: data.token });

  // Create a channel and listen to messages
  rtmChannel = rtmClient.createChannel(channelName);

  // Join the RTM Channel
  rtmChannel.join();

  rtmChannel.on("ChannelMessage", (message, memberId) => {
    handleChannelMessage(message, memberId)
  });
};
const checkUserAccesibility = (_data) => {
  const list = _data;
  return list.some(item => item.user_id === store.getUserData.id)
}
const sendMessage = (_obj) => {
try {
  rtmChannel.sendMessage({ text: JSON.stringify(_obj) })
} catch (error) {
  console.error('Message sent failed:',error)
}
}
const playAudioForIncomingCall = (_type) => {
  if (_type === 'play') {
    document.getElementById('callerTune').click()
    document.getElementById('callerTune').play();
  } else {
    document.getElementById('callerTune').click()
    document.getElementById('callerTune').pause();
  }
}
const handleChannelMessage = async (messageData, MemberId) => {
  let data = JSON.parse(messageData.text);
  if (!checkUserAccesibility(data.callee)) return;
  videoStore.setFieldValue('remoteData', { ...data })
  if (data.type === 'remote_call_invitation' && !videoStore.getRunningCallStatus) {
    incomingCall.value = true;
    playAudioForIncomingCall('play')
    setTimeout(() => {
      if (incomingCall.value) {
        videoStore.resetData();
        incomingCall.value = false
        playAudioForIncomingCall('end')
      }
    }, videoStore.state.invitation_time_span)
  } else if (data.type === 'cancelled_call_invitation') {
    if (videoStore.getRunningCallStatus) {
      videoStore.setFieldValue('end_running_call', true)
    } else {
      videoStore.resetData();
      incomingCall.value = false
      playAudioForIncomingCall('end')
    }
  }

}
const setPeerMessage = (_type) => {
  const obj = {
    type: _type,
    callee: videoStore.getChatMemberList,
    caller: videoStore.state.caller,
    channel_name: videoStore.state.channel_name,
    room_id: videoStore.state.room_id
  }
  sendMessage(obj)
}
watch(() => videoStore.getPeerStatus, (_type, oV) => {
  if (_type) {
    setPeerMessage(_type)
  }
})

const onAcceptCall = (_type) => {
  incomingCall.value = false
  playAudioForIncomingCall('end')
  router.push(`/spep-video-chat/user/${videoStore.getRemoteData.channel_name}/${videoStore.getRemoteData.room_id}/${_type}`);
  videoStore.setFieldValue('call_ongoing', true)
}
const onDeclineCall = () => {
  videoStore.resetData();
  incomingCall.value = false
  playAudioForIncomingCall('end')
}


// ===== LIFE CYCLE =====
onBeforeMount(async () => {
  isToken.value = await tokenUtil.hasToken();
  if (isToken.value) {
    await store.getUserDetails();
    if (!store.getIsMobileViewReady) {
      await initRtmInstance()
    }
  }
});
onBeforeUnmount(() => {
  logoutUser();
})

</script>
