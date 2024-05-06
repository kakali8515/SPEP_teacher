<template>
    <ModalVue v-if="modelValue" :show="modelValue" mWidth="670px" mHeight="800px" :isLoading="isLoading" @close="closeModal">
        <template #body>
            <div class="seeting-feedback-wrap" v-if="!isLoading">
                <div class="check-wrap">
                    <!-- <div @click="closeModal" class="close">
                        <img src="@/assets/icons/close.svg">
                    </div> -->
                    <!-- {{ selectedItem }} -->
                    <h4>Language Ability Focus</h4>
                    <div class="check" v-for="(item, id) in foucsAreaList">
                        <h5>{{ item.category_title_en }}</h5>
                        <div class="form-group-wrap" v-for="(subItem, idx) in item.sub_category">
                            <input type="checkbox" :id="`check${idx}-${id}`" :checked="subItem.selected" v-model="subItem.selected" :disabled="isCheckedTwo && !subItem.selected">
                            <label :for="`check${idx}-${id}`">{{ subItem.title_en }}</label>
                        </div>
                    </div>
                </div>



                <div class="modal-button">
                    <ButtonVue @click="onSubmitCpSelection" :disabled="!isCheckedTwo" :loading="submitLoader">Save</ButtonVue>
                </div>
            </div>
        </template>
    </ModalVue>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { Feedback } from "@/services/MyClass/Feedback";
import { useRoute } from "vue-router";
const feedback = new Feedback();
const isLoading = ref(false);
const submitLoader = ref(false);
const route = useRoute()
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    cpId: {
        type: String
    },
    unitSeq: {
        type: Object
    }
})
const foucsAreaList = ref([]);
const isCheckedTwo = ref(false);
const selectedItem = ref([])

const emit = defineEmits(['close']);
const closeModal = () => {
    emit('close', false);
};
watch(()=>foucsAreaList.value, (nV, oV) => {
        let count = 0;
        selectedItem.value = [];
       foucsAreaList.value.map(item => {
            const items = item.sub_category.filter((sItem) => sItem.selected);
            selectedItem.value.push(...items);
            count += items.length
        })
        isCheckedTwo.value = count === 2;
},{deep: true})
const getCPList = async () => {
    let data = {
        class_seq: route.params.class_seq,
        cp_id: props.cpId
    };
    try {
        isLoading.value = true;
        const res = await feedback.getFoucsAreaList(data);
        if (res.data?.success) {
            foucsAreaList.value = res.data.list;
            foucsAreaList.value.forEach((item) => {
                item.sub_category.forEach((sItem) => {
                    sItem.category_seq = item.category_seq;
                })
            })
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
const onSubmitCpSelection = async () => {
    const list = selectedItem.value.map(item => { return {category_seq: item.category_seq, sub_category_seq: item.sub_category_seq}})
    let obj = {
        schedule_seq: route.params.schedule_seq,
        cp_id: props.cpId,
        data: list,
    };
    try {
        submitLoader.value = true;
        const res = await feedback.submitFocusAreaData(obj);
        if (res.data?.success) {
            emit('close', true);
        }
    } catch (error) {
        console.log(error);
    } finally {
        submitLoader.value = false;
    }
}
onMounted(() => {
    getCPList()
})
</script>