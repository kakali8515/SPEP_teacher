<template>
  <!-- <div class="search-wrap" style="margin-top: 30px;">
    <div class="search-area">
      <input
        type="text"
        placeholder="Please search the chat room name and participants."
      />
      <button><img src="@/assets/teacher/icons/search.svg" alt="" /></button>
    </div>
  </div> -->
  <div class="chat-wrap martop16">
    <div class="list-wrap" v-if="chatList.length">
      <ChatListItem v-for="(item, idx) in chatList" :key="idx" :data="item" @select-item="onSelectItem"/>
    </div>
    <NoDataFoundVue v-else message="There are no participating chat rooms."/>
  </div>
  <LoaderVue :loading="isLoading"/>
</template>
<script setup>
import ChatListItem from "@/chat/ui/ChatListItem.vue";
import { Message } from "@/chat/services/Message";
import { useRouter, useRoute } from "vue-router";
import { onMounted, onBeforeUnmount, ref } from "vue";
import SocketioService from "@/chat/services/SocketIoService";

const chatService = new Message();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const chatList = ref([]);
const page = ref(1);
const totalPage = ref(1);
const totalRecords = ref(0);
const limit = 10;
const onSelectItem = (_data) => {
  router.push({name: 'ChatBox', params: {room_name: _data.room_name, member: _data.total_members, session: _data.session, year: _data.year, id: _data.room_id}});
}
const onGetChatList = async (onscroll) => {
    const obj = {
      page: page.value,
      limit: limit
    }
    try {
        isLoading.value = true;
        const res = await chatService.getChatList(obj);
        if (!res.data.success) throw new Error("Something wrong");
        totalPage.value = res.data.pages;
        totalRecords.value = res.data.totalRows;
        if (onscroll) {
          chatList.value.push(...res.data.list);
          return;
        }
        chatList.value = res.data.list;
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false;
    }
};
const handleScroll = () => {
  const scrollY = window.scrollY;
  const visibleHeight = document.documentElement.clientHeight;
  const totalHeight = document.documentElement.scrollHeight;
  if (scrollY + visibleHeight >= totalHeight) {
    if (totalPage.value !== page.value) {
      page.value++;
      onGetChatList(true);
    }
  }
};
// ============== Create Sokect Connection ============
// SocketioService.setupSocketConnection();
// SocketioService.socketConnection();
const setupSocket = async () => {
  await SocketioService.setupSocketConnection();
  SocketioService.socketConnection();
  SocketioService.socket.emit('joinAllRoom')
  SocketioService.socket.on("acknowledgement", (data) => {
    console.log(data, 'dd')
  })
}
onMounted(async () => {
  await onGetChatList();
  setupSocket();
  window.addEventListener("scroll", handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  SocketioService.disconnect();
});
</script>