<template>
    <!-- <div class="martop32">
        <div class="class-filter-wrap">
            <div class="v-upload">
                <button type="button">Class Video Upload <img src="@/assets/teacher/icons/upload-btn.svg"></button>
            </div>
        </div>
    </div>
    <div class="martop16">
        <classinfoOne/>
    </div> -->
    <div class="martop24">
        <div class="all-wrap-filter">
            <!-- <div class="search-wrap">
                <div class="input-wrap">
                    <input type="date" v-model="date" @change="getLectureList">
                    <img @click="getLectureList" class="pointer" src="@/assets/teacher/icons/search.svg">
                </div>
            </div>
            <div class="select-wrap">
                <p>Items</p>
                <select v-model="pageDetails.limit" @change="changePerPage($event)">
                    <option :value="10">Show 10 list</option>
                    <option :value="20">Show 20 list</option>
                    <option :value="30">Show 30 list</option>
                    <option :value="50">Show 50 list</option>
                    <option :value="100">Show 100 list</option>
                </select>
            </div> -->
            <div class="table-button">
                <button type="button" @click="openFileUpload">File Upload</button>
            </div>
        </div>

    </div>
    <!-- lecture list table  -->
    <div class="martop16 lectureTable">
        <ClassDetailLectureTable :userDataTable="userDataTable" @lectureDetailModal="getListItemData"
            :pageDetails="pageDetails" @getClassLecture="getClassLecture" :sortKeyTitle="sortKeyTitle"
            :sortOrder="sort_order" @onSorting="onSorting" />
    </div>
    <LectureFileUploadModal v-if="displayFileUploadModal" :showBtn="false" :formData="formData"
        :visible="displayFileUploadModal" @close="closeModal" :classSeq="classSeq" />
    <LoaderVue :loading="isLoading" />
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import ClassDetailLectureTable from '@/components/MyClass/ClassDetails/ClassDetailLectureTable.vue';
import LectureFileUploadModal from "@/components/MyClass/TodaysClass/LectureFileUploadModal.vue";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { useUserData } from "@/stores/useUserDataCopy";
import { useRoute } from "vue-router";


const isLoading = ref(false);
const route = useRoute();
const displayFileUploadModal = ref(false);
const userDataTable = ref([]);
const class_resource = new ClassDetails();
const userStore = useUserData();
const pageDetails = reactive({
    currentPage: 1,
    limit: 10,
    totalRecord: 0,
})
const sort_order = ref("");
const sort_key = ref("");
const sortKeyTitle = ref("");
const classSeq = ref(route.params.class_seq);
const formData = ref({});

// functions 
const getDataTable = async () => {
    let data = {
        class_seq: route.params.class_seq,
        page: pageDetails.currentPage,
        limit: pageDetails.limit,
        sort_key: sort_key.value,
        sort_order: sort_order.value
    };
    try {
        isLoading.value = true;
        const res = await class_resource.getLectureTabList(data);
        if (res.data) {
            userDataTable.value = res.data.list;
            pageDetails.totalRecord = res.data.totalRows;
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
// const getLectureList = () => {
//     getDataTable();
// }
// const changePerPage = (event) => {
//     pageDetails.currentPage = 1;
//     pageDetails.limit = Number(event.target.value);
//     getDataTable();
// };
const getClassLecture = (event) => {
    pageDetails.currentPage = event;
    getDataTable();
};
const closeModal = () => {
    displayFileUploadModal.value = false
    getDataTable();
}
const getListItemData = (data) => {
    formData.value = data
    displayFileUploadModal.value = true
}
const openFileUpload = () => {
    formData.value = {}
    displayFileUploadModal.value = true
}

const onSorting = (key) => {
    sortKeyTitle.value = key;
    if (key == "Date") {
        sort_key.value = 'reg_date';
    } else if (key == "To") {
        sort_key.value = 'to';
    } else if (key == "Title") {
        sort_key.value = 'title';
    } else {
        sort_key.value = 'note';
    }
    if (sort_order.value == "" || sort_order.value == "desc")
        sort_order.value = "asc";
    else sort_order.value = "desc";
    getDataTable();
};

onMounted(async () => {
    isLoading.value = true;
    // await userStore.getUserDetails();
    await getDataTable();
});
</script>