<template>
    <div class="header-wrap">
        <div class="backicon" v-if="!setHideBackButton" @click="goBack">
            <img src="@/assets/teacher/icons/backheader.svg">
        </div>
        <div class="heading">
            <template v-if="route.name === 'ChatBox'">
                <h4 style="font-size: 16px; font-weight: 600; line-height: 16px; letter-spacing: 0px;">
                    {{ route.params.room_name }} <span>{{ route.params.member }}</span>
                </h4>
                <p style="font-size: 12px; font-weight: 500; line-height: 16px; letter-spacing: 0px; margin-top: 12px;">
                    {{ addOrdinalSuffix(Number(route.params.session)) }} Session in {{ route.params.year }}
                </p>
                <button class="callBTns" @click="placeCall">Call</button>

            </template>
            <h4 v-else>{{ mobileHeaderTitle ? mobileHeaderTitle : headerTitle }}</h4>
        </div>
        <div class="backicon" @click="openSidebar" v-if="route.name !== 'ChatBox'">
            <img style="width: 24px;" src="@/assets/teacher/icons/bars.svg">
        </div>
    </div>
    <SidebarWrapper v-if="sidebarVisiblity" @on-close="closeSidebar" />
</template>
<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SidebarWrapper from "./SidebarWrapper.vue";
import useMixins from '@/composables/useMixins.js';
import { useUserData } from "@/stores/useUserDataCopy";
import usePostMessage from "@/composables/usePostMessage";
const userStore = useUserData();
const { addOrdinalSuffix } = useMixins();
const { onPostMessageFire } = usePostMessage();
const route = useRoute();
const router = useRouter();
const sidebarVisiblity = ref(false);
const hideBackButtonFor = [  // Mention route name, for those need to hide back icon
    'TeacherClass'
]

const headerTitle = computed(() => route.meta.headerTitle);
const mobileHeaderTitle = computed(() => route.meta.mobileHeaderTitle);
const setHideBackButton = computed(() => hideBackButtonFor.includes(route.name));
const getLoggedInUserId = computed(() => userStore.getUserData?.id)

const goBack = () => {
    router.go(-1);
}
const openSidebar = () => {
    sidebarVisiblity.value = true;
};
const closeSidebar = () => {
    sidebarVisiblity.value = false;
};

const placeCall = () => {
    const data = {
        room_id: route.params.id,
        UserId: getLoggedInUserId.value
    }
    onPostMessageFire("callButton", data);
}
</script>