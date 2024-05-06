<template>
    <div class="main-wrap-feedback">
        <div class="feedback-main" style="padding: 0 0px;">
            <div class="feedback-sec shadow-background">
                <div class="head">
                    <h4>Participant Name</h4>
                </div>
                <div class="f-body">
                    <select v-model="state.cp_id" @change="onCpSelection">
                        <!-- <option value="">sdf</option> -->
                        <option v-for="item in data.cp_list" :key="item.user_id" :value="item.user_id">
                            {{ item.user_name_en }}
                        </option>
                    </select>
                </div>
            </div>
            <!-- Participant Information in Details HTML area  -->
            <FeedbackParticipantInfo :data="data.participant_info" />
            <!-- Performance summary HTML area -->
            <FeedbackPerformanceSummary :data="data.performance_summary" :updatedDate="state.updated_focus_area_date"
                :cp-name="data.participant_info?.user_name_en" :isSubmitted="state.is_submitted"
                :isDataEntryNotAllow="state.is_selected_unit_not_supported"
                @open-focue-area-modal="onOpenFocueAreaModal" />
            <!-- This Month's Feedback Focus Area HTML area -->


            <div class="divider-line"></div>
            <!-- Today's Lesson  -->
            <FeedbackTodaysLesson v-if="data.qm_data !== null" :cp-name="data.participant_info?.user_name_en"
                :unit-list="data.todays_class_unit_list" v-model:selectedUnit="state.selected_todays_class_unit"
                :feedback-file="data.feedback_file" :selectedSate="state" v-model:qmData="data.qm_data"
                :lessonAudio="data.lesson_audio" :error="state.isError" :isSubmitted="state.is_submitted"
                :isDataEntryNotAllow="state.is_selected_unit_not_supported" @setClassUnit="onSetClassUnit"
                @call-details="onGetFeedbackDetails" />

            <!-- Feedback Response -->
            <FeedbackResponse v-for="(item, idx) in data.feedback_lesson" :key="item"
                v-model:data="data.feedback_lesson[idx]" :id="idx" :is-single="data.feedback_lesson.length === 1"
                :lessonAudio="data.lesson_audio" @on-delete="onDeleteSingleLesson" />
            <div class="feedback-sec shadow-background nopad">
                <div class="add">
                    <button type="submit" @click="onAddResponse" :class="{ 'disable-event': state.is_submitted }"><img
                            src="@/assets/teacher/icons/plusblue.svg"> Add
                        Response</button>
                </div>
            </div>

            <div class="divider-line"></div>
            <!-- Active Learning Prep for Next Class -->
            <div class="next-class">
                <h4>Active Learning Prep for Next Class</h4>
                <div class="setting-wrap">
                    <!-- Next Class Setting Selection -->
                    <div class="setting">
                        <h4>Next Class Setting</h4>
                        <div class="d-flex">
                            <select v-model="state.selected_next_class_unit">
                                <option v-for="item in data.unit_list" :key="item.unit_seq" :value="item.unit_seq">
                                    {{ item.title }}
                                </option>
                            </select>
                            <ButtonVue class="mx-2 px-4 btn btn-primary" v-if="!state.is_next_class_unit_present"
                                @click="onSubmitNextClassUnit">Save</ButtonVue>
                        </div>
                    </div>
                    <!-- Activity List -->
                    <div class="setting">
                        <p>Activity 1<a><img src="@/assets/teacher/icons/caretright.svg"></a></p>
                    </div>
                    <div class="setting">
                        <p>Activity 2 <a><img src="@/assets/teacher/icons/caretright.svg"></a></p>
                    </div>
                    <div class="setting">
                        <p>Activity 3<a><img src="@/assets/teacher/icons/caretright.svg"></a></p>
                    </div>
                </div>

                <div class="alp-wrap shadow-background">
                    <h4>Feedback Focus Area Evaluation</h4>
                    <!-- on click content show/hide area -->
                    <Transition name="hideshow">
                        <FeedbackNextClassFocusAreaEvaluation
                            v-model:performance-summary="data.performance_summary_c_month"
                            :currentFocusArea="data.performance_summary.current_list" :alp="data.alp_data"
                            v-if="displayFeedbackFocusArea" />
                    </Transition>
                    <div class="up-arrow" :class="{ 'b-p-none': displayFeedbackFocusArea }">
                        <button type="button" @click="displayFeedbackFocusArea = !displayFeedbackFocusArea">
                            <img src="@/assets/teacher/icons/caretdown.svg"
                                :class="{ 'rotate-180': displayFeedbackFocusArea }">
                        </button>
                    </div>

                </div>

            </div>
            <!-- Feedback Submission Buttons -->
            <div class="feedback-button-wrap">
                <div class="mainbuttons">
                    <button type="button" class="bordered" @click="onSave"
                        :class="{ 'disable-event': state.is_submitted || state.is_selected_unit_not_supported }">Save</button>
                    <ButtonVue @click="onSubmitMiddleware" class="solid"
                        :disabled="state.is_submitted || state.is_selected_unit_not_supported">Submit
                    </ButtonVue>
                </div>
            </div>
        </div>
    </div>
    <!-- Focus Area Selection Modal-->
    <FocusAreaModal v-if="state.displayFocusAreaModal" v-model="state.displayFocusAreaModal" :cpId="state.cp_id"
        :unit-seq="state.selected_todays_class_unit" @close="onClosingDisplayFocusArea" />
    <!-- Save Confirmation Modal-->
    <ConfirmModalVue :visible="state.displaySaveConfirmationModal" title="It has been saved temporarily."
        primaryButtonText="Confirm" @on-confirm="onCloseConfirmation" />
    <!-- Submit Confirmation Modal-->
    <ConfirmModalVue :visible="state.displaySubmitConfirmationModal" primaryButtonText="Confirm"
        @on-confirm="onCloseConfirmation">
        <h3>Feedback submitted succefully for <br /> {{ data.participant_info?.user_name_en }}.</h3>
    </ConfirmModalVue>
    <!-- Submit Verification Modal-->
    <ConfirmModalVue :visible="state.display_submit_verification" title="Would you like to submit feedback?"
        description="Press Confirm to submit the feedback." primaryButtonText="Confirm" secondaryButtonText="Cancel"
        light-color-button="2" @on-confirm="onSubmitConfirm" @on-cancel="state.display_submit_verification = false"
        :isLoading="isLoading" />

    <!-- Warning Info Modal -->
    <ConfirmModalVue :visible="state.display_info_modal.value" :title="state.display_info_modal.text"
        primaryButtonText="Confirm" button-loader-for="2" @on-confirm="state.display_info_modal.value = false" />
    <!-- Mandatory Unit Selection -->
    <ModalVue v-if="state.display_set_unit_modal" :show="state.display_set_unit_modal"
        @close="state.display_set_unit_modal = false" :defaultCloseBtn="false" mWidth="670px" :closable="false">
        <template #body>
            <div class="feedback-unit-wrap">
                <div class="form-wrap">
                    <h5>Select unit, to proceed further</h5><br>
                    <div class="form">
                        <select @change="onSelectUnitForCp($event.target.value)" @click="onSelectBox">
                            <option :value="null" disabled selected>Select</option>
                            <option v-for="item in getUnitListData" :key="item.unit_seq" :value="item.unit_seq">
                                {{ item.title }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="feedback-unit-wrap pt-5">
                <div class="btn-wrap" style="gap: 10px; justify-content: end">

                    <ButtonVue @click="onBack" style="background-color: grey; width: 90px">Back
                    </ButtonVue>
                    <ButtonVue @click="onUpdateUnitForCurrentSchedule" :disabled="!state.selected_current_class_unit"
                        style="width: 90px">Save
                    </ButtonVue>
                </div>
            </div>
        </template>
    </ModalVue>


    <!-- Next class not available Modal-->
    <ConfirmModalVue :visible="state.isSubmitNextClassAvailable" title="Next class not available"
        primaryButtonText="Confirm" @on-confirm="state.isSubmitNextClassAvailable = false;" />

    <!-- Loader -->
    <LoaderVue :loading="isLoading" />
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { isEmpty } from "lodash";
import FeedbackResponse from "@/components/MyClass/TodaysClass/Feedback/FeedbackResponse.vue";
import FeedbackPerformanceSummary from "@/components/MyClass/TodaysClass/Feedback/FeedbackPerformanceSummary.vue";
import FeedbackNextClassFocusAreaEvaluation from "@/components/MyClass/TodaysClass/Feedback/FeedbackNextClassFocusAreaEvaluation.vue";
import FeedbackParticipantInfo from "@/components/MyClass/TodaysClass/Feedback/FeedbackParticipantInfo.vue";
import { useUserData } from "@/stores/useUserDataCopy";
import FeedbackTodaysLesson from "@/components/MyClass/TodaysClass/Feedback/FeedbackTodaysLesson.vue";
import { Feedback } from "@/services/MyClass/Feedback";
import FocusAreaModal from '@/components/MyClass/TodaysClass/Feedback/SettingFeedbackModal.vue'
import { useRoute, useRouter } from "vue-router";
import { validate } from "@/validations/MyClass/Feedback";
const store = useUserData();
const feedback = new Feedback();
const displayFeedbackFocusArea = ref(false)
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const state = reactive({
    cp_id: null,
    user_id: null,
    selected_next_class_unit: null,
    selected_todays_class_unit: null,
    prev_selected_todays_class_unit: null,
    is_selected_unit_not_supported: false,
    is_next_class_unit_present: false,
    updated_focus_area_date: '',
    is_saved: false,
    displayFocusAreaModal: false,
    displaySaveConfirmationModal: false,
    displaySubmitConfirmationModal: false,
    display_info_modal: { text: '', value: false },
    display_submit_verification: false,
    isError: false,
    is_submitted: false,
    display_set_unit_modal: false,
    selected_current_class_unit: null,
    isSubmitNextClassAvailable : false
})
const data = reactive({
    cp_list: [],
    participant_info: null,
    performance_summary: { all_list: [], current_list: [] },
    unit_list: [],
    todays_class_unit_list: [],
    feedback_lesson: [
        {
            fuf_seq: "",
            file_name: "",
            response: "",
            file_path: "",
            file_size: "",
            file_type: "",
            stt: "",
        }
    ],
    feedback_file: [],
    performance_summary_c_month: [],
    qm_data: null,
    lesson_audio: null,
    alp_data: null,
    user_feedback_submission: null
})
const addQmData = () => {
    data.qm_data = {
        fuf_seq: "",
        file_name: "",
        response: "",
        file_path: "",
        file_size: "",
        file_type: ""
    }
}
const onAddResponse = () => {
    data.feedback_lesson.push({
        fuf_seq: "",
        file_name: "",
        response: "",
        file_path: "",
        file_size: "",
        file_type: "",
        stt: ""
    })
}
const getUnitListData = computed(() => data.unit_list)
const onOpenFocueAreaModal = () => {
    state.displayFocusAreaModal = true;
}
const onDeleteSingleLesson = (_data, idx) => {
    data.feedback_lesson.splice(idx, 1)
}
const onSetClassUnit = (_data) => {
    state.selected_todays_class_unit = _data;
    state.is_selected_unit_not_supported = state.prev_selected_todays_class_unit?.unit_seq !== state.selected_todays_class_unit?.unit_seq
    onGetFeedbackDetails('mount');
};
const onClosingDisplayFocusArea = async (_api_call) => {
    state.displayFocusAreaModal = false;
    if (!_api_call) return;
    await onGetParticipantSummary();
    await onGetFeedbackDetails('mount');
}
const onCpSelection = async () => {
    const res = await onCheckFeedbackFeasibility();
    if (!res) {
        onGetFeedbackDetailsForSelectedCp();
    }
}
const onGetFeedbackDetailsForSelectedCp = async (_type) => {
    isLoading.value = true;
    if (!state.user_id) {
        await store.getUserDetails();
        state.user_id = store.getUserData.id;
    }
    if (!state.cp_id) {
        await onGetCPList();
        state.cp_id = data.cp_list[0]?.user_id;
    }
    onGetNextClassUnitList();
    onGetParticipantInfo();
    if (_type !== 'unit') {
        onCheckFeedbackFeasibility();
    }
    onGetParticipantSummary();
    await onGetTodaysClassUnitList();
    onGetFeedbackDetails('mount');
    isLoading.value = false;
}
const onCloseConfirmation = async () => {
    state.displaySaveConfirmationModal = false;
    state.displaySubmitConfirmationModal = false;
    await onGetFeedbackDetails('mount');
}
// Error Handling
const checkError = () => {
    let checkData = {
        response: data.qm_data.response,
    };
    const { isInvalid, error } = validate(checkData);
    if (isInvalid) {
        state.isError = true;
        state.display_info_modal.value = true;
        state.display_info_modal.text = "Please enter your feedback for today's lesson";

        return true;
    } else {
        state.isError = false;
        return false;
    }
};
// API CALL
const onCheckFeedbackFeasibility = async () => {
    let obj = {
        schedule_seq: route.params.schedule_seq,
        cp_id: state.cp_id
    };
    try {
        isLoading.value = true;
        const res = await feedback.checkFeedbackFeasibility(obj);
        if (!res.data.unit_seq) {
            state.display_set_unit_modal = true;
        }
        return state.display_set_unit_modal;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
const onGetFeedbackDetails = async (_type) => {
    if (!state.selected_todays_class_unit?.unit_seq) return;
    let obj = {
        schedule_seq: route.params.schedule_seq,
        class_seq: route.params.class_seq,
        user_id: state.cp_id,
        unit_seq: state.selected_todays_class_unit?.unit_seq
    };
    try {
        isLoading.value = true;
        const { data: res } = await feedback.getFeedbackDetails(obj);
        if (!res?.success) {
            addQmData();
            return;
        }
        const isMount = _type === 'mount'
        if (_type === 'feedback-file' || isMount) {
            data.feedback_file = res.feedback_file;
        }
        if (isMount || _type === 'next-class-unit') {
            state.is_next_class_unit_present = !isEmpty(res.next_class_selected_unit);
            state.selected_next_class_unit = res.next_class_selected_unit?.unit_seq;
        }
        if (!isMount) return;
        state.is_submitted = isEmpty(res.feedback_submission_status) || res.feedback_submission_status?.status && res.feedback_submission_status?.status === 'false' ? false : true;
        if (res.focus_areas_evaluation.length) {
            res.focus_areas_evaluation.forEach((item) => item.score = item.score * 20);
            data.performance_summary_c_month = res.focus_areas_evaluation
        } else {
            data.performance_summary.current_list.forEach((item) => {
                item.score = 0;
            });
            data.performance_summary_c_month = data.performance_summary.current_list
        }
        if (res.feedback_responses.length) {
            data.feedback_lesson = res.feedback_responses;
            data.feedback_lesson.map((item) => { 
                item.response = item.response ? item.response : "";
                item.stt = item.stt == null ? "" : item.stt;
                 return item;
             })
        }
        data.lesson_audio = res.lesson_audio
        if (res.listening_response_unit_wise.length) {
            data.qm_data = res.listening_response_unit_wise[0]
        } else {
            addQmData();
        }
        data.alp_data = !isEmpty(res.alp_completion_status) ? res.alp_completion_status : null;
        data.user_feedback_submission = res.user_feedback_submission;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
const onGetCPList = async () => {
    let obj = {
        class_seq: route.params.class_seq,
    };
    try {
        // isLoading.value = true;
        const res = await feedback.getCPList(obj);
        if (res.data?.success) {
            data.cp_list = res.data.list;
        }
    } catch (error) {
        console.log(error);
    } finally {
        // isLoading.value = false;
    }
};
const onGetParticipantSummary = async () => {
    let obj = {
        class_seq: route.params.class_seq,
        cp_id: state.cp_id
    };
    try {
        // isLoading.value = true;
        const { data: res } = await feedback.getParticipantSummary(obj);
        if (res?.success) {
            data.performance_summary.all_list = res.list;
            data.performance_summary.current_list = res.currFocusAreas;
            if (res.currFocusAreas.length) {
                state.updated_focus_area_date = res.currFocusAreas[0]?.created_at
            } else {
                state.updated_focus_area_date = '';
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        // isLoading.value = false;
    }
};
const onGetParticipantInfo = async () => {
    let obj = {
        class_seq: route.params.class_seq,
        course_period_seq: route.params.course_seq
    };
    try {
        // isLoading.value = true;
        const res = await feedback.getParticipantInfo(obj);
        data.participant_info = res.data;
    } catch (error) {
        console.log(error);
    } finally {
        // isLoading.value = false;
    }
};
const onGetNextClassUnitList = async () => {
    let obj = {
        class_seq: route.params.class_seq,
        cp_id: state.cp_id
    };
    try {
        // isLoading.value = true;
        const res = await feedback.getNextClassUnitList(obj);
        if (res.data?.success) {
            data.unit_list = res.data.list;
        }
    } catch (error) {
        console.log(error);
    } finally {
        // isLoading.value = false;
    }
};
const onGetTodaysClassUnitList = async () => {
    let obj = {
        class_seq: route.params.class_seq,
        schedule_seq: route.params.schedule_seq,
        cp_id: state.cp_id,
    };
    try {
        // isLoading.value = true;
        const res = await feedback.getTodaysClassUnitList(obj);
        if (res.data?.success) {
            data.todays_class_unit_list = res.data.list;
            const obj = data.todays_class_unit_list.find((item) => item.r_order === "Y" && item.schedule_seq == route.params.schedule_seq)
            state.selected_todays_class_unit = obj
            state.prev_selected_todays_class_unit = obj
        }
    } catch (error) {
        console.log(error);
    } finally {
        // isLoading.value = false;
    }
};
const onSubmitNextClassUnit = async () => {
    let obj = {
        class_seq: route.params.class_seq,
        schedule_seq: route.params.schedule_seq,
        unit_seq: state.selected_next_class_unit, // required
        user_id: state.cp_id // required
    };
    try {
        // isLoading.value = true;
        const res = await feedback.submitSelectedNextClassUnit(obj);
        if (res.data?.success) {
            await onGetFeedbackDetails('next-class-unit')
        } else {
            state.isSubmitNextClassAvailable = true;
        }
    } catch (error) {
        console.log(error);
    } finally {
        // isLoading.value = false;
    }
}
const onSave = async () => {
    if (checkError()) {
        return;
    }
    const ev_data = data.performance_summary_c_month.map((item) => {
        return {
            fufa_seq: item.fufa_seq ?? '',
            score: item.score / 20,
            exi_member_seq: item.exi_member_seq,
            category_seq: item.category_seq,
            sub_category_seq: item.sub_category_seq
        }
    })
    const obj = {
        "unit_seq": state.selected_todays_class_unit?.unit_seq,
        "class_seq": route.params.class_seq,
        "user_id": state.cp_id,
        "schedule_seq": route.params.schedule_seq,
        "qm_data": data.qm_data,
        "fb_data": data.feedback_lesson,
        "evaluation_data": ev_data,
        ...(data.alp_data ? { 'alp_status': data.alp_data.alp_status } : {}),
    }
    try {
        isLoading.value = true;
        const res = await feedback.addUpdateFeedback(obj);
        if (res.data.success) {
            state.displaySaveConfirmationModal = true;
            state.is_saved = true;
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
const onUpdateUnitForCurrentSchedule = async () => {
    const obj = {
        "class_seq": route.params.class_seq,
        "cp_id": state.cp_id,
        "schedule_seq": route.params.schedule_seq,
        "unit_seq": state.selected_current_class_unit
    }
    try {
        isLoading.value = true;
        const res = await feedback.submitFeedbackFeasibility(obj);
        if (res.data.success) {
            state.display_set_unit_modal = false;
            onGetFeedbackDetailsForSelectedCp('unit');
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
const onSubmitMiddleware = () => {
    if (!state.is_saved) {
        state.display_info_modal.value = true;
        state.display_info_modal.text = 'Please save the data before submission.';
        return;
    } 
    //else if (!state.is_next_class_unit_present) {
     //   state.display_info_modal.value = true;
    //    state.display_info_modal.text = 'Please save the next class unit before submission';
    //    return;
    //}
    state.display_submit_verification = true;
}
const onSubmitConfirm = async () => {
    const fileSeq = data.feedback_lesson.map((item) => { return { fuf_seq: item.fuf_seq } })
    if (data.qm_data.fuf_seq) {
        fileSeq.push({ fuf_seq: data.qm_data.fuf_seq })
    }
    const focusAreas = data.performance_summary_c_month.map(item => { return { fufa_seq: item.fufa_seq } })
    const obj = {
        "cmur_seq": data.user_feedback_submission?.cmur_seq,
        "focus_areas": focusAreas,
        "user_files": fileSeq,
    }
    try {
        isLoading.value = true;
        const res = await feedback.submitFeedback(obj);
        if (res.data.success) {
            state.display_submit_verification = false;
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
const onSelectBox = () => {
    console.log('open')
}
const onBack = () => {
    state.display_set_unit_modal = false;
    router.go(-1)
}
const onSelectUnitForCp = (_val) => {
    state.selected_current_class_unit = _val
}
// ===== LIFECYCLE ====
onMounted(() => {
    onGetFeedbackDetailsForSelectedCp();
})  
</script>

<style lang="scss">
.rotate-180 {
    transform: rotate(180deg);
}

.b-p-none {
    border: none !important;
    padding: 0px !important;
}

.hideshow-enter-active,
.hideshow-leave-active {
    transition: all 0.2s ease-in-out;
}

/* delay leave of parent element */
.hideshow-leave-active {
    transition-delay: 0.25s;
}

.hideshow-enter-from,
.hideshow-leave-to {
    transform: translateY(30px);
    opacity: 0.001;
}
</style>
