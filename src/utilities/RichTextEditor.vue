<template>
    <div :id="id"></div>
</template>

<script>
import { toRefs, ref, onMounted, onUpdated, watch, computed } from 'vue';
import { API_BASE_URL, API_KEY } from '@/services/Base.js';
import { Token } from '@/services/Token';
export default {
    props: {
        modelValue: { type: String, default: '', require: false },
        setContent: { type: String, default: '', require: false },
        id: {
        type: String,
        default:'content_editor_rte'
        }
    },
    setup(props, { emit }) {
        const editorData = ref();
        const { modelValue, setContent, id } = toRefs(props);
        const editor = ref();
        const extractImageFileUrl = (htmlAsString) => {
            const urls = [];
            const regex = /<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/g;
            let url;
            while ((url = regex.exec(htmlAsString))) {
                const fileUrl = url[1];
                if (fileUrl.startsWith('http')) urls.push(url[1]);
            }
            return urls;
        };

        function cancelUpload() {
            var docs = new DOMParser().parseFromString(editor.value.getHTMLCode(), 'text/html');
            // Get all the img elements in the document
            const imgs = docs.getElementsByTagName('img');
            // Loop through each img element
            for (let i = 0; i < imgs.length; i++) {
                // Check if the src attribute contains a base64 URL
                const src = imgs[i].getAttribute('src');
                if (src.startsWith('data:image/')) {
                    // Get the parent div element
                    imgs[i].parentNode.remove();
                }
            }
            editor.value.setHTMLCode(docs.documentElement.outerHTML);
        }

        onMounted(() => {
            var uploadhandlerpath = `${API_BASE_URL}teacher/editor/upload-image`;
            var rteconfig = {};
            rteconfig.file_upload_handler = async function (file, callback, optionalIndex, optionalFiles) {
                let local = new Token();
                let token = await local.getWithExpiry('accessTokenT').then((r) => r.token);

                function append(parent, tagname, csstext) {
                    var tag = parent.ownerDocument.createElement(tagname);
                    if (csstext) tag.style.cssText = csstext;
                    parent.appendChild(tag);
                    return tag;
                }

                var uploadcancelled = false;

                var dialogouter = append(document.body, 'div', 'display:flex;align-items:center;justify-content:center;z-index:999999;position:fixed;left:0px;top:0px;width:100%;height:100%;background-color:rgba(128,128,128,0.5)');
                var dialoginner = append(dialogouter, 'div', 'background-color:white;border:solid 1px gray;border-radius:15px;padding:15px;min-width:200px;box-shadow:2px 2px 6px #7777');

                var line1 = append(dialoginner, 'div', 'text-align:center;font-size:1.2em;margin:0.5em;');
                line1.innerText = 'Uploading...';

                var totalsize = file.size;
                var sentsize = 0;

                if (optionalFiles && optionalFiles.length > 1) {
                    totalsize = 0;
                    for (var i = 0; i < optionalFiles.length; i++) {
                        totalsize += optionalFiles[i].size;
                        if (i < optionalIndex) sentsize = totalsize;
                    }
                    // console.log(totalsize, optionalIndex, optionalFiles);
                    line1.innerText = 'Uploading...' + (optionalIndex + 1) + '/' + optionalFiles.length;
                }

                var line2 = append(dialoginner, 'div', 'text-align:center;font-size:1.0em;margin:0.5em;');
                line2.innerText = '0%';

                var progressbar = append(dialoginner, 'div', 'border:solid 1px gray;margin:0.5em;');
                var progressbg = append(progressbar, 'div', 'height:12px');

                var line3 = append(dialoginner, 'div', 'text-align:center;font-size:1.0em;margin:0.5em;');
                var btn = append(line3, 'button');
                btn.className = 'btn btn-primary';
                btn.innerText = 'cancel';
                btn.onclick = function () {
                    uploadcancelled = true;
                    cancelUpload();
                    xh.abort();
                };

                let formData = new FormData();
                formData.append('editors', file);

                var xh = new XMLHttpRequest();
                xh.open('POST', uploadhandlerpath);
                xh.onload =
                    xh.onabort =
                    xh.onerror =
                        function (pe) {
                            dialogouter.parentNode.removeChild(dialogouter);
                            if (pe.type == 'load') {
                                if (xh.status != 200) {
                                    callback(null, 'http-error-' + xh.status);
                                } else {
                                    var res = JSON.parse(xh.response);
                                    callback(res.acknowledgements?.at(0));
                                }
                            } else if (uploadcancelled) {
                                callback(null, 'cancelled');
                            } else {
                                callback(null, pe.type);
                            }
                        };
                xh.upload.onprogress = function (pe) {
                    var percent = Math.floor((100 * (sentsize + pe.loaded)) / totalsize);
                    line2.innerText = percent + '%';
                    progressbg.style.cssText = 'background-color:green;width:' + (percent * progressbar.offsetWidth) / 100 + 'px;height:12px;';
                };

                xh.setRequestHeader('Authorization', `Bearer ${token}`);
                xh.send(formData);
            };

            editor.value = new RichTextEditor(`#${id.value}`, rteconfig);
            editor.value.setHTMLCode(modelValue.value);
            editor.value.attachEvent('change', function () {
                editorData.value = editor.value.getHTMLCode();
            });
        });

        watch(setContent, (first, second) => {
            if (first !== second) {
                editor.value.setHTMLCode(setContent.value);
            }
        });

        watch(editorData, async (currentValue, oldValue) => {
            if (currentValue !== oldValue) {
                const currentUrls = extractImageFileUrl(currentValue);
                const previousUrls = extractImageFileUrl(oldValue);
                const deletedImages = previousUrls.length - currentUrls.length;
                if (deletedImages > 0) {
                    let imagesToDelete;
                    const isAllDeleted = currentUrls.length === 0;
                    if (isAllDeleted) {
                        imagesToDelete = [...previousUrls];
                    } else {
                        imagesToDelete = previousUrls.filter((url) => !url.includes(currentUrls));
                    }
                    const local = new Token();
                    const token = await local.getWithExpiry('accessTokenT').then((r) => r.token);
                    const requestUrl = `${API_BASE_URL}teacher/editor/remove-image`;
                    const options = { method: 'POST', body: JSON.stringify({ filesToDelete: imagesToDelete }), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
                    try {
                        const response = await fetch(requestUrl, options);
                    } catch (error) {
                        console.log(error);
                    }
                }
                emit('update:modelValue', currentValue);
            }
        });
    },
};
</script>
