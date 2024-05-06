<template>
    <div class="classinfo-card">
    <div class="info d-flex justify-content-between align-items-start">
        <div class="info-wrap ">
            <h4>Jungna</h4>
            <p><img src="@/assets/teacher/icons/phone.svg">010-6849-4956</p>
            <p><img src="@/assets/teacher/icons/envelop.svg">scenscen@intimesin.com</p>
        </div>
        <div class="right-icon">
            <a><img src="@/assets/teacher/icons/righticon.svg"></a>
        </div>
    </div>
    <div class="learning-state">
        <p>Learning State</p>
        <div class="progress-bar d-flex justify-content-between align-items-start">
            <progress id="file" max="100" value="10"> 10% </progress>
            <span>10%</span>
        </div>
    </div>
    <div class="attendance-wrap">
        <div class="wrap d-flex justify-content-between align-items-center">
            <p>Attendance</p>
            <span>September 7, 2023</span>
        </div>
        <div class="check-wrap">
            <img src="@/assets/teacher/icons/Checkboxred.svg">
            <p>Absent</p>
        </div>
        <div class="select-wrap d-flex justify-content-start align-items-center">
        <select>
            <option>Bussiness trip-abroad</option>
            <option>Bussiness trip-abroad</option>
            <option>Bussiness trip-abroad</option>
        </select>
        <!-- <button type="button">Save</button> -->
    </div>
    </div>
    
</div>
</template>