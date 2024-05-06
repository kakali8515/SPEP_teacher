<template>
    <!-- Filter Drawer For Web View -->
   <div class="filter-wrap desktop-filter" v-if="!modelValue">
        <slot></slot>
    </div>
    <div class="filter-wrap mobile-filter" v-if="displayFilterButton">
      <div class="filter-button">
        <button type="button" @click="onOpenFilter">
          <img src="@/assets/teacher/icons/filter.svg"> Filters
        </button>
      </div>
    </div>

    <!-- Filter Drawer For Mobile View -->
    <div class="bottom-side-modal filter-modal overlay-show" v-if="modelValue">
        <div class="bottom-modal-content show">
            <div>
                <div class="heading-wrap">
                    <h2>Filter</h2>
                    <div class="icon pointer" @click="onCloseFilter">
                        <img src="@/assets/teacher/icons/close.svg">
                    </div>
                </div>
                <div class="modal-inner-content">
                    <slot></slot>            
                </div>
            </div>
            
            <div class="modal-button-area">
            <button type="button pointer" @click="onClickApply">
                Apply
            </button>
        </div>
            
        </div>     
    </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { onBeforeRouteLeave } from 'vue-router';
const displayMobileFilter = ref(false);
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    displayFilterButton: {
        type: Boolean,
        default:true
    }
});
const emit = defineEmits(['on-display-filter', 'on-apply-filter', 'on-close']);
const onCloseFilter = () => {
    emit('on-close');
}
const onClickApply = () => {
    emit('on-apply-filter');
}
const onOpenFilter = () => {
    emit('on-display-filter', true);
}
onBeforeRouteLeave((to, from, next) => {
  if(props.modelValue) {
    next(false);
  } else {
    next();
  }
})
// For Hiding Background Scroll
watch(() => props.modelValue, (nV, oV) => {
    if (nV) {
        document.body.classList.add("hideScroll");  
    } else {
        document.body.classList.remove("hideScroll");
    }
})
</script>