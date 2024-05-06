<template>
  <Teleport to="body">
    <!-- transitionInRootPosition :: start -->
    <Transition :name="transition">
      <!-- wrapper :: start -->
      <div v-if="show" class="modal_backdrop" @click.prevent="handleClickOutside">
        <!-- modal :: start -->
        <div class="modal_" :style="{ 'max-width': mWidth, 'height': mHeight } " :class="{'p-0': pNone}">
          <div class="modal_content" @click.stop>

            <!-- Xbutton :: start -->
            <div class="modal-sec nons" v-if="defaultCloseBtn">
              <div class="close pointer">
                  <img src="@/assets/icons/modal-close.svg" @click.prevent="closeModal">                
              </div>
            </div>
            <!-- Xbutton :: end -->

            <!-- header :: start -->
            <div>
              <slot name="header"></slot>
            </div>
            <!-- header :: end -->

            <!-- content :: start -->
            <div>
              <div v-if="isLoading" style="width: 100%; height: 90%; position: relative; top: 10%; z-index: 999998;">
                <SimpleLoaderVue :loading="isLoading"/>
              </div>
              <slot name="body" ></slot>
            </div>
            <!-- content :: end -->

            <!-- footer :: start -->
            <div>
              <slot name="footer"></slot>
            </div>
            <!-- footer :: end -->
          </div>
        </div>
        <!-- modal :: end -->
      </div>
      <!-- wrapper :: end -->
    </Transition>
    <!-- transitionInRootPosition :: end -->
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave } from 'vue-router';
import SimpleLoaderVue from "./SimpleLoaderVue.vue";
// #### PROPS
const props = defineProps({
  // Boolean to show / close the modal
  show: Boolean,

  // This needed to make the modal closable on clicking outside
  closable: {
    type: Boolean,
    default: true
  },
  pNone: {
    type: Boolean,
    default: false
  },
  defaultCloseBtn: {
    type: Boolean,
    default: true
  },
  isLoading: {
      default: false,
      type: Boolean,
  }, 

  // Allow the parent show / hide header
  showHeader: {
    type: Boolean,
    default: true
  },

  // Allow the parent to control modal width
  mWidth: {
    type: String,
    default: "500px",
  },
  // Allow the parent to control modal height
  mHeight: {
    type: String,
    default: "",
  },
  // Allow the parent to control transition, Transitions css is wrapped in child component a.k.a in this modal
  transition: {
    type: String,
    default: "fade"
  },
  restrictRemoveScroll: {
    type: Boolean,
    default: false
  }
});

// #### EVENTS
const emit = defineEmits(['close']);

// #### FUNCTIONS :: start
const closeModal = () => {
  emit('close')
};

const handleClickOutside = () => {
  if (props.closable) {
    closeModal();
  }
};

onBeforeRouteLeave((to, from, next) => {
  if(props.show) {
    // closeModal();
    next(false);
  } else {
    next();
  }
})

onMounted(() => {
  document.body.classList.add("hideScroll");
});
onUnmounted(() => {
  if (!props.restrictRemoveScroll) {
    document.body.classList.remove("hideScroll");
  }
});
// #### FUNCTIONS :: end
</script>

<style lang="scss" scoped>
.modal_backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.modal_ {
  background: white;
  // overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 95vh;
  border-radius: 16px;
  padding: 20px;
  @media screen and (max-width: 768px) {
    width: 98%;
  }
}

.modal_content {
  // padding: 20px;
  @media screen and (max-width: 768px) {
    padding: 00px;
  }
  // .close{
  //   @media screen and (max-width: 767px) {
  //         display: none;
  //     }
  // }
  // padding: 20px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #d7d4d4; 
  }
  &::-webkit-scrollbar-thumb {
    background: #878686;
  }
  
}

.modal_header,
.modal_footer {
  border: none;
}

.modal_header {
  position: relative;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start !important;
  gap: 10px;

  img {
    order: 1;
    margin-left: auto;
    height: 24px;
    width: 24px;
  }

  button {
    width: fit-content;
    margin-left: auto;
  }

  h1 {
    order: 2;

    @media screen and (max-width: 768px) {
      font-size: 24px !important;
      line-height: 40px !important;
    }
  }
}

.modal_body {
  position: relative;
}

.modal_body h2 {
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #000000;
  margin-bottom: 40px;
}

// NOTE: Do not edit below classes without informing vue team
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
