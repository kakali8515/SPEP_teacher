<template>
  <!-- START -->
  <!-- MAIN SCREEN -->
  <section class="chat-room-bdy-area">
    <div class="chat-box" :class="{ 'screen-share-border': isSharingEnabled }">
      <div
        class="inner-chatbox"
        :style="`${
          isSharingByRemoteUser ? 'display: flex; gap: 10px;' : ''
        } height: 100%;`"
      >
        <div
          v-show="isSharingByRemoteUser"
          id="screen-player-container"
          class="screen"
          style="width: 100%; height: 100%"
        ></div>
        <div
          class="player-container"
          id="remote-playerlist"
          :class="` ${
            isSharingByRemoteUser
              ? 'player-container-right-side'
              : getResponseClass
          }`"
          :style="`${
            isSharingByRemoteUser ? 'width: 320px; height: 100%;' : ''
          }`"
        >
          <div
            class="player-wrapper"
            :class="{ item: !isSharingByRemoteUser && userCount % 2 != 0 }"
          >
            <div
              v-if="isCameraOff && !isSharingEnabled"
              id="local-player-avatar"
              class="player-avatar-wrapper"
            >
              <img
                src="@/assets/teacher/images/video-avtar-icon.jpg"
                alt="Avatar"
                class="avatar"
              />
            </div>
            <div
              id="local-player"
              class="player"
              :class="{ 'd-none': isCameraOff }"
            ></div>
            <div class="player-info-badge">
              <span v-if="isMute"
                ><img src="@/assets/teacher/icons/mic-white-bg-cross.svg" />
              </span>
              <span v-else
                ><img src="@/assets/teacher/icons/mic-white-bg.svg"
              /></span>
              <span id="local-player-name">{{ localPlayerName }} (you)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FOOTER -->
    <div class="chat-call-area">
      <div class="footer d-flex justify-content-between video-chat-footer">
        <div style="display: none">
          <!-- <p>{{ roomId }}</p> -->
          <button type="button" class="btn btn-light" @click="copiedRoomId">
            {{ roomId }}
          </button>
        </div>

        <div class="video-chat-button-area">
          <!-- #### ======= MIC ========= #### -->
          <button
            type="button"
            :class="`btn btn-outline-${!isMute ? 'primary' : 'danger'}`"
            @click="toggleMic"
          >
            <span v-if="isMute"
              ><img src="@/assets/teacher/icons/mic-off-outline.svg"
            /></span>
            <span v-else
              ><img src="@/assets/teacher/icons/mic-outline.svg"
            /></span>

            <!-- <i class="fa-solid fa-microphone-slash"></i> 
              <i class="fa-solid fa-microphone" ></i> -->
          </button>
          <!-- #### ========== CAMERA ============ #### -->
          <button
            type="button"
            class="btn btn-outline-primary"
            :class="{ 'disable-event': videoPermissionDenied }"
            :disabled="isSharingEnabled"
            @click="toggleVideo"
          >
            <span v-if="isCameraOff"
              ><img src="@/assets/teacher/icons/videocam-off-outline.svg"
            /></span>
            <span v-else
              ><img src="@/assets/teacher/icons/videocam-outline.svg"
            /></span>
            <!-- <i class="fa-solid fa-video-slash" ></i>  
              <i class="fa-solid fa-video" v-else></i> -->
          </button>
          <!-- #### =========== MEMBER COUNT ============= #### -->
          <button type="button" class="btn btn-outline-info" disabled>
            <img src="@/assets/teacher/icons/vid-user-blue.svg" />
            <span class="counts">
              {{ userCount }}
            </span>
          </button>

          <!-- ========= RECORDING ========= -->
          <div class="record-box">
            <button
              type="button"
              class="btn btn-outline-warning"
              style="width: 1.8rem; height: 1.8rem"
              :disabled="userCount === 1 || isRemoteUserRecording"
              @click="onScreenRecording"
            >
              <span v-if="isRecordingEnabled" class="pointer"
                ><img src="@/assets/teacher/icons/record-red.svg"
              /></span>
              <span v-else class="pointer"
                ><img src="@/assets/teacher/icons/record.svg"
              /></span>
              <!-- <i class="fa-solid fa-record-vinyl"></i> -->
            </button>
          </div>
          <!-- #### =========== SCREEN SHARE ========== #### -->
          <div class="screen-record-box">
            <button type="button" class="btn btn-info" @click="onShareScreen">
              <span v-if="!isSharingEnabled"
                ><img src="@/assets/teacher/icons/screen-share.svg"
              /></span>
              <span v-else
                ><img src="@/assets/teacher/icons/screen-share-cut.svg"
              /></span>
              <!-- <i  class="fa-solid fa-square-xmark"></i>
              <i  class="fa-brands fa-creative-commons-share"></i> -->
            </button>
          </div>
          <!-- #### ============== END CALL ============= #### -->
          <button type="button" class="btn calls btn" @click="handleEndCall">
            <img src="@/assets/teacher/icons/call-end.svg" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Toast from "@/alert/alert.js";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import axios from "axios";
import { useVideoChat } from "@/stores/useVideoChat";
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserData } from "@/stores/useUserDataCopy";
import SocketioService from "@/chat/services/SocketIoService";

import { Message } from "@/chat/services/Message";
const videoStore = useVideoChat();
const chatService = new Message();

const userStore = useUserData();
const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const BASE_URL = `${import.meta.env.VITE_APP_CHAT_BASE_API_URL}api/v1/chat`;
const MAX_USER_COUNT = 10;
const getUserId = computed(() => userStore.getUserData?.id);
const isJoined = ref(false);
const beforeEnterScreen = ref(false);
const isMute = ref(false);
const isCameraOff = ref(false);
const memberList = ref([]);
var localTracks = {
  videoTrack: null,
  audioTrack: null,
};
//   let screenTrack;
let screenVideoTrack;
let screenAudioTrack;
const isSharingEnabled = ref(false);
const isSharingByRemoteUser = ref(false);
const remoteUserId = ref(null);
let remoteUsers = {};
const userCount = ref(1);
const muteIcon = `<img src="/src/assets/teacher/icons/mic-white-bg-cross.svg">`;
const unmuteIcon = `<img src="/src/assets/teacher/icons/mic-white-bg.svg">`;
const localPlayerName = ref("");
const callEnd = ref(false);
const directBack = ref(false);
// Agora client options
var options = reactive({
  name: "",
  channel: "",
});
var client;
let rtc_token;
let rtm_token;
let UID = sessionStorage.getItem("uid");
const staticUid = String(Math.floor(Math.random() * 100000));
if (!UID) {
  UID = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem("uid", UID);
}
let roomId = computed(() => route.params.room_id);
// let client;
let rtmClient;
let channel;

const isRecordingEnabled = ref(false);
const isRemoteUserRecording = ref(false);
const agoraRecordingObj = reactive({
  resource_id: null,
  sid: null,
});
const videoPermissionDenied = ref(false);
const audioPermissionDenied = ref(false);
const route = useRoute();
const router = useRouter();
const checker = (i_val, e_val, result) => {
  return i_val <= result && result <= e_val;
};
const getResponseClass = computed(() => {
  let _class = "";
  if (checker(2, 4, userCount.value)) {
    _class = "player-container-2-4";
  } else if (checker(5, 6, userCount.value)) {
    _class = "player-container-5-6";
  } else if (checker(7, 8, userCount.value)) {
    _class = "player-container-7-8";
  } else if (checker(9, 10, userCount.value)) {
    _class = "player-container-9-10";
  }
  return userCount.value !== 1 ? _class : "";
});

// watch(
//   () => videoStore.getEndCallInvokeStatus,
//   (nV, oV) => {
//     if (nV) {
//       handleEndCall();
//     }
//   }
// );

const onEnterBeforeExistingRoom = async () => {
  try {
    await FetchRTC_Token();
    await FetchRTM_Token();
    await joinRoomInit(true);
  } catch (error) {
    console.error("______________Error while joining call", error);
  }
};
const setStoreData = (_type) => {
  videoStore.setFieldValue("peer_status", _type);
};
const onGetMemberList = async () => {
  try {
    const res = await chatService.getChatGroupMemberList(roomId.value);
    memberList.value = res.data.list.filter(
      (item) => item.user_id !== userStore.getUserData?.id
    );
    videoStore.setFieldValue("chat_members_list", memberList.value);
    videoStore.setFieldValue("caller", userStore.getUserData?.first_name);
    videoStore.setFieldValue("channel_name", route.params.room_name);
    videoStore.setFieldValue("room_id", roomId.value);
    setStoreData("remote_call_invitation");
  } catch (error) {
    console.log(error);
  }
};
const FetchRTC_Token = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/agora/token/rtc?userId=${UID}&channelName=${roomId.value}`
    );
    rtc_token = res.data.token;
    return res;
  } catch (error) {
    console.log(error);
  }
};
const FetchRTM_Token = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/agora/token/rtm?userId=${UID}`);
    rtm_token = res.data.token;
    return res;
  } catch (error) {
    console.log(error);
  }
};
const joinRoomInit = async (_is_exist) => {
  rtmClient = await AgoraRTM.createInstance(APP_ID);

  await rtmClient.login({ uid: UID, token: rtm_token });
  console.log(userStore.getUserData?.first_name);
  await rtmClient.addOrUpdateLocalUserAttributes({
    name: userStore.getUserData?.first_name,
  });

  channel = await rtmClient.createChannel(roomId.value);
  await channel.join();

  // channel.on("MemberJoined", handleMemberJoined);
  // channel.on("MemberLeft", handleMemberLeft);
  channel.on("ChannelMessage", handleChannelMessage);
  const len = await getMembers();
  // if (_is_exist) {
  //   if (len > MAX_USER_COUNT) {
  //     // alert("ROOM IS FULL");
  //     Toast.fire({
  //         title: `ROOM IS FULL`,
  //         background: "#ffc107",
  //         color: 'white'
  //     });
  //     await channel.leave();
  //     await rtmClient.logout();
  //     return;
  //   } else {
  //     beforeEnterScreen.value = true;
  //   }
  // }
  await initRtcJoining(_is_exist);

  if (!route.params.call_type || route.params.call_type === "audio") {
    if (videoPermissionDenied.value) {
      isCameraOff.value = true;
    } else {
      toggleVideo();
    }
  }
  await joinStream();
  channel.on("MemberJoined", handleMemberJoined);
  // addBotMessageToDom(`Welcome to the room ${displayName}! 👋`);
};
const handleMemberJoined = (res) => {
  console.log(res, "MEMBer");
};
const handleChannelMessage = async (messageData, MemberId) => {
  let data = JSON.parse(messageData.text);

  console.log("_____________received", data);
  if (data.type === "start_share_screen") {
    // addMessageToDom(data.displayName, data.message)
    isSharingByRemoteUser.value = true;
    remoteUserId.value = MemberId;
    const elm = document.getElementById(`player-wrapper-${MemberId}`);
    document.getElementById("screen-player-container").appendChild(elm);
    if (isSharingEnabled.value) {
      stopScreenSharing();
    }
  }
  if (data.type === "stop_share_screen") {
    // addMessageToDom(data.displayName, data.message)
    const elm = document.getElementById(`player-wrapper-${MemberId}`);
    document.getElementById("remote-playerlist").appendChild(elm);
    remoteUserId.value = null;
    isSharingByRemoteUser.value = false;
  }
  if (data.type === "start_recording") {
    isRemoteUserRecording.value = true;
    const name = await getRemoteUserName(MemberId);
    Toast.fire({
      title: `${name} started screen recording`,
      background: "#0E3461",
      color: "white",
    });
  }
  if (data.type === "on_going_recording") {
    isRemoteUserRecording.value = true;
  }
  if (data.type === "stop_recording") {
    isRemoteUserRecording.value = false;
    const name = await getRemoteUserName(MemberId);
    Toast.fire({
      title: `${name} stopped screen recording`,
      background: "#0E3461",
      color: "white",
    });
  }
};
const getRemoteUserName = async (_member_id) => {
  let { name } = await rtmClient.getUserAttributesByKeys(
    _member_id.toString(),
    ["name"]
  );
  return name;
};

let getMembers = async () => {
  try {
    let members = await channel.getMembers();
    // updateMemberTotal(members)
    for (let i = 0; members.length > i; i++) {
      let { name } = await rtmClient.getUserAttributesByKeys(members[i], [
        "name",
      ]);
    }
    return members.length;
  } catch (error) {
    return 0;
  }
};
const checkVideoAudioAccessibility = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    const videoInputDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    const audioConstraint = audioInputDevices.length > 0;
    const videoConstraint = videoInputDevices.length > 0;

    const constraints = {};
    if (audioConstraint) {
      constraints.audio = true;
    } else {
      audioPermissionDenied.value = true;
      isMute.value = true;
    }

    if (videoConstraint) {
      constraints.video = true;
    } else {
      isCameraOff.value = true;
      videoPermissionDenied.value = true;
    }

    if (!audioConstraint && !videoConstraint) {
      console.log("no audio/video input devices found.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Check if the stream contains audio and/or video tracks
    const hasAudio = stream.getAudioTracks().length > 0;
    const hasVideo = stream.getVideoTracks().length > 0;

    if (hasAudio && hasVideo) {
      // Both audio and video tracks are available
      // Create audio and video tracks
      const audioTrack = AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack: stream.getAudioTracks()[0],
      });
      const videoTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: stream.getVideoTracks()[0],
      });

      localTracks.audioTrack = audioTrack;
      localTracks.videoTrack = videoTrack;
    } else if (hasAudio) {
      // Only audio track is available
      // Create audio track
      const audioTrack = AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack: stream.getAudioTracks()[0],
      });

      localTracks.audioTrack = audioTrack;
    } else if (hasVideo) {
      // Only video track is available
      // Create video track
      const videoTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: stream.getVideoTracks()[0],
      });

      localTracks.videoTrack = videoTrack;
    } else {
      // No audio or video tracks are available
      console.error("No audio or video tracks available");
    }
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};

async function initRtcJoining(_is_exist) {
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  // add event listener to play remote tracks when remote user publishs.

  // join a channel and create local tracks, we can use Promise.all to run them concurrently
  await checkVideoAudioAccessibility();
  //    [localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
  //   AgoraRTC.createMicrophoneAudioTrack(),
  //   AgoraRTC.createCameraVideoTrack(),
  // ]);
  // play local video track
  // if (route.params.roomId) {
  if (_is_exist && localTracks.videoTrack) {
    localTracks.videoTrack.play("local-player");
    document
      .querySelector(".player-wrapper")
      .setAttribute("id", `player-wrapper-${UID}`);
  }
  // }
  initVolumeIndicator();
}
const joinStream = async () => {
  isJoined.value = true;
  beforeEnterScreen.value = false;
  await client.on("user-joined", handleUserJoined);
  await client.on("user-published", handleUserPublished);
  await client.on("user-left", handleUserLeft);
  await client.on("user-unpublished", handleUserUnpublished);
  await client.join(APP_ID, roomId.value, rtc_token, Number(UID)),
    localTracks.videoTrack && localTracks.videoTrack.play("local-player");

  localPlayerName.value = options.name;
  document
    .querySelector(".player-wrapper")
    .setAttribute("id", `player-wrapper-${UID}`);
  if (!isCameraOff.value && !videoPermissionDenied.value) {
    await client.publish([localTracks.videoTrack]);
  }
  localTracks.audioTrack && (await client.publish([localTracks.audioTrack]));
};

async function initVolumeIndicator() {
  AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 500);
  client.enableAudioVolumeIndicator();
  client.on("volume-indicator", (volumes) => {
    volumes.forEach((volume) => {
      try {
        let item = document.getElementById(`player-wrapper-${volume.uid}`);
        if (!item) return;
        if (volume.level >= 50) {
          item.style.borderColor = "#007bff";
        } else {
          item.style.borderColor = "#121a24";
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
}

async function toggleMic() {
  if (localTracks?.audioTrack?.muted) {
    isMute.value = false;
    localTracks.audioTrack?.setMuted(false);
  } else {
    isMute.value = true;
    localTracks.audioTrack?.setMuted(true);
  }
}
async function toggleVideo() {
  if (!isCameraOff.value) {
    isCameraOff.value = true;
    localTracks.videoTrack.close();
    localTracks.videoTrack.stop();
    if (!isJoined.value) return;
    await client.unpublish([localTracks.videoTrack]);
  } else {
    isCameraOff.value = false;
    await initCamera(isJoined.value);
  }
}

// NOTE:
async function handleEndCall() {
  try {
    callEnd.value = true;
    const len = await getMembers();
    if (len < 3) {
      setStoreData("cancelled_call_invitation");
    }
    for (let trackName in localTracks) {
      var track = localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        localTracks[trackName] = undefined;
      }
    }

    // remove remote users and player views
    remoteUsers = {};
    if (document.getElementById("remote-playerlist")) {
      document.getElementById("remote-playerlist").innerHTML = "";
    }
    if (isSharingEnabled.value) {
      screenVideoTrack && screenVideoTrack.close();
      screenAudioTrack && screenAudioTrack.close();
      channel.sendMessage({
        text: JSON.stringify({ type: "stop_share_screen", uid: UID }),
      });
      isSharingEnabled.value = false;
    }
    if (isRecordingEnabled.value) {
      await stopRecording();
    }
    // leave the channel
    if (client) {
      await client.leave();
    }

    isJoined.value = false;
    isCameraOff.value = false;
    isMute.value = false;
    userCount.value = 1;

    if (channel) {
      await channel?.leave();
    }
    if (rtmClient) await rtmClient?.logout();
    // sessionStorage.clear();
    // location.reload();
    console.debug(
      "_________________________client leaves channel success",
      localTracks
    );
    // router.push({ name: "AgoraRtcRtm" });
    if (!directBack.value) {
      router.go(-1);
    }
  } catch (error) {
    console.error("Error while Ending call:", error);
    router.go(-1);
  }
}

async function subscribe(user, mediaType) {
  const uid = user.uid;
  await client.subscribe(user, mediaType);
  if (mediaType === "video") {
    const player = `<div id="player-${uid}" class="player"></div>`;
    if (document.getElementById(`player-wrapper-${uid}`)) {
      document.getElementById(`player-avatar-wrapper-${uid}`).style.display =
        "none";
      document.getElementById(`player-info-${uid}`).innerHTML =
        user._audio_muted_ ? muteIcon : unmuteIcon;
      if (document.getElementById(`player-${uid}`)) {
        document.getElementById(`player-${uid}`).style.display = "block";
        document.getElementById(`player-${uid}`).innerHTML = "";
      } else {
        document
          .getElementById(`player-wrapper-${uid}`)
          .insertAdjacentHTML("beforeend", player);
      }
    }
    user.videoTrack.play(`player-${uid}`);
  }
  if (mediaType === "audio") {
    if (document.getElementById(`player-info-${uid}`)) {
      document.getElementById(`player-info-${uid}`).innerHTML =
        user._audio_muted_ ? muteIcon : unmuteIcon;
    }
    user.audioTrack?.play();
  }
  // console.log(user._audio_muted_, "MUTE", uid);
}

function handleUserPublished(user, mediaType) {
  subscribe(user, mediaType);
}

function handleUserLeft(user) {
  const id = user.uid;
  delete remoteUsers[id];
  userCount.value = userCount.value !== 1 ? userCount.value - 1 : 1;
  document.getElementById(`player-wrapper-${id}`).remove();
  if (id == remoteUserId.value) {
    if (isSharingEnabled.value)
      document.getElementById("screen-player-container").innerHTML = "";
    isSharingEnabled.value = false;
  }

  // if (userCount.value >= 1) handleEndCall();
}

function handleUserUnpublished(user, mediaType) {
  const id = user.uid;
  if (mediaType === "audio") {
    document.getElementById(`player-info-${id}`).innerHTML = muteIcon;
  }
  if (mediaType === "video") {
    document.getElementById(`player-avatar-wrapper-${id}`).style.display =
      "block";
    document.getElementById(`player-${id}`).style.display = "none";
  }
}
function debounce(func, timeout = 2000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
function setMuteStatus() {
  for (const [uid, data] of Object.entries(remoteUsers)) {
    console.log(`${uid}: ${data._audio_muted_} SET_MUTE`);
    document.getElementById(`player-info-${uid}`).innerHTML = data._audio_muted_
      ? muteIcon
      : unmuteIcon;
  }
}
const processChange = debounce(() => setMuteStatus());
async function handleUserJoined(user) {
  console.log("user", user);
  const uid = user.uid;
  remoteUsers[uid] = user;
  const name = await getRemoteUserName(uid);
  const player = `
        <div class="player-wrapper" id="player-wrapper-${uid}">
          <div class="player-avatar-wrapper" id="player-avatar-wrapper-${uid}">
            <img
              src="/src/assets/teacher/images/video-avtar-icon.jpg"
              alt="Avatar"
              class="avatar"
            />
          </div>
          <div class="player-info-badge">
            <span id="player-info-${uid}">
            </span>
            <span> ${name} </span>
          </div>
        </div>
      `;
  // setTimeout(() => {
  //   console.log(user._audio_muted_, "mute user", uid);
  //   document.getElementById(`player-info-${uid}`).innerHTML = user._audio_muted_
  //     ? muteIcon
  //     : unmuteIcon;
  // }, 2000);
  document
    .getElementById("remote-playerlist")
    .insertAdjacentHTML("beforeend", player);

  processChange();
  // console.log("JOINed");
  if (isSharingEnabled.value) {
    channel.sendMessage({
      text: JSON.stringify({ type: "start_share_screen", uid: UID }),
    });
  }
  if (isRecordingEnabled.value) {
    channel.sendMessage({
      text: JSON.stringify({ type: "on_going_recording", uid: UID }),
    });
  }
  // console.log(remoteUsers, 'REMORE')
  userCount.value += 1;
}
const initCamera = async (_publish) => {
  localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
  document.getElementById("local-player").innerHTML = "";
  localTracks.videoTrack.play("local-player");
  if (_publish) {
    await client.publish(localTracks.videoTrack);
  }
};
const stopScreenSharing = async () => {
  isSharingEnabled.value = false;
  // screenTrack.close();
  screenVideoTrack && screenVideoTrack.close();
  screenAudioTrack && screenAudioTrack.close();
  await client.unpublish(screenVideoTrack);
  if (!isCameraOff.value) {
    localTracks.videoTrack.close();
    await initCamera(true);
  }
  channel.sendMessage({
    text: JSON.stringify({ type: "stop_share_screen", uid: UID }),
  });
};
async function onShareScreen() {
  let screenTrack;
  let player = `<div id="local-player" class="player"></div>`;
  if (!isSharingEnabled.value) {
    try {
      screenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: "720p",
        },
        "auto"
      );
      isSharingEnabled.value = true;
      document.getElementById(`local-player`).remove();
      document
        .getElementById(`player-wrapper-${UID}`)
        .insertAdjacentHTML("afterbegin", player);

      if (screenTrack instanceof Array) {
        screenVideoTrack = screenTrack[0];
        screenAudioTrack = screenTrack[1];
      } else {
        screenVideoTrack = screenTrack;
      }
      screenVideoTrack.on("track-ended", async () => {
        await stopScreenSharing();
      });
      screenVideoTrack.play(`local-player`);

      await client.unpublish([localTracks.videoTrack]);
      // await client.publish([screenTrack]);
      if (screenAudioTrack == null) {
        await client.publish([screenVideoTrack]);
      } else {
        await client.publish([screenVideoTrack, screenAudioTrack]);
      }
      channel.sendMessage({
        text: JSON.stringify({ type: "start_share_screen", uid: UID }),
      });
    } catch (error) {
      isSharingEnabled.value = false;
    }
  } else {
    await stopScreenSharing();
  }
}
const copiedRoomId = () => {
  navigator.clipboard.writeText(roomId.value);
  // alert("Copied: " + roomId.value);
  Toast.fire({
    title: `Copied: ${roomId.value}`,
    background: "#007bff",
    color: "white",
  });
};

//  TODO:
// ========= ###### Screen Recording ########
const getAgoraResourceId = async () => {
  const obj = {
    channelName: roomId.value,
    userId: staticUid,
  };
  try {
    // https://sppcht-api.dvconsulting.org/api/v1/chat
    const res = await axios.post(
      `https://sppcht-api.dvconsulting.org/api/v1/chat/agora/video/resource-id`,
      obj
    );
    agoraRecordingObj.resource_id = res.data.resourceId;
    return res;
  } catch (error) {
    console.log(error);
  }
};
const agoraStartRecording = async () => {
  const remoteIds = Object.keys(remoteUsers);
  const obj = {
    channelName: roomId.value,
    userId: staticUid,
    resourceId: agoraRecordingObj.resource_id,
    // token: rtc_token,
    uids: [...remoteIds],
  };
  try {
    const res = await axios.post(
      `https://sppcht-api.dvconsulting.org/api/v1/chat/agora/video/start-recording`,
      obj
    );
    if (res.status !== 200) throw new Error("Something went wrong");
    agoraRecordingObj.sid = res.data.sid;
    // await inserOtherUserOnRecording()
  } catch (error) {
    console.log(error);
  }
};

const stopRecording = async () => {
  const obj = {
    channelName: roomId.value,
    userId: staticUid,
    resourceId: agoraRecordingObj.resource_id,
    sid: agoraRecordingObj.sid,
  };
  try {
    const res = await axios.post(
      `https://sppcht-api.dvconsulting.org/api/v1/chat/agora/video/stop-recording`,
      obj
    );
    // debugger
    channel.sendMessage({
      text: JSON.stringify({ type: "stop_recording", uid: UID }),
    });
    isRecordingEnabled.value = false;

    // TODO:
    const socketMessage = {
      message: "",
      room_uuid: roomId.value,
      parent_id: "",
      content_type: "recording",
      attachments: [
        {
          mimetype: "video/mp4",
          originalName: "",
          size: null,
          file_path: res.data?.recordedVideo,
          prev_path: "",
          s3_name: "",
        },
      ],
    };
    // debugger;

    SocketioService.sendMessage(socketMessage);
  } catch (error) {
    console.log(error);
  }
};
const onScreenRecording = async () => {
  if (!isRecordingEnabled.value) {
    try {
      const res = await getAgoraResourceId();
      if (res.status !== 200) throw new Error("Something went wrong");
      await agoraStartRecording();
      channel.sendMessage({
        text: JSON.stringify({ type: "start_recording", uid: UID }),
      });
      isRecordingEnabled.value = true;
    } catch (error) {
      console.log(error);
    }
  } else {
    await stopRecording();
  }
};

// LIFE CYCLE
onMounted(async () => {
  await SocketioService.setupSocketConnection();
  SocketioService.socketConnection();
  SocketioService.joinRoom({ room_uuid: roomId.value });

  videoStore.setFieldValue("call_ongoing", true);
  await userStore.getUserDetails();
  if (route.params.host_type === "host") {
    onGetMemberList();
  }
  onEnterBeforeExistingRoom();
});
onBeforeUnmount(() => {
  SocketioService.disconnect();

  if (!callEnd.value) {
    directBack.value = true;
    handleEndCall();
  }
  videoStore.resetData();
});
</script>
<style lang="scss">
.player-container {
  height: 100%;
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)) !important;
  grid-auto-rows: 1fr;
  grid-gap: 10px;
  justify-content: center;
  @media screen and (max-width: 990px) {
    //border: 1px solid yellow;
    display: flex;
    flex-direction: column;
  }
}
.player-container-right-side {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
}
.player-container-2-4 {
  grid-template-columns: repeat(2, minmax(500px, 1fr)) !important;
}
.player-container-5-6 {
  grid-template-columns: repeat(3, minmax(300px, 1fr)) !important;
}
.player-container-7-8 {
  grid-template-columns: repeat(4, minmax(250px, 1fr)) !important;
}
.player-container-9-10 {
  grid-template-columns: repeat(5, minmax(200px, 1fr)) !important;
}
.item {
  grid-row-start: 1;
  grid-row-end: 3;
}
.player-info-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0;
  height: 32px;
  cursor: pointer;
  padding-right: 10px;
  z-index: 99999;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  span {
    text-align: right;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    color: #0e3461;
  }
}
.player-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 5px;
  background: radial-gradient(
    50.28% 87.55% at 50% 50%,
    #004493 0%,
    #01152d 100%
  );
  box-shadow: 0px 0px 34px 0px rgba(23, 186, 255, 0.55) inset;
}
.player {
  width: 90%;
  height: 100%;
  object-fit: contain;
  color: white;
}
.player-avatar-wrapper {
  position: absolute;
  height: 260px;
  width: 260px;
  border-radius: 50%;
  background-color: aliceblue;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 990px) {
    height: 96px;
    width: 96px;
  }
}
.avatar {
  vertical-align: middle;
  height: 260px;
  //width: 260px;
  border-radius: 50%;
  object-fit: cover;
  @media screen and (max-width: 990px) {
    height: 96px;
    width: 96px;
  }
}
/* video {
        object-fit: contain !important;
        width: 100vw !important;
    } */
@media screen and (max-width: 1023px) {
  .player {
    width: 96%;
  }
}
.before-enter-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.before-enter-inner-screen {
  width: 70vw;
  height: 80vh;
  border: 1px solid black;
  border-radius: 15px;
  padding: 15px 0px;
}
.before-enter-buttons {
  position: absolute;
  bottom: 10px;
  display: flex;
}
.screen-share-border {
  border: 3px solid red;
}
</style>
