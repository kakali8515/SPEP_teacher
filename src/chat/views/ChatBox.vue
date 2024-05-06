<template>
  <div class="chat-detail-wrap martop24">
    <div class="chat-head-wrapper d-flex w-100" v-if="!userStore.getIsMobileViewReady">
      <div class="icon-area pointer" @click="$router.go(-1)">
        <img src="@/assets/icons/left-arrow.svg" alt="" class="pointer"/>
      </div>
      <div class="chat-head ml-auto mr-auto">
        <div class="head-sec">
          <h4>{{ route.params.room_name }} <span>{{ route.params.member }}</span></h4>
          <p class="text-center">{{ addOrdinalSuffix(Number(route.params.session)) }} Session in {{ route.params.year }}</p>
        </div>
      </div>
      <div>
        <button class="btn btn-pr" @click="placeCall">
        Call</button>
      </div>
    </div>
    <div class="chat-area">
      <div class="chat-box" id="scroll_div">
        
        <div class="conversation-area">
          <template v-for="(item, idx) in  chat.chat_history" :key="idx">
            <ChatDate 
              v-if="idx == 0"
              :date="dateFormat(item.created_at, 'LL')"
            />
            <ChatDate 
              v-if="
                idx !== 0 &&
                dateFormat(
                  chat.chat_history[idx].created_at,
                  'DD/MM/YYYY'
                ) !==
                  dateFormat(
                    chat.chat_history[idx - 1].created_at,
                    'DD/MM/YYYY'
                  )
              "
              :date="
                dateFormat(chat.chat_history[idx].created_at, 'LL')
              "
            />
            <!-- <div class="chat-element" v-if="item.content_type === 'info'">
              <span>You invited Jungna Kim, Hanbyul Kang, Changseok Kang, Jungna Kim,
                Hanbyul Kang, Changseok Kang, User name, User name.</span>
            </div> -->
            <TextMessage 
              v-if="item.content_type === 'text'"
              :data="item" 
              :is-self="checkIsLoggedInUser(item.user_id)"
              :time="dateFormat(item.created_at, 'LT')"
            />
            <UrlMessage
              v-if="item.content_type === 'url'"
              :is-self="checkIsLoggedInUser(item.user_id)"
              :sender-name="!checkIsLoggedInUser(item.user_id) ? item.user_name_en : ''"
              :time="dateFormat(item.created_at, 'LT')"
              :message="item.message"
            />
            <ImageMessage 
              v-else-if="item.content_type === 'image'"
              :is-self="checkIsLoggedInUser(item.user_id)"
              :sender-name="!checkIsLoggedInUser(item.user_id) ? item.user_name_en : ''"
              :attachments="item.attachments"
              :time="dateFormat(item.created_at, 'LT')"
              :isMoreThanThree="item.attachments.length > 3"
              :isLocalData="!item?.id"
              :isLoading="item?.isLoading"
            />
            <VideoMessage 
              v-else-if="item.content_type === 'video'"
              :is-self="checkIsLoggedInUser(item.user_id)"
              :sender-name="!checkIsLoggedInUser(item.user_id) ? item.user_name_en : ''"
              :attachments="item.attachments"
              :time="dateFormat(item.created_at, 'LT')"
              :isMoreThanThree="item.attachments.length > 3"
              :isLocalData="!item?.id"
              :isLoading="item?.isLoading"
            />

            <!-- TODO:  -->
            <VideoMessage 
              v-else-if="item.content_type === 'recording'"
              :is-self="checkIsLoggedInUser(item.user_id)"
              :sender-name="!checkIsLoggedInUser(item.user_id) ? item.user_name_en : ''"
              :attachments="item.attachments"
              :time="dateFormat(item.created_at, 'LT')"
              :isMoreThanThree="item.attachments.length > 3"
              :isLocalData="!item?.id"
              :isLoading="item?.isLoading"
            />
            <AudioMessage 
              v-else-if="item.content_type === 'audio'"
              :is-self="checkIsLoggedInUser(item.user_id)"
              :sender-name="!checkIsLoggedInUser(item.user_id) ? item.user_name_en : ''"
              :attachments="item.attachments"
              :time="dateFormat(item.created_at, 'LT')"
              :isMoreThanThree="item.attachments.length > 3"
              :isLocalData="!item?.id"
              :isLoading="item?.isLoading"
            />
            <DocMessage 
              v-else-if="item.content_type === 'document'"
              :is-self="checkIsLoggedInUser(item.user_id)"
              :sender-name="!checkIsLoggedInUser(item.user_id) ? item.user_name_en : ''"
              :attachments="item.attachments"
              :time="dateFormat(item.created_at, 'LT')"
              :isMoreThanThree="item.attachments.length > 3"
              :isLocalData="!item?.id"
            />
          </template>

          
        </div>
      </div>
      <!-- Bottom::   -->
      <div class="text-area">
        <div class="text-box">
          <div class="text">
            <input type="text" placeholder="Please enter your details." v-model="chat.message.value" style="color: black;" @keydown="sentOnEnter($event)"
              @input="checkData"/>
          </div>
          <div class="attach-area">
            <div class="attach-file pointer"  @click="optionBoxVisiblity = true">
              <img src="@/assets/icons/attach.svg" alt="" />
            </div>
            <div class="attach-file pointer" @click="openGallery()">
              <img src="@/assets/icons/img-attach.svg" alt="" />
              <input class="d-none" id="galleryInput" type="file"
                accept=".jpeg, .jpg, .png, .mp4, .avi, .wmv, .mov" @change="getFile($event)" />
            </div>
            <div class="attach-file">
              <button :class="{ 'disable-event': !enableSendBtn }" @click="handleSendMessage"><img src="@/assets/icons/up-btn.svg" alt="" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Attachment Selection Box -->
  <OptionBox
    v-if="optionBoxVisiblity"
    @cancel="optionBoxVisiblity = false"
        @onFileSave="getImageUrl"
  />
  <LoaderVue :loading="chat.loading" />
</template>
<script setup>
import useMixins from '@/composables/useMixins.js';
import moment from "moment";
import OptionBox from "@/chat/ui/Option.vue";
import TextMessage from "@/chat/ui/TextMessage.vue";
import UrlMessage from "@/chat/ui/UrlMessage.vue";
import VideoMessage from "@/chat/ui/VideoMessage.vue";
import AudioMessage from "@/chat/ui/AudioMessage.vue";
import DocMessage from "@/chat/ui/DocMessage.vue";
import ImageMessage from "@/chat/ui/ImageMessage.vue";
import ChatDate from "@/chat/ui/ChatDateInfo.vue";
import SocketioService from "@/chat/services/SocketIoService";
import { onMounted, reactive, computed, onBeforeUnmount, ref } from "vue";
import { useRoute,useRouter } from "vue-router";
import { Message } from "@/chat/services/Message";
import { useUserData } from "@/stores/useUserDataCopy";
const { addOrdinalSuffix } = useMixins();
const userStore = useUserData();
const chatService = new Message();
const route = useRoute();
const router = useRouter();
const optionBoxVisiblity = ref(false)
const enableSendBtn = ref(false)
const chat = reactive({
  message: {value: '', type: 'text'},
  chat_history: [],
  attachments: [],
  loading: false,
  page_details: {page: 1, total: 0, limit: 20}
})
let scrollElement;
let scrollInProgress = false;

const getRoomId = computed(() => route.params.id);
const getLoggedInUserId = computed(() => userStore.getUserData?.id)

const checkIsLoggedInUser = (_id) => {
  return getLoggedInUserId.value === _id
}
const dateFormat = (dt, fm, n = "NA") => {
  if (!dt) return n;
  let date = new Date(dt);
  let formatedDate = moment(date).format(fm);
  return formatedDate;
}
const isUrl = (value) => {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}
const openGallery = () => {
    const gallery = document.getElementById("galleryInput");
    gallery.showPicker();
}
const getFileType = (file) => {
    if (file.type.match("image.*")) {
        return "image";
    } else if (file.type.match("video.*")) {
        return "video";
    } else if (file.type.match("audio.*")) {
        return "audio";
    } else {
        return "document";
    }
};
const getFile = (event) => {
    const files = [...event.target.files];
    let fileType = getFileType(files[0]);
    getImageUrl({ data: [...files], type: fileType })
}
const resetTextBox = () => {
  chat.message.value = "";
  chat.message.type = "text";
  chat.attachments = [];
  enableSendBtn.value = false;
}
// Checking any text written or not (excluding blank space)
const checkData = (event) => {
  const value = event.target.value;
  enableSendBtn.value = value.trim().length > 0 ? true : false
}
// For sending message on enter
const sentOnEnter = (event) => {
  let code = event.keyCode || event.which;
  if (code == 13 && enableSendBtn.value) {
    handleSendMessage();
  }
};
const handleSendMessage = () => {
  const obj = {
    "message": chat.message.value,
    "room_uuid": getRoomId.value,
    "parent_id": "",
    content_type: chat.attachments.length
      ? chat.message.type
      : isUrl(chat.message.value)
      ? "url"
      : "text",
    "attachments": chat.attachments
}
console.log(obj,'send')
  SocketioService.sendMessage(obj);
  resetTextBox()
}



// For handle emit funtion after seletion of files
const getImageUrl = async ({ data, type }) => {
  const fd = new FormData();
  const key = type === 'video' ? 'video_attachments' : 'attachments'
  data.map((item) => {
    fd.append(key, item);
  });
  var b = moment.utc();
  if (type === "image") {
    chat.chat_history.push({
      created_at: b.valueOf(),
      content_type: type,
      room_uuid: getRoomId.value,
      user_id: getLoggedInUserId.value,
      attachments: data,
      isLoading: true,
      isLocal: true,
    });
  } else if (type === "document") {
    chat.chat_history.push({
      created_at: b.valueOf(),
      content_type: type,
      room_uuid: getRoomId.value,
      user_id: getLoggedInUserId.value,
      attachments: data,
      isLocal: true,
    });
  } else if (type === "video") {
    chat.chat_history.push({
      created_at: b.valueOf(),
      content_type: type,
      room_uuid: getRoomId.value,
      user_id: getLoggedInUserId.value,
      attachments: data,
      isLoading: true,
      isLocal: true,
    });
  } else if (type === "audio") {
    chat.chat_history.push({
      created_at: b.valueOf(),
      content_type: type,
      room_uuid: getRoomId.value,
      user_id: getLoggedInUserId.value,
      attachments: data,
      isLoading: true,
      isLocal: true,
    });
  }

  setTimeout(() => {
    scrollToBottom();
  }, 200);
  try {
    const res = type === 'video' ? await chatService.uploadVideoAttachment(fd) : await chatService.uploadAttachment(fd);
    if (res.status == 200 || res.status == 201) {
      chat.attachments = res.data.attachments
      chat.message.type = type;
      handleSendMessage();
    }
  } catch (error) {
    console.log(error);
  }
};

const placeCall = () => {
  router.push(`/spep-video-chat/host/${route.params.room_name}/${getRoomId.value}`);
}
// API Call
const onGetChatHistory = async (onscroll) => {
    const obj = {
      page: chat.page_details.page,
      limit: chat.page_details.limit,
      room_uuid: getRoomId.value
    }
    try {
        chat.loading = true;
        const res = await chatService.getChatHistory(obj);
        if (!res.data.success) return;
        chat.page_details.total = res.data.pages;
        if (onscroll) {
          const list = res.data.list.reverse();
          chat.chat_history.unshift(...list);
          scrollElement.scrollTo({ top: 400, behavior: 'smooth' });
          return;
        }
        chat.chat_history = res.data.list.reverse();
    } catch (error) {
        console.log(error)
    } finally {
        chat.loading = false;
    }
};
const scrollToBottom = () => {
  if (scrollElement) {
      scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth",
        });
    }
    scrollElement.scrollIntoView(true);
};
const handleScroll = async () => {
  // If scrollInProgress is true, return early to prevent concurrent execution
  if (scrollInProgress) {
    return;
  }
  scrollInProgress = true;
  try {
    if (scrollElement.scrollTop === 0) {
      if (chat.page_details.total !== chat.page_details.page) {
        chat.page_details.page++;
        await onGetChatHistory(true);
      }
    }
  } catch (error) {
    // Handle any errors that might occur during execution
    console.error("Error occurred in handleScroll:", error);
  } finally {
    // Reset scrollInProgress flag when the function completes (successfully or with an error)
    scrollInProgress = false;
  }
};
// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Wrap your handleScroll function with the debounce function
const debouncedHandleScroll = debounce(handleScroll, 500);

const unreadMessageCount = async(_type) => {
  const obj = {
      page: 1,
      limit: chat.page_details.limit,
      room_uuid: getRoomId.value
    }
    const res = await chatService.getChatHistory(obj);
    if (_type) {
    const list = res.data.list.reverse();
    chat.chat_history.forEach(item => {
      const obj = list.find(s_item => item.conversation_id === s_item)
      if (obj) {
        item.seen_count = obj.seen_count
      }
    })
    console.log(chat.chat_history, 'sen')
  }
}
// ============== Create Sokect Connection ============
const setupSocket = async () => {
  await SocketioService.setupSocketConnection();
  SocketioService.socketConnection();
  SocketioService.joinRoom({room_uuid: getRoomId.value});
  SocketioService.socket.on("acknowledgement", (data) => {
    if (data.room_uuid != getRoomId.value || data.broadcast_type === 'join') return;
    if(data.broadcast_type === 'messageRead') {
      unreadMessageCount('read')
    }
    if(data.broadcast_type !== 'messageSent') return;
    const obj = data;
    obj.id = obj.conversation_id
    if (obj.user_id != getLoggedInUserId.value) {
      obj.read = true;      
      unreadMessageCount();
      SocketioService.readRoomMessage({room_uuid: getRoomId.value});
    }
    // SocketioService.readRoomMessage({room_uuid: getRoomId.value});
    if (obj?.attachments?.length) {
      const findIdx = chat.chat_history.findIndex(
        (item) => item.isLocal
      );
      obj?.attachments.forEach(item => item.file_name = item.original_name)
      const idx = findIdx !== -1 ? findIdx : chat.chat_history.length;
      chat.chat_history[idx] = obj;
    } else {
      chat.chat_history.push(obj);
    }
    // getHighlighted();
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  });
}
// LIFECYCLE HOOKS
onMounted(async () => {
  chat.loading = true;
  setupSocket();
  await userStore.getUserDetails();
  await onGetChatHistory();
  scrollElement =  document.querySelector("#scroll_div")
  setTimeout(() => {
      scrollToBottom();
  }, 800);
  scrollElement.addEventListener("scroll",debouncedHandleScroll);
});
onBeforeUnmount(() => {
  SocketioService.disconnect();
  scrollElement?.removeEventListener("scroll", debouncedHandleScroll);
})
</script>