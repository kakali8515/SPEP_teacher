<template>
    <div class="main-wrap-feedback">
        <div class="feedback-main" style="padding: 0 100px;">
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
                    <!-- <div class="martop16">
                        <classinfoOne/>
                    </div> -->
                </div>
            </div>




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
            <!-- <div class="feedback-sec">
                <div class="head">
                    <h4>Setting Feedback Focus Areas <span>You can't edit for a month that's already in progress.</span></h4>
                </div>
                <div class="focus-area">
                    <swiper
                        :breakpoints="{ 300:{ slidesPerView:1 }, 767:{ slidesPerView:3, }, 1024:{ slidesPerView:4, }  }"
                        :modules="modules"
                        :slides-per-view="4"
                        :space-between="30"
                        navigation
                        :autoplay="true"
                        @swiper="onSwiper"
                        @slideChange="onSlideChange"
                    >
                        <swiper-slide>
                            <div class="mnth-box active">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="mnth-box">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="mnth-box">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>

                        <swiper-slide>
                            <div class="mnth-box">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="mnth-box">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="mnth-box">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>

                        <swiper-slide>
                            <div class="mnth-box">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="mnth-box">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="mnth-box">
                                <div class="box-header">
                                    <h4>MONTH 1</h4>
                                    <button type="button">Edit</button>
                                </div>
                                <div class="mnth-wrap">
                                    <ul>
                                        <li>1. Fluency</li>
                                        <li>2. Vocabulary</li>
                                        <li>3. Accuracy</li>
                                        <li>4. IMPACT & INFLUENCE</li>
                                    </ul>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>

                
            </div> -->
        
            <div class="feedback-sec responsive-shadow-none shadow-background">
                <div class="head focus-head">
                    <h4>Setting Feedback Focus Areas <span>You can't edit for a month that's already in progress.</span></h4>
                    <button type="button" @click="openFocueAreaModal" class="edit">Edit</button>
                </div>
                <div class="focus-list martop16">
                    <ul>
                        <li>1. Fluency - Filler</li>
                        <li>2. Vocabulary - Precision</li>
                        <li>3. Grammar - Accuracy</li>
                        <li>4. Pronuncation</li>
                    </ul>
                    <div class="responsive-btn">
                        <button type="button" class="edit">Edit</button>
                    </div>
                </div>
            </div>  

        </div>
        <FocusAreaModal
        v-if="displayFocusAreaModal"
        v-model="displayFocusAreaModal"
        @close="displayFocusAreaModal=false"
        
        />
        <div class="today-lesson-wrap">
            <div class="heading d-flex justify-content-between align-items-center pad30">
                <h2>Today's Lesson</h2>
                <div class="btnn d-flex justify-content-end align-items-center">
                    <button type="button" class="solid">Video Lessons</button>
                    <div class="divided-btn">
                        <button type="button">Feedback File Upload</button>
                        <button type="button">Feedback FileList</button>
                    </div>
                </div>
            </div>
            

            <div class="feedback-sec">
                <div class="feedback-sec responsive-shadow-none shadow-background">
                <div class="head focus-head">
                    <h4>This Session’s Selected Feedback Focus Areas</h4>
                    <button type="button" class="edit">Setting</button>
                </div>
                <div class="focus-list martop16">
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
                <div class="all-msg-wrap responsive-shadow-none shadow-background martop24">
                    <div class="head">
                        <h4>Book, U4 L1 Topic-based Discussions </h4>
                    </div>
                    <div class="all-wrap">
                        <div class="row responsivegap">
                            <div class="col-md-4 col-sm-12">
                                <div class="head">
                                    <h4>Lesson Audio Play</h4>
                                </div>
                                <div class="message-wrap martop16">
                                    <div class="rcording-wrap">
                                        <div class="record">
                                            
                                            <div class="wrap">
                                                <span>01:34</span>
                                                <div class="progress">
                                                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <span>01:34</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="button-wrapper martop24">
                                        <button type="button"><img src="@/assets/teacher/icons/play.svg">Play </button>
                                        <button type="button"><img src="@/assets/teacher/icons/pause.svg">Pause </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="head">
                                    <h4>Class Record </h4>
                                </div>
                                <div class="message-wrap martop16">
                                    <div class="record-timer">
                                        <p>00:00</p>
                                    </div>
                                    <div class="button-wrapper martop16">
                                        <button type="button" class="solid">Recording <img src="@/assets/teacher/icons/microphonewhite.svg"></button>
                                        <button type="button">Save </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="head">
                                    <h4>Play Recorded Audio</h4>
                                </div>
                                <div class="recorded-wrap martop16">
                                    <div class="date-time">
                                        <span>2023-06-15 14:05</span>
                                    </div>
                                    <div class="rcording-wrap">
                                        <div class="record">
                                            <img src="@/assets/teacher/icons/pause.svg">
                                            <img src="@/assets/teacher/icons/stop.svg">
                                            <div class="wrap">
                                                <span>01:34</span>
                                                <div class="progress">
                                                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <span>01:34</span>
                                            </div>
                                            <img src="@/assets/teacher/icons/soundmenu.svg">
                                        </div>
                                        <div class="option" style="display:none;">
                                            <ul>
                                                <li class="active">Save</li>
                                                <li>Delete</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                
                            </div>
                        </div>
                        </div>
                        </div>
                        <div class="all-msg-wrap responsive-shadow-none shadow-background martop24">
                            <div class="all-wrap allwrap2">
                                <div class="row">
                                    <div class="col-md-5 col-sm-12">
                                        <div>
                                            <div class="head">
                                                <h4>Class Record </h4>
                                            </div>
                                            <div class="message-wrap msg-record martop16">
                                                <div class="record-timer">
                                                    <p>00:00</p>
                                                </div>
                                                <div class="button-wrapper martop16">
                                                    <button type="button" class="solid">Recording <img src="@/assets/teacher/icons/microphonewhite.svg"></button>
                                                    <button type="button">Save </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-7 col-sm-12">
                                        <div class="responsive-design">
                                            <div class="head">
                                            <h4>Play Recorded Audio</h4>
                                            </div>
                                            <div class="recorded-wrap">
                                                <div class="date-time">
                                                    <span>2023-06-15 14:05</span>
                                                </div>
                                                <div class="rcording-wrap">
                                                    <div class="record">
                                                        <img src="@/assets/teacher/icons/pause.svg">
                                                        <img src="@/assets/teacher/icons/stop.svg">
                                                        <div class="wrap">
                                                            <span>01:34</span>
                                                            <div class="progress">
                                                            <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                            </div>
                                                            <span>01:34</span>
                                                        </div>
                                                        <img src="@/assets/teacher/icons/soundmenu.svg">
                                                    </div>
                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <div class="record-text-wrap">
                                <div class="head d-flex justify-content-between align-items-center">
                                    <h4>Recorded Participant's Response</h4>
                                    <div class="text d-flex justify-content-end align-items-center">
                                        <div class="recorded-msg d-flex justify-content-end align-items-center">
                                        <!-- <div class="sub d-flex align-items-center">
                                            <p>Play</p>
                                            <img src="@/assets/teacher/icons/play.svg">
                                        </div> -->
                                        <div class="sub d-flex align-items-center">
                                            <span><small>110</small> Words </span>
                                            <span>/</span>
                                            <span><small>1</small> Minute</span>
                                        </div>
                                        </div>
                                        <!-- <div class="sub pronounce d-flex align-items-center">
                                            <p>pronunciation accuracy: <span>75%</span></p>
                                        </div> -->
                                    </div>
                                </div>
                                <div class="text-area">
                                    <textarea placeholder="write text" value="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."></textarea>
                                </div>
                                </div>
                                <div class="record-text-wrap">
                                    <div class="head wrapper">
                                        <h4>Edited Participant's Response</h4>
                                        <button type="button">Text to Speech <img src="@/assets/teacher/icons/speach.svg"></button>
                                    </div>
                                    <div class="text-area recorded-text">
                                        <textarea placeholder="write text" value="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."></textarea>
                                    </div>
                                </div>
                                <div class="add">
                                    <button type="submit">
                                        <img src="@/assets/teacher/icons/plusblue.svg"> Add Lesson
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="all-msg-wrap responsive-shadow-none shadow-background martop24">
                            <div class="all-wrap allwrap2">
                                <div class="record-text-wrap next-text">
                                    <div class="head">
                                        <h4>Your Suggestions, Feedback & Comments</h4>
                                    </div>
                                    <div class="text-area">
                                        <RichTextEditor v-model="description" @setHtml="setHtml" />
                                    </div>
                                </div>
                            </div>

                    
                </div>
                    
                

            </div>
        </div>
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
        </div>
        
        <div class="evalution-wrap ">
           
            <div class="all-wrap shadow-background">
                <h4>Feedback Focus Area Evaluation</h4>
                <div class="allareawrap">
                    <div class="list-area">
                        <div class="head">
                            <h4>This Session’s Selected Feedback Focus Areas </h4>
                        </div>
                        <div class="focus-list martop30">
                            <ul>
                                <li>1. Fluency</li>
                                <li>2. Vocabulary</li>
                                <li>1. Accuracy</li>
                                <li>1. IMPACT & INFLUENCE</li>
                            </ul>
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



                <!-- <div class="selection-area">
                    <div class="row">
                        <div class="col-md-6 col-sm-12">
                            <div class="selection-wrap">
                                <p>1. Fluency</p>
                                <div class="table">
                                    <table class="table-responsive">
                                        <tbody>
                                            <tr>
                                                <td>Attention grabbing</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Storytelling</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Using Visual aids</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Conveying credibility & expertise</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Tone & Voice</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="selection-wrap">
                                <p>1. Fluency</p>
                                <div class="table">
                                    <table class="table-responsive">
                                        <tbody>
                                            <tr>
                                                <td>Attention grabbing</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Storytelling</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Using Visual aids</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Conveying credibility & expertise</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Tone & Voice</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="selection-wrap">
                                <p>3. Accuracy</p>
                                <div class="table">
                                    <table class="table-responsive">
                                        <tbody>
                                            <tr>
                                                <td>Attention grabbing</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Storytelling</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Using Visual aids</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Conveying credibility & expertise</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Tone & Voice</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="selection-wrap">
                                <p>4. IMPACT & INFLUENCE</p>
                                <div class="table">
                                    <table class="table-responsive">
                                        <tbody>
                                            <tr>
                                                <td>Attention grabbing</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Storytelling</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Using Visual aids</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Conveying credibility & expertise</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Tone & Voice</td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test1" name="radio-group" checked>
                                                    <label for="test1">5</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test2" name="radio-group" checked>
                                                    <label for="test2">4</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test3" name="radio-group" checked>
                                                    <label for="test3">3</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test4" name="radio-group" checked>
                                                    <label for="test4">2</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="select-radio">
                                                    <input type="radio" id="test5" name="radio-group" checked>
                                                    <label for="test5">1</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="up-arrow">
                    <button type="button"><img src="@/assets/teacher/icons/caretup.svg"></button>
                </div> -->
            </div>
        </div>
       
        <div class="alp-wrap shadow-background">
            <h4>ALP Completion</h4>
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

        <div class="feedback-button-wrap">
            <div class="mainbuttons">
                <button type="button" class="bordered">Save</button>
                <button type="button" @click="openSubmitModal" class="solid">Submit</button>
            </div> 
        </div>

        
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
const description = ref('')
const setHtml = (html) => {
    description.value = html;
};

import FocusAreaModal from '@/components/MyClass/TodaysClass/Feedback/SettingFeedbackModal.vue'
  // Import Swiper Vue.js components

//   import { Swiper, SwiperSlide } from 'swiper/vue';
//     import { Navigation, Autoplay} from 'swiper/modules';
  // Import Swiper styles
  import 'swiper/css';
  import 'swiper/css/navigation';


  const displayFocusAreaModal = ref(false);
  const displaySubmitModal = ref(false);
//   export default {
//     components: {
//       Swiper,
//       SwiperSlide,
//       classinfoOne,
//       draggingprogresstwo,
//     },
//     setup() {
//       const onSwiper = (swiper) => {
//         console.log(swiper);
//       };
//       const onSlideChange = () => {
//         console.log('slide change');
//       };
//       return {
//         onSwiper,
//         onSlideChange,
//         modules: [Navigation, Autoplay],

        
//       };
//     },
//   };


const openFocueAreaModal = () =>{
    displayFocusAreaModal.value=true;
}

const openSubmitModal = () =>{
    displaySubmitModal.value=true;
}

const closeSubmitModal = () =>{
    displaySubmitModal.value=false;
}

</script>

<!-- swiper slider continue sliding after last -->