<template>
    <div class="main-wrap-feedback">
        <div class="feedback-main" style="padding: 0 0px;">
            
            <div class="feedback-sec shadow-background">
                <div class="head">
                    <h4>CP Name</h4>
                </div>
                <div class="f-body">
                    <select>
                        <option>Choice</option>
                        <option>Choice</option>
                        <option>Choice</option>
                        <option>Choice</option>
                    </select>
                </div>
            </div>
            <!-- Participant Information in Details HTML area  -->
            <div class="feedback-sec shadow-background">
                <div class="head">
                    <h4>Participant Information in Details</h4>
                </div>
                <div class="request-wrap">
                    <p>CP’s requests</p>
                    <ul>
                        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </li>
                        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </li>
                    </ul>
                </div>
            </div>
            <!-- Performance summary HTML area -->
            <div class="feedback-sec shadow-background">
                <div class="head">
                    <h4>Performance summary</h4>
                </div>
                <div class="performance-wrap martop16">
                    <div class="row">
                        <div class="col-md-6 col-sm-12">
                        <div class="feedback-pregress-wrap">
                            <div class="head">
                                <p>1. Fluency - Filler</p>
                            </div>
                            <div class="main-wrap">
                                <draggingprogresstwo/>
                            </div>
                        </div>
                        <div class="feedback-pregress-wrap martop24">
                            <div class="head">
                                <p>2. Vocabulary - Precision</p>
                            </div>
                            <div class="main-wrap">
                                <draggingprogresstwo/>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="feedback-pregress-wrap">
                            <div class="head">
                                <p>3. Grammar - Accuracy</p>
                            </div>
                            <div class="main-wrap">
                                <draggingprogresstwo/>
                            </div>
                        </div>
                        <div class="feedback-pregress-wrap martop24">
                            <div class="head">
                                <p>4. Pronuncation</p>
                            </div>
                            <div class="main-wrap">
                                <draggingprogresstwo/>
                            </div>
                        </div>
                    </div>
                    </div>
                    
                </div>
            </div>
            <!-- This Month's Feedback Focus Area HTML area -->
            <div class="feedback-sec shadow-background">
                <div class="head">
                    <h4>This Month's Feedback Focus Area</h4>
                </div>
                <div class="fillers-area">
                    <p>Fluency - Filler</p>
                </div>
            </div>

            <div class="divider-line"></div>

            <div class="feedback-sec ">
                <div class="head">
                    <h3>Today's Lesson</h3>
                </div>
                <div class="lesson-content-area">
                    <div class="sub-head">
                        <div class="text-heads">
                            <h5>To:</h5>
                            <h5>Hanbyul Kang</h5>
                        </div>
                        <div class="divided-btn">
                            <button type="button">Feedback File Upload</button>
                        </div>
                    </div>
                    <div class="object-upload-area">
                        <div class="objects-box">
                            <p class="nam">Week1_3days Middle level.mp3</p>
                            <div class="object-right">
                                <p>13mb</p>
                                <span><img src="@/assets/teacher/icons/trash.svg"></span>
                            </div>
                        </div>
                        <div class="objects-box">
                            <p class="nam">Week1_3days Middle level.mp3</p>
                            <div class="object-right">
                                <p>13mb</p>
                                <span><img src="@/assets/teacher/icons/trash.svg"></span>
                            </div>
                        </div>
                        <div class="objects-box">
                            <p class="nam">Week1_3days Middle level.mp3</p>
                            <div class="object-right">
                                <p>13mb</p>
                                <span><img src="@/assets/teacher/icons/trash.svg"></span>
                            </div>
                        </div>
                        <div class="objects-box">
                            <p class="nam">Week1_3days Middle level.mp3</p>
                            <div class="object-right">
                                <p>13mb</p>
                                <span><img src="@/assets/teacher/icons/trash.svg"></span>
                            </div>
                        </div>
                        <div class="objects-box">
                            <p class="nam">Week1_3days Middle level.mp3</p>
                            <div class="object-right">
                                <p>13mb</p>
                                <span><img src="@/assets/teacher/icons/trash.svg"></span>
                            </div>
                        </div>
                        <div class="objects-box">
                            <p class="nam">Week1_3days Middle level.mp3</p>
                            <div class="object-right">
                                <p>13mb</p>
                                <span><img src="@/assets/teacher/icons/trash.svg"></span>
                            </div>
                        </div>
                    </div>
                    <div class="head mr-tp-btn">
                        <h4>Book, U4 L1 Topic-based Discussions <p class="dn-arrow"><img class="pointer" src="@/assets/teacher/icons/caretright.svg"></p></h4>
                    </div>

                    <div class="book-record-area">
                        
                        <div class="adiuo-box-area">
                            <h3>Lesson Audio Play</h3>
                            <div class="audio-record-box">
                                <div class="dated">&nbsp;</div>
                                <div class="rcording-wrap">
                                    <div class="record">
                                        <img class="plys" src="/src/assets/teacher/icons/pause.svg">
                                        <img class="stop" src="/src/assets/teacher/icons/stop.svg">
                                        <div class="wrap">
                                            <span>01:34</span>
                                            <div class="progress">
                                                <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%;"></div>
                                            </div>
                                            <span>01:34</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        <div class="adiuo-box-area">
                            <h3>Class Record </h3>
                            <div class="audio-content-box rowtwos">
                                <div class="times">15:32</div>
                                
                                <div class="divided-btn">
                                    <input
                                        class="d-none"
                                        id="cameraInput"
                                        accept="video/*"
                                        type="file"
                                        capture="camera"
                                        @change="getFile($event)"
                                    />
                                    <button type="button" class="solid" @click="openRecordingType"><img src="@/assets/icons/microphone-wht.svg" >New Recording</button>
                                    <button type="button" class="saveBtn">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="head">
                        <h5>Your Suggestions, Feedback & Comments</h5>
                    </div>
                    <div >
                        here use text editor plugins
                        <div class="text-area">
                                        <RichTextEditor v-model="description" @setHtml="setHtml" />
                                    </div>
                    </div>

                </div>                
            </div>
            
            <!-- here added a button --delete button -->
            <div class="feedback-sec shadow-background">
                <div class="head delets">
                    <h5>&nbsp;</h5>
                    <button type="button"><img src="@/assets/icons/trash-red.svg"> Delete Lesson </button>
                </div>
                <div class="book-record-area"> 
                    <div class="adiuo-box-area mx-wdt">
                        <h3>Class Record </h3>
                        <div class="audio-content-box rowtwos">
                            <div class="times">15:32</div>
                            
                            <div class="divided-btn">
                                <button type="button" class="solid"><img src="@/assets/icons/microphone-wht.svg">New Recording</button>
                                <button type="button" class="saveBtn">Save</button>
                            </div>
                        </div>
                    </div>
                    <div class="adiuo-box-area">
                        <h3>Play Recorded Audio</h3>
                        <div class="audio-record-box">
                            <div class="dated">2023-06-15 14:05</div>
                            <div class="rcording-wrap">
                                <div class="record">
                                    <img class="plys" src="/src/assets/teacher/icons/pause.svg">
                                    <img class="stop" src="/src/assets/teacher/icons/stop.svg">
                                    <div class="wrap">
                                        <span>01:34</span>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%;"></div>
                                        </div>
                                        <span>01:34</span>
                                    </div>
                                    <img src="/src/assets/teacher/icons/soundmenu.svg">
                                </div>
                                <div class="option" style="display: none;">
                                    <ul>
                                        <li class="active">Save</li>
                                        <li>Delete</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                                
                <div class="record-text-wrap mrtop32">
                    <div class="head d-flex justify-content-between align-items-center">
                        <h5>Recorded Participant's Response</h5>
                        <div class="text d-flex justify-content-end align-items-center">
                            <div class="recorded-msg d-flex justify-content-end align-items-center">
                            <div class="sub d-flex align-items-center">
                                <span><small>110</small> Words </span>
                                <span>/</span>
                                <span><small>1</small> Minute</span>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="texteditor">
                        <!-- here use text editor plugins -->
                        <!-- <RichTextEditor></RichTextEditor> -->
                        <div class="text-area">
                            <RichTextEditor id="content_editor_rte3" v-model="description2"  />
                        </div>
                    </div>
                </div>

                <div class="record-text-wrap">
                    <div class="head wrapper">
                        <h5>Edited Participant's Response</h5>
                        <button type="button">Text to Speech <img src="@/assets/teacher/icons/speach.svg"></button>
                    </div>
                    <div class="texteditor">
                        <!-- here use text editor plugins -->
                        <div class="text-area">
                            <RichTextEditor id="content_editor_rte2" v-model="description1"  />
                        </div>
                    </div>
                </div>

                <div class="add">
                    <button type="submit"><img src="@/assets/teacher/icons/plusblue.svg"> Add Lesson </button>
                </div>
            </div>

            <div class="divider-line"></div>

            <div class="next-class">
                <h4>Active Learning Prep for Next Class</h4>
                <div class="setting-wrap">
                    <div class="setting">
                        <h4>Next Class Setting</h4>
                        <select>
                            <option>Topic-based Discussions Course</option>
                            <option>Topic-based Discussions Course</option>
                            <option>Topic-based Discussions Course</option>
                            <option>Topic-based Discussions Course</option>
                        </select>
                    </div>
                    <div class="setting">
                        <p>Speak Your Vocabulary & Expressions <a><img src="@/assets/teacher/icons/caretright.svg"></a></p>
                    </div>
                    <div class="setting">
                        <p>Passage Reading <a><img src="@/assets/teacher/icons/caretright.svg"></a></p>
                    </div>
                    <div class="setting">
                        <p>Watch the warm-up video <a><img src="@/assets/teacher/icons/caretright.svg"></a></p>
                    </div>
                </div>

                <div class="alp-wrap shadow-background" >
                    <h4>Feedback Focus Area Evaluation</h4>
                    
                    <!-- on click content show/hide area -->
                    <div style="display:none;">
                        <div class="feedback-sec responsive-shadow-none shadow-background">
                            <div class="head focus-head">
                                <h5>This Session’s Selected Feedback Focus Areas</h5>
                            </div>
                            <div class="focus-list martop32">
                                <ul>
                                    <li>1. Fluency - Filler</li>
                                    <li>2. Vocabulary - Precision</li>
                                    <li>3. Grammar - Accuracy</li>
                                    <li>4. Pronuncation</li>
                                </ul>
                                <div class="responsive-btn">
                                    <button type="button" class="edit">Setting</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="performance-summery martop32">
                            <div class="head">
                                <h4>Performance summary</h4>
                            </div>
                            <div class="row martop16">
                                <div class="col-md-6 col-sm-12">
                                    <div class="feedback-pregress-wrap responsive0">
                                        <div class="head">
                                            <p>1. Fluency - Filler</p>
                                        </div>
                                        <div class="main-wrap">
                                            <draggingprogresstwo/>
                                        </div>
                                    </div>
                                    <div class="feedback-pregress-wrap martop24">
                                        <div class="head">
                                            <p>2. Vocabulary - Precision</p>
                                        </div>
                                        <div class="main-wrap">
                                            <draggingprogresstwo/>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6 col-sm-12">
                                    <div class="feedback-pregress-wrap">
                                        <div class="head">
                                            <p>3. Grammar - Accuracy</p>
                                        </div>
                                        <div class="main-wrap">
                                            <draggingprogresstwo/>
                                        </div>
                                    </div>
                                    <div class="feedback-pregress-wrap martop24">
                                        <div class="head">
                                            <p>4. Pronuncation</p>
                                        </div>
                                        <div class="main-wrap">
                                            <draggingprogresstwo/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="up-arrow">
                        <button type="button"><img src="@/assets/teacher/icons/caretdown.svg"></button>
                    </div> 

                </div>


                <div class="alp-wrap shadow-background" >
                    <h4>Active Learning Prep Completion</h4>
                    <div class="alp">
                        <ul>
                            <li>
                                <div class="select-radio">
                                    <input type="radio" id="test10" name="radio-group" checked>
                                    <label for="test10">Completed</label>
                                </div>
                            </li>
                            <li>
                                <div class="select-radio">
                                    <input type="radio" id="test11" name="radio-group" checked>
                                    <label for="test11">Partially Completed</label>
                                </div>
                            </li>
                            <li>
                                <div class="select-radio">
                                    <input type="radio" id="test12" name="radio-group" checked>
                                    <label for="test12">Not attempted</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> 
            
            <div class="feedback-button-wrap">
                <div class="mainbuttons">
                    <button type="button" class="bordered">Save</button>
                    <button type="button" @click="openSubmitModal" class="solid">Submit</button>
                </div> 
            </div>

        </div>


        


        <FocusAreaModal
        v-if="displayFocusAreaModal"
        v-model="displayFocusAreaModal"
        @close="displayFocusAreaModal=false"
        
        />

        
       <ModalVue
         v-if="displaySubmitModal"
         :show="displaySubmitModal"
         mWidth="355px" 
          :defaultCloseBtn="false"
       >
         <template #body>
            <div class="savemodal">
         
         <div class="savemessage">
            <h3>Would you like to submit feedback?</h3>
             <p>Press Confirm to submit the feedback.</p>
         </div>
         <div class="button-wrap">
             <button type="button" @click="closeSubmitModal" class="bordered">Cancel</button>
             <button type="button">Save</button>
         </div>
     </div>
         </template>
       </ModalVue>

    </div>
    
</template>

<script setup>
import { ref } from "vue";
import classinfoOne from '@/components/classinfoOne.vue';
import draggingprogresstwo from '@/components/draggingprogresstwo.vue';
import RichTextEditor from "@/utilities/RichTextEditor.vue";
// import Audio from "@/components/common/Audio.vue";

const description = ref('')
const description1 = ref('')
const description2 = ref('')
const setHtml = (html) => {
    description.value = html;
};

import FocusAreaModal from '@/components/MyClass/TodaysClass/Feedback/SettingFeedbackModal.vue'


  const displayFocusAreaModal = ref(false);
  const displaySubmitModal = ref(false);



const openFocueAreaModal = () =>{
    displayFocusAreaModal.value=true;
}

const openSubmitModal = () =>{
    displaySubmitModal.value=true;
}

const closeSubmitModal = () =>{
    displaySubmitModal.value=false;
}
const openRecordingType = () => {
    console.log('ss')
    const camera = document.getElementById("cameraInput");
    camera.showPicker();
//   if (isMobileDevice() || checkIsFlutterInAppWebViewReady) {
//   } else {
//     displayCamera.value = true;
//   }
}
const getFile = (event) => {
    alert(JSON.stringify(event))
}

</script>

<!-- swiper slider continue sliding after last -->