<template>
    <div>
        <div class="feedback-sec responsive-shadow-none shadow-background">
            <div class="head focus-head">
                <h5>This Session’s Selected Feedback Focus Areas</h5>
            </div>
            <div class="focus-list martop32">
                <ul>
                    <li v-for="(item, idx) in currentFocusArea" :key="idx">
                        {{ idx + 1 }}. {{ item.category_title }} {{ item.sub_category_title }}
                    </li>
                </ul>
                <div class="responsive-btn">
                    <button type="button" class="edit">Setting</button>
                </div>
            </div>
        </div>

        <div class="performance-summery martop32">
            <div class="head">
                <h4>Performance summary</h4>
            </div>
            <div class="row martop16" v-if="performanceSummary">
                <div class="col-md-6 col-sm-12" v-for="(item, idx) in performanceSummary">
                    <div class="feedback-pregress-wrap responsive0">
                        <div class="head">
                            <p>{{ idx + 1 }}. {{ item.category_name_en || item.category_title }} - {{ item.sub_category_name_en || item.sub_category_title }}</p>
                        </div>
                        <div class="main-wrap">
                            <ProgressBar v-model:value="item.score" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="alp-wrap shadow-background">
            <h4>Active Learning Prep Completion</h4>
            <div class="alp">
                <ul v-if="alp">
                    <li v-for="item in alpList" :key="item.value">
                        <div class="select-radio">
                            <input type="radio" :id="`alp-${item.value}`" name="radio-group" v-model="alp.alp_status" :value="item.value">
                            <label :for="`alp-${item.value}`">{{item.text}}</label>
                        </div>
                    </li>
                </ul>
                <p v-else>No ALP present for this unit</p>
                
            </div>
        </div>
    </div>
</template>
<script setup>
import ProgressBar from '@/components/common/ProgressBar.vue';
const props = defineProps({
    performanceSummary: {
        type: Array,
    },
    currentFocusArea: {
        type: Array,
    },
    alp: {
        type: Object,
        default: null,
    }
})
const alpList = [
    {text: 'Completed', value: 1},
    {text: 'Partially Completed', value: 2},
    {text: 'Not attempted', value: 0},
]
</script>