<template>
    <div class="add-video-wrap">
        <div class="heading">
            <h4>Add Video</h4>
            <div class="close">
                <img src="@/assets/icons/close.svg">
            </div>
        </div>
        <div class="form-wrap">
        <div class="form">
            <p>Course</p>
            <select>
                <option>E.S.P.</option>
                <option>E.S.P.</option>
                <option>E.S.P.</option>
                <option>E.S.P.</option>
            </select>
        </div>
        <div class="form">
            <p>Subject</p>
            <select>
                <option>S.P.A. Prep Course [Lv.1 ~ 5]</option>
                <option>S.P.A. Prep Course [Lv.1 ~ 5]</option>
                <option>S.P.A. Prep Course [Lv.1 ~ 5]</option>
                <option>S.P.A. Prep Course [Lv.1 ~ 5]</option>
            </select>
        </div>
        <div class="form">
            <p>Subcategory</p>
            <select>
                <option>Grammar</option>
                <option>Grammar</option>
                <option>Grammar</option>
                <option>Grammar</option>
            </select>
        </div>
        <div class="form">
            <p>Subcategory</p>
            <input type="text">
        </div>
        <div class="form">
            <p>FIle Upload</p>
            <div class="upload-box">
                <div class="upload-btn">
                    <div class="btn-wrap">
                        <img src="@/assets/icons/upload.svg">
                        <span>Please upload the file.</span>
                    </div>
                    <div class="plus">
                        <img src="@/assets/icons/plus-button.svg">
                    </div>
                </div>
                <input type="file">
            </div>
            <div class="uploaded-file">
                <div class="file">
                    <img src="@/assets/icons/File.svg">
                    <div class="file-name">
                        <p>File1111.mov</p>
                        <span>File1111.mov</span>
                    </div>
                </div>
                <div class="close-wrap">
                    <button type="button">
                        <img src="@/assets/icons/fileclose.svg">
                    </button>
                </div>
            </div>
        </div>
        <div class="btn-wrap">
            <button type="button">Save</button>
        </div>
    </div>
    </div>
</template>