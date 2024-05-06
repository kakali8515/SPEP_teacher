<template>
    <div class="chat-list pointer" @click="onSelectItem">
        <div class="chat-detail">
            <div class="img-wrap" v-if="isSingleProfile">
                <div class="img">
                    <img :src="data.profile_image" alt="" />
                </div>
            </div>
            <div class="img-wrap group-img" v-else>
                <div class="img">
                    <img src="@/assets/images/chat1.png" alt="" />
                </div>
                <div class="img">
                    <img src="@/assets/images/chat2.png" alt="" />
                </div>
                <div class="img">
                    <img src="@/assets/images/chat3.png" alt="" />
                </div>
                <div class="img">
                    <img src="@/assets/images/chat4.png" alt="" />
                </div>
            </div>
            <div class="chat-list-detail">
                <div class="chat-name-detail">
                    <div class="name-no">
                        <div class="chat-name">
                            <h2>{{ data.room_name }}</h2>
                        </div>
                        <div class="chat-no">
                            <p>{{ data.total_members }}</p>
                        </div>
                    </div>
                    <div class="chat-session">
                        <p>{{ addOrdinalSuffix(data.session) }} Session in {{ data.year }}</p>
                    </div>
                </div>
                <div class="last-chat">
                    <p>{{ data.last_message.message ? data.last_message.message : data.last_message.content_type }}</p>
                </div>
            </div>
        </div>
        <div class="chat-date">
            <div style="gap:10px; display:flex; flex-direction: column;">
            <p class="w-100">{{ getTime(data.last_message.time) }}</p>
            <div class="d-flex justify-content-end w-100" v-if="data.unread_count !== 0">
                <span style="border-radius: 50px; padding: 3px 6px 3px 6px; background-color: #EC676A; color: white; text-align: center; font-size: 12px;">
                    {{ data.unread_count < 100 ? data.unread_count : '99+'}}
                </span>
            </div>
        </div>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
import useMixins from '@/composables/useMixins.js';
const { addOrdinalSuffix } = useMixins();
const props = defineProps({
    isSingleProfile: {
        default: true,
        type: Boolean
    },
    data: {
        type: Object,
        default: {}
    }
})
const emit = defineEmits(['select-item'])
const onSelectItem = () => {
    emit('select-item', props.data);
}
const getTime = (_date) => {
    const specificDate  = moment(_date)
    const today = moment();
    // Get the start date of the current week
    // var startOfWeek = moment().startOf('week');
    // Get the end date of the current week
    // var endOfWeek = moment().endOf('week');
    // specificDate.isBetween(startOfWeek, endOfWeek, null, '[]')
    if (specificDate.isSame(today, 'day')) {
        return specificDate.format('LT')
    } else if (specificDate.year() === today.year()) {
        return specificDate.format('MMM DD')
    } else {
        return specificDate.format('YYYY/MM/DD')
    }
}
</script>
