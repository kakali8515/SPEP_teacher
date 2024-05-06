<template>
  <div class="class-info-main-wrapper">
    <div class="details-wrap">
      <div class="row">
        <!-- =============== 1ST COLUMN =============== -->
        <div class="col-md-3 col-sm-12">
          <div class="dtls">
            <div class="title">
              <h4>Company</h4>
              <p>
                {{
                  data.company_name_en
                    ? data.company_name_en
                    : data.company_name_kr
                }}
              </p>
            </div>
            <div class="title">
              <h4>Course Name</h4>
              <p>{{ data.program1 }}</p>
            </div>
            <div class="title">
              <h4>Class</h4>
              <p>{{ data.class_code }}</p>
            </div>
          </div>
        </div>
        <!-- =============== 2ND COLUMN =============== -->
        <div class="col-md-3 col-sm-12">
          <div class="dtls">
            <div class="title">
              <h4>PS Name</h4>
              <p>{{ data.teacher_name_en }}</p>
            </div>
            <div class="title">
              <h4>Level</h4>
              <p>{{ data.class_level }}</p>
            </div>
            <div class="title">
              <h4>Class Room</h4>
              <p>
                {{
                  data.area_edu_name_en
                    ? data.area_edu_name_en
                    : data.area_edu_name_kr
                }}
              </p>
            </div>
          </div>
        </div>
        <!-- =============== 3RD COLUMN =============== -->
        <div class="col-md-3 col-sm-12">
          <div class="dtls">
            <div class="title">
              <h4>Period</h4>
             <p> {{ moment(data.start_date).format("YYYY.MM.DD") }} ~
              {{ moment(data.end_date).format("YYYY.MM.DD") }}</p>
            </div>
            <div class="title">
              <h4>Unit/Lesson #</h4>
              <p>{{ data.program2 }}</p>
            </div>
            <div class="title">
              <h4>Location</h4>
              <p>
                {{ data.area_name_en ? data.area_name_en : data.area_name_kr }}
              </p>
            </div>
          </div>
        </div>
        <!-- =============== 4Th COLUMN =============== -->
        <div class="col-md-3 col-sm-12">
          <div class="dtls mob-no-mar">
            <div class="title">
              <h4>Year / Session</h4>
              <p>{{ data.year }}년 / {{ data.order_num }}차</p>
            </div>
            <div class="title">
              <h4>Type</h4>
              <p>{{ data.program3 }}</p>
            </div>
            <div class="title">
              <h4>URL</h4>
              <div class="input-wrap">
                <p>{{ data.zoom_start_url }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import moment from "moment";
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});
</script>
