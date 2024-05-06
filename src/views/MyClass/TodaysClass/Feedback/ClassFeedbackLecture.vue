<template>
    <div class="main-wrap-feedback">
        <div class="feedback-sec shadow-background">
            <div class="f-body">
                <div class="martop16">
                    <FeedbackInfoCard :data="classDetails" />
                </div>
            </div>
        </div>
        <div class="martop32">
            <ClassDetailLecture/>
        </div>
    </div>
</template>
<script setup>
import FeedbackInfoCard from "@/components/MyClass/TodaysClass/Feedback/FeedbackInfoCard.vue";
import ClassDetailLecture from "../ClassDetails/ClassDetailLecture.vue";
const props = defineProps({
  classDetails: {
    type: Object,
    default: {},
  },
});
</script>
  