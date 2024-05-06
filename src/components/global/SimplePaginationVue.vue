<template>
    <div class="martop16">
        <div class="pagination-wrap">
            <div class="prev" :class="{ 'disable-event': currentPage <= 1 }">
                <button type="button" @click="onChange('prev')">
                    <img src="@/assets/teacher/icons/pagination-left.svg">Prev
                </button>
            </div>
            <div class="number">
                <ul>
                    <li class="active">{{ currentPage }}</li>
                    <li>/</li>
                    <li>{{ totalPage }}</li>
                </ul>
            </div>
            <div class="prev" :class="{ 'disable-event': currentPage == totalPage || currentPage > totalPage }">
                <button type="button" @click="onChange('next')">
                    Next <img src="/src/assets/teacher/icons/pagination-right.svg">
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
    records: {
        type: Number,
        default: 0,
    },
    perPage: {
        type: Number,
        default: 8,
    },
    currentPage: {
        type: Number,
        default: 1,
    },
})
const emit = defineEmits(['on-change-handler'])
const totalPage = computed(() => Math.ceil(Math.round(props.records) / props.perPage));
const onChange = (_type) => {
    if (_type == 'prev' && props.currentPage > 1) {
        emit('on-change-handler', props.currentPage - 1);
    } else if (_type == 'next' && props.currentPage < totalPage.value) {
        emit('on-change-handler', props.currentPage + 1);
    }
}
</script>