<template>
    <ModalVue v-if="modelValue" :show="modelValue" mWidth="670px" :is-loading="loaderState"
        @close="$emit('update:modelValue', false)">
        <template #body>
            <div class="modal-wrap see-detail-wrap">
                <!-- <div class="modalclose">
                    <img src="@/assets/teacher/icons/modalclose.svg">
                </div> -->
                <div class="mainheading">
                    <img :class="index!=0 ? 'pointer' : ''" @click="previousStudentAttendance" src="@/assets/icons/b-arrow2.svg" style="transform: rotate(180deg);">
                    <h4>{{ student_info.user_name }}</h4>
                    <img :class="studentInfo.length != (index + 1) ? 'pointer' :''" @click="nextStudentAttendance" src="@/assets/icons/b-arrow2.svg">
                </div>
                <div class="sec-wrap">
                    <h4>Session Average</h4>
                    <div class="graph-wrap">
                        <!-- <div class="graph">
                            <img src="@/assets/teacher/images/Ring.svg">
                            <div class="title">
                                <p>Overall average</p>
                                <h5>40%</h5>
                            </div>
                        </div> -->
                        <div id="chart">
                            <apexchart type="radialBar" :options="chartOptions" :series="overallAverage"></apexchart>
                        </div>
                        <div class="progress-wrapper">
                            <h4>Today's Learning Rate</h4>
                            <div class="progress-bar">
                                <progress id="file" max="100" :value="learning_rate"> {{ learning_rate }}% </progress>
                                <span>{{ learning_rate }}%</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="feedback-wrap">
                    <h4> Feedback Score</h4>
                    <div class="sign" v-if="scoreList.length">
                        <ul>
                            <li><img src="@/assets/teacher/icons/blue.svg"> CP Session Average</li>
                            <li><img src="@/assets/teacher/icons/black.svg"> Other CP Average</li>
                        </ul>
                        <div class="focuslist-wrap">
                            <div class="row gap8">
                                <div class="col-md-6 col-sm-12 " v-for="score in scoreList">
                                    <div class="list">
                                        <div class="drag-progress">

                                            <draggingprogress :score="score" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <NoDataFoundVue v-if="!scoreList.length" />
                </div>
            </div>
        </template>
    </ModalVue>
</template>

<script setup>
import draggingprogress from "@/components/MyClass/ClassDetails/ClassDetailsAttendance/draggingprogress.vue";
import { ref, onMounted, reactive } from "vue";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
const classDetailsService = new ClassDetails();
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    studentInfo: {
        type: Array,
    },
    course_seq: {
        type: String,
    },
    schedule_seq: {
        type: String,
    }
});
const emits = defineEmits(['update:modelValue']);
const loaderState = ref(false);
const overallAverage = ref([]);
const learning_rate = ref(0);
const index = ref(0);
const student_id = ref(props.studentInfo[index.value].user_id);
const student_info = ref(props.studentInfo[index.value]);
const scoreList = ref([]);
const chartOptions = {
    chart: {
        type: 'radialBar',
        height: 350,
    },
    plotOptions: {
        radialBar: {
            startAngle: -90,
            endAngle: 90,
            hollow: {
                margin: 0,
                size: "60%",
            },
            track: {
                //   background: "#fff",
                strokeWidth: '100%',
                margin: 5, // margin is in pixels
                //   dropShadow: {
                //     enabled: true,
                //     top: 2,
                //     left: 0,
                //     color: '#fff',
                //     opacity: 1,
                //     blur: 0
                //   }
            },
            dataLabels: {
                name: {
                    offsetY: -10,
                    show: true,
                    color: "#84919A",
                    fontSize: "10px"
                },
                value: {
                    offsetY: -2,
                    fontSize: '20px',
                    color: '#181818'
                }
            }
        }
    },
    grid: {
        padding: {
            top: -10
        }
    },
    fill: {
        type: 'solid',
        gradient: {
            shade: 'light',
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
        },
    },
    labels: ['Overall Average'],
    colors: ['#0C60C2'],
};

const nextStudentAttendance = async () => {
    if (props.studentInfo.length != (index.value + 1)) {
        index.value++;
        student_id.value = props.studentInfo[index.value].user_id;
        student_info.value = props.studentInfo[index.value];
        await seeDetailsAverage();
        await seeDetailsLearningRate();
        await seeDetailsScore();
    }
}

const previousStudentAttendance = async () => {
    if (index.value != 0) {
        index.value--;
        student_id.value = props.studentInfo[index.value].user_id;
        student_info.value = props.studentInfo[index.value];
        await seeDetailsAverage();
        await seeDetailsLearningRate();
        await seeDetailsScore();
    }
}
const seeDetailsAverage = async () => {
    const obj = {
        "student_id": student_id.value,
        "course_seq": props.course_seq,
    }
    loaderState.value = true;
    try {
        const res = await classDetailsService.seeDetailsAverage(obj);
        if (!res.data.score) throw new Error("Something wrong");
        overallAverage.value = res.data.score[0].average_session ? [Math.round(res.data.score[0].average_session)] : [0];
    } catch (error) {
        console.log(error);
    } finally {
        loaderState.value = false;
    }
}

const seeDetailsLearningRate = async () => {
    const obj = {
        "student_id": student_id.value,
        "course_seq": props.course_seq,
    }
    loaderState.value = true;
    try {
        const res = await classDetailsService.seeDetailsLearningRate(obj);
        if (!res.data.score) throw new Error("Something wrong");
        learning_rate.value = res.data.score[0].learning_state ? Math.round(res.data.score[0].learning_state) : 0;
    } catch (error) {
        console.log(error);
    } finally {
        loaderState.value = false;
    }
}

const seeDetailsScore = async () => {
    const obj = {
        "student_id": student_id.value,
        "schedule_seq": props.schedule_seq,
    }
    // const obj = {
    //     "student_id": "km999109",
    //     "schedule_seq": "835230",
    // }
    loaderState.value = true;
    try {
        const res = await classDetailsService.seeDetailsScore(obj);
        if (!res.data.score) throw new Error("Something wrong");
        scoreList.value = res.data.score;
    } catch (error) {
        console.log(error);
    } finally {
        loaderState.value = false;
    }
}


onMounted(async () => {
    await seeDetailsAverage();
    await seeDetailsLearningRate();
    await seeDetailsScore();
})

</script>