<template>
    <div class="message-image-upload-wrap martop24">
        <div class="my-info-wrapper">
            <div class="details-wrap">
                <div class="title">
                    <p><span>Company </span> {{ messageDetails?.classInfo?.company_name_kr }}</p>
                </div>
                <div class="title">
                    <p><span>Course </span> {{ messageDetails?.classInfo?.program1 }}</p>
                </div>
                <div class="title">
                    <p><span>Location </span> {{ messageDetails?.classInfo?.area_d_name_kr }}</p>
                </div>
                <div class="title">
                    <p><span>From </span> {{ messageDetails?.mainItem?.sender_id }}</p>
                </div>
                <div class="title">
                    <p><span>Owned by </span>{{ messageDetails?.mainItem?.user_name }}</p>
                </div>
                <div class="title">
                    <p><span>Regist Date </span>{{ messageDetails?.mainItem?.reg_date }}</p>
                </div>
                <div class="title">
                    <p><span>Title </span>{{ messageDetails?.mainItem?.title }}</p>
                </div>
            </div>
            <div class="full-message">
                <span>Contents</span>
                <p>{{ contentValue[0]?.contents }}</p>
            </div>
            <div class="status">
                <span>Status</span>
                <div class="form-group-wrap">
                    <input type="checkbox" id="check1">
                    <label for="check1">Emergency/Important</label>
                </div>
            </div>
            <div class="martop30">
                <div class="tablemain-wrap">
                    <div class="table onemsg-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Written by</th>
                                    <th>Answer</th>
                                    <th>Regist Date</th>
                                    <!-- <th></th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="data in messageDetails?.reply" :key="data">
                                    <td style="width: 190px;">{{ data.user_name }}</td>
                                    <td>
                                        <!-- <img src="@/assets/teacher/images/img-frame.svg"> -->
                                        <div class="msg-txt-img">
                                            <div class="img-wrap"
                                                v-if="JSON.parse(data.contents) && JSON.parse(data.contents)?.filePath?.length">
                                                <div class="upload-img">
                                                    <img src="@/assets/icons/File.svg">
                                                    <div class="pointer">
                                                        <p>{{ JSON.parse(data.contents).file_name }}</p>
                                                        <!-- <p>{{ JSON.parse(data.contents).contents }}</p> -->
                                                    </div>
                                                </div>
                                            </div>
                                            <p>{{ JSON.parse(data.contents).contents }}</p>                                            
                                        </div>
                                    </td>
                                    <td style="width: 240px;">
                                        <div class="date-butn"> {{ moment(data.reg_date).format("YYYY.MM.DD") }}
                                            <span class="delete pointer" @click="deleteReply(data.msg_reply_seq)">Delete</span>
                                        </div>
                                        
                                    </td>
                                   
                                </tr>
                            </tbody>
                        </table>
                        <div class="text-center p-4" v-if="messageDetails?.reply?.length == 0">No Reply Added</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="message-image-upload-wrap martop24">
        <div class="my-info-wrapper">
            <div class="form">
                <p>Answer</p>
                <textarea placeholder="Please enter your message." v-model="state.userAnswer" :maxlength="250"></textarea>
                <p style="color: red" class="pt-2" v-if="v$.userAnswer?.$error">{{ v$.userAnswer?.$errors[0].$message
                }}</p>
                <div class="wrapper" v-if="!filePreviews">
                    <div class="uploaded-image">
                        <div class="upload">
                            <img src="@/assets/teacher/images/uploadedimg.svg">
                        </div>
                        <button type="button">
                            <img class="cancel" src="@/assets/teacher/images/imgcancel.svg">
                        </button>
                    </div>
                </div>
                <div style="width: 100%;">
                    <div v-for="(file, index) in filePreviews" :key="index" style="display: flex; width: 100%">
                        <img :src="file.preview" alt="File Preview" style="width: 100px; height: 100px;" />
                    </div>
                </div>
            </div>
            <div class="martop30">
                <div class="addbutton">
                    <!-- <button type="button">Add Image</button> -->
                    <input type="file" ref="fileInput"
              accept="image/png, image/jpeg, image/gif" multiple @change="handleFileUpload" />

                </div>
            </div>
        </div>
        <div class="msg-btn-wrapper martop24">
            <button type="button" @click="showDeleteMessageModal">Delete Message</button>
            <div class="button-wrap">
                <button type="button" class="blue-bordered" @click="router.push({ name: 'OneMessage' })">To List</button>
                <button type="button" class="solid" @click="addMessageReplyInfo">Add Answer</button>
            </div>
        </div>
    </div>
    <ModalVue v-if="displaySubmitModal" :show="displaySubmitModal" mWidth="355px" :defaultCloseBtn="false">
        <template #body>
            <div class="savemodal">
                <div class="savemessage">
                    <p>Are you sure you want to delete the message.</p>
                </div>
                <div class="button-wrap">
                    <button type="button" @click="displaySubmitModal = false" class="bordered">Cancel</button>
                    <button type="button" @click="deleteMessage">Save</button>
                </div>
            </div>
        </template>
    </ModalVue>
    <LoaderVue :loading="isLoading" />
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { useUserData } from "@/stores/useUserDataCopy";
import { useRoute, useRouter } from "vue-router";
import { OneMessage } from "@/services/Message/OneMessage";
import { required, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { TodaysClass } from "@/services/MyClass/TodaysClass";
import useMixins from '@/composables/useMixins.js';
import moment from "moment";

const { saveFile } = useMixins();
const my_class = new TodaysClass();
const displaySubmitModal = ref(false);
const route = useRoute();
const router = useRouter();
const messageDetails = ref({});
const messageSeq = ref(route.query.mesSeq)
const oneMessage = new OneMessage();
const isLoading = ref(false);
const userStore = useUserData();
const contentValue = ref('')
const filePreviews = ref([]);
const filesArray = ref([]);
const state = reactive({
    userAnswer: ''
})
const replyMessage = ref([])
const parsedFiles = ref([]);

// functions
const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files) {
        console.log('select atleast one file');
        return;
    }
    // Clear previous previews
    filePreviews.value = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        filesArray.value.push(file);
        const reader = new FileReader();
        reader.onload = () => {
            filePreviews.value.push({
                name: file.name,
                size: file.size,
                preview: reader.result,
            });
        };
        reader.readAsDataURL(file);
    }
    await addImage()
};
const getMessageDetailData = async () => {
    let data = {
        user_id: userStore.getUserData.id,
        msg_seq: messageSeq.value,
        lgCode: "kr",
    };
    try {
        isLoading.value = true;
        const res = await oneMessage.getMessageDetails(data);
        if (res.data?.result) {
            isLoading.value = false;
            messageDetails.value = res.data;
            contentValue.value = JSON.parse(res.data.mainItem.contents)
            const checkbox = document.getElementById('check1');
            if (messageDetails.value.mainItem.status == 0) {
                checkbox.checked = false;
            } else {
                checkbox.checked = true;
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
const rules = {
    userAnswer: {
        required: helpers.withMessage('메시지가 필요합니다.', required),
    },
}
const v$ = useVuelidate(rules, state);

const addMessageReplyInfo = async () => {
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) {
        console.log('inside error')
        return;
    } else {
        try {
            isLoading.value = true;
            let data = {
                user_id: userStore.getUserData.id,
                msg_seq: messageSeq.value,
                contents: JSON.stringify({
                    type: contentValue.value.type,
                    sortNum: contentValue.value.sortNum,
                    contents: state.userAnswer,
                    baseObjId: contentValue.value.baseObjId,
                    isFirstLoaded: true,
                    position: 0,
                    filePath: filesArray.value,
                    // thumbPath: '',
                    // width: '', 
                    // height: '',
                    // thumb_width: '',
                    // thumb_height: ''

                }),
                parent_reply_seq: 0,
                reply_type: 0,
                stauts: 0

            };
            const res = await oneMessage.addMessageReply(data);
            if (res.data?.result) {
                isLoading.value = false;
                router.push({ name: 'OneMessage' })

            }
        } catch (error) {
            console.log(error);
        } finally {
        }
    }
};
const deleteReply = async (id) => {
    let data = {
        msg_reply_seq: id
    };
    try {
        isLoading.value = true;
        const res = await oneMessage.deleteMessageReply(data);
        if (res.data.result) {
            await getMessageDetailData();
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
const showDeleteMessageModal = async () => {
    displaySubmitModal.value = true;
}
const deleteMessage = async () => {
    displaySubmitModal.value = false
    let data = {
        msg_seq: messageSeq.value
    };
    try {
        isLoading.value = true;
        const res = await oneMessage.deleteMessage(data);
        if (res.data.result) {
            router.push({ name: 'OneMessage' })
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
const addImage = async () => {
    try {
        isLoading.value = true;
        const formDataInfo = new FormData();
        for (const file of filesArray.value) {
            formDataInfo.append("file", file);
        }
        formDataInfo.append("filePath", 'msg');
        formDataInfo.append("useUniqueFileName", 0);
        formDataInfo.append("useDateFolder", 1);
        formDataInfo.append("thumbPath", '');
        formDataInfo.append("isProfile", 0);
        console.log('formdata', formDataInfo)
        const res = await oneMessage.addImage(formDataInfo);
        if (res.data.result) {
            console.log('ress', res)
            filesArray.value.push({
                m_type: res.data.fileType,
                file: res.data.filePath + res.data.fileName,
                thumb: res.data.fileThumb,
                file_name: res.data.fileName
            });

        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
onMounted(async () => {
    isLoading.value = true;
    await userStore.getUserDetails();
    await getMessageDetailData();
});
</script>