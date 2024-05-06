<template>
    <div class="feedback-sec shadow-background">
        <div class="head">
            <h4>Performance summary</h4>
        </div>
        <div class="performance-wrap martop16">
            <div class="row">
                <div class="col-md-6 col-sm-12" v-for="(item, idx) in getEvalutionList">
                    <div class="feedback-pregress-wrap marbtm24">
                        <div class="head">
                            <p>{{ idx + 1 }}. {{item.exi_category || item.category_title}} - {{item.exi_sub_category || item.sub_category_title}}</p>
                        </div>
                        <div class="main-wrap">
                            <ProgressBar :value="(item.score || 0) * 20" :disabled="true" :cp-name="cpName"/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <div class="feedback-sec shadow-background">
        <div class="head d-flex align-item-center mobrow">
            <h4>This Month's Feedback Focus Area <span v-if="updatedDate">(Updated: {{updatedDate}})</span>
                <!-- You can't edit for a month that's already in progress. -->
            </h4>
            <ButtonVue class="btn btn-light ml-auto borderdBtn" :disabled="isCurrentMonthUpdate || isSubmitted || isDataEntryNotAllow"  @click="$emit('open-focue-area-modal')">Edit</ButtonVue>
        </div>
        <div class="fillers-area">
            <p :key="idx" v-for="(item, idx) in data.current_list">{{item.category_title}} - {{item.sub_category_title}}</p>
        </div>
    </div>
</template>
<script setup>
import moment from "moment";
import ProgressBar from '@/components/common/ProgressBar.vue';
import { computed } from "vue";
const props = defineProps({
    data: {
        type: Object
    },
    cpName: {
        type: String
    },
    updatedDate: {
        type: String
    },
    isSubmitted: {
        type: Boolean,
        default: Boolean
    },
    isDataEntryNotAllow: {
        type: Boolean,
        default: Boolean
    }
})
const emit = defineEmits(['open-focue-area-modal']);
const isCurrentMonthUpdate = computed(() => {
    const parsedDate = moment(props.updatedDate);
    // Get the current month
    const currentMonth = moment().month();

    // Check if the parsed date's month is the same as the current month
    return parsedDate.month() === currentMonth;
})
const getEvalutionList = computed(() => {
    return props.data?.all_list.length ?  props.data?.all_list :  props.data?.current_list
})
</script>