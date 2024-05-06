<template>
    <div class="martop32 "> 
        <Filter/>
    </div>
    <div class="martop16 ">
        <div class="table-heading heading-background d-flex justify-content-between align-items-center">
            <h4>Assessment</h4>
        </div>
        <div class="martop15">
            <ClassFeedbackTable/>
        </div>
    </div>



</template>

<script setup>
    import Filter from '@/components/Filter.vue';
    import ClassFeedbackTable from '@/components/ClassFeedbackTable.vue';
</script>