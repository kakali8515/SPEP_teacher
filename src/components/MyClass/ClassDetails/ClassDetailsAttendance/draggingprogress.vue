<template>
    <div class="dragging-progress-area twoslids">
        <p>{{ score.title }}</p>
        <div class="bar-area">

            <div class="btn-area light-blue" :style="{ left: Math.round(score.user_score) + '%' }">
                <p class="progress-txt-82">{{ Math.round(score.user_score) }}%</p>
            </div>

            <div class="btn-area blue" :style="{ left: Math.round(score.class_avg_score) + '%' }">
                <p class="progress-txt-82">{{ Math.round(score.class_avg_score) }}%</p>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    score: {
        default: {},
        type: Object
    },
})
</script>