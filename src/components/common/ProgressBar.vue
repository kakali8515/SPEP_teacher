<template>
    <div class="progress-bar-wrap">
        <h3>Keep it up</h3>
        <div class="progressslider">
            <input type="range" min="0" max="100" v-model="pData" :disabled="disabled">
            <div class="range-num">
                <!-- <p class="text" style="left: 108px;">{{ cpName }}</p> -->
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
            </div>
        </div>
        <h3>Excelent</h3>
    </div>
</template>
<script setup>
import { ref, watch } from "vue";
const pData = ref(0);

const props = defineProps({
    value: {
        default: 0,
        type: [String, Number]
    },
    disabled: {
        type: Boolean,
        default: false
    },
    cpName: {
        type: String,
        default: ''
    },
})
pData.value = props.value;
watch(() => pData.value, (NV, OV) => {
    if (NV > 0 && NV <= 20) {
        pData.value = 20;
        emit('update:value', 20)
    } else if (NV > 20 && NV <= 40) {
        pData.value = 40;
        emit('update:value', 40);
    } else if (NV > 40 && NV <= 60) {
        pData.value = 60;
        emit('update:value', 60)
    } else if (NV > 60 && NV <= 80) {
        pData.value = 80;
        emit('update:value', 80)
    } else if (NV > 80 && NV <= 100) {
        pData.value = 100;
        emit('update:value', 100)
    } else {
        emit('update:value', 0)
    }
})
const emit = defineEmits(['update:value']);
</script>

<style scoped>
.progress-bar-wrap {
    position: relative;
    width: 100%;
    padding: 20px 16px;
    display: flex;
    /* border: 1px solid red; */
    margin-top: 8px;
    border-radius: 8px;
    border: 1px solid #F2F2F2;
}

.progress-bar-wrap h3 {
    color: #222059;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 100%;
    width: 100%;
    max-width: 60px;
    display: block;
    margin-top: 7px;
}

.progressslider {
    position: relative;
    width: 100%;
    margin-right: 10px;
    margin-left: 5px;
    /* border: 1px solid black; */
}

.progressslider input {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    outline: none;
    position: relative;
}

.progressslider input::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: #F7F9FD;
    border-radius: 10px;
    /* background: red; */
}

.text {
    position: absolute;
    top: -26px;
    color: #181818;
    font-size: 9px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%;
}

.progressslider input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    height: 8px;
    width: 20px;
    border-radius: 10px;
    background: #0C60C2;
    margin-top: 0px;
    position: relative;
    z-index: 9;
}

.range-num {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.range-num span {
    color: var(--Gray-6, #BDBDBD);
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    line-height: 100%;
}</style>