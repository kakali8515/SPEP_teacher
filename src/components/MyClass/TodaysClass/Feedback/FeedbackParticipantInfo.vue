<template>
    <div class="feedback-sec shadow-background">
        <div class="head">
            <h4>Participant Information in Details</h4>
        </div>
        <div class="request-wrap">
            <p>Participant’s requests</p>
            <ul>
                <li v-for="item in 4" :key="item" v-show="data?.[`want${item}`] !== null">
                    {{ data?.[`want${item}`] }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
});
</script>
  