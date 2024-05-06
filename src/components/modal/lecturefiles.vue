<template>
    <div class="add-video-wrap">
        <div class="heading">
            <h4>Add Video</h4>
            <div class="close">
                <img src="@/assets/icons/close.svg">
            </div>
        </div>
        <div class="form-wrap lecture-wrap">
            <div class="inner-wrap">
                <div class="form">
                    <p>To</p>
                    <select>
                        <option>All</option>
                        <option>All</option>
                        <option>All</option>
                        <option>All</option>
                    </select>
                </div>
                <div class="form">
                    <p>Title</p>
                    <input type="text">
                </div>
                <div class="form">
                    <p>URL</p>
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
                <div class="form">
                    <p>Note</p>
                    <textarea></textarea>
                    <div class="delete">
                        <button type="button">
                            Delete
                            <img src="@/assets/icons/delete.svg">
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