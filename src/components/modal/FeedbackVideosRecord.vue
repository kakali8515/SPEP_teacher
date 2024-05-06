<template>
   
   <div class="feedback-record-videos">
       <div class="close">
           <img src="@/assets/icons/close.svg">
       </div>
       <div class="videos-record">
        <video controls >
            <source src="" type="video/mp4">
            <source src="movie.ogg" type="video/ogg">
            Your browser does not support the video tag.
        </video>
       </div>
       <div class="record-btn">
        <button class="recodbtn"><img src="@/assets/teacher/icons/video-camera.svg"></button>
        <button class="recodbtn red"><img src="@/assets/teacher/icons/video-camera-red.svg"></button>
        <button class="recodbtn"><img src="@/assets/teacher/icons/microphone-grey.svg"></button>
        <button class="recodbtn red"><img src="@/assets/teacher/icons/microphone-red.svg"></button>
        <button class="recodbtn"><img src="@/assets/teacher/icons/record.svg"></button>    
        <button class="recodbtn"><img src="@/assets/teacher/icons/record-red.svg"></button>
       </div>
   </div>

</template>