<template>
  <div class="class-info-main-wrapper">
    <div class="details-wrap">
      <div class="row">
        <div class="col-md-4 col-sm-12">
          <div class="dtls">
            <div class="title">
              <h4>Company</h4>
              <p>{{ data.company_name_en ? data.company_name_en : data.company_name_kr }}</p>
            </div>
            <div class="title">
              <h4>Course Name</h4>
              <p>{{ data.program1 }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="dtls">
            <div class="title">
              <h4>Period</h4>
              <p>{{ moment(data.start_date).format("YYYY.MM.DD") }} ~
              {{ moment(data.end_date).format("YYYY.MM.DD") }}</p>
              
            </div>
            <div class="title">
              <h4>Unit/Lesson #</h4>
              <p>{{ data.program2 }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="dtls">
            <div class="title">
              <h4>Year / Session</h4>
              <p>{{ data.year }}년 / {{ data.order_num }}차</p>
            </div>
            <div class="title">
              <h4>Lesson Title</h4>
              <p>{{ data.class_code }}</p>
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
