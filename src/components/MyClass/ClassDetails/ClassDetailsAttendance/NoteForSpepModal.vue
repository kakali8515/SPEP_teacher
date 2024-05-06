<template>
  <DrawerVue
    :visible="modelValue"
    type="bottom"
    title="Note for SPEP"
    @close="closeModal"
    :noFooter="true"
  >
    <div class="row">
      <div
        class="col-lg-4 col-md-6 col-sm-12 col-xs-12"
        v-for="(item, idx) in noteList"
        :key="idx"
      >
        <div class="note">
          <div
            class="heading d-flex justify-content-between align-items-center"
          >
            <p>{{ item.title }}</p>
            <div class="date d-flex justify-content-end align-items-center">
              <p>{{ moment(item.created_at).format("YYYY-MM-DD HH:mm") }}</p>
              <button @click="DeleteModal(item)" type="button">
                <img src="@/assets/teacher/icons/trash.svg" />
              </button>
            </div>
          </div>
          <div class="details">
            <p class="pre-wrap-new-line">{{ item.body }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
        <div class="addnote">
          <div class="button-wrap">
            <button type="button" @click="openAddNote">
              <img src="@/assets/icons/plus.svg" />Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
    <LoaderVue :loading="loaderState" />
  </DrawerVue>
  <!-- Add Notes modal -->
  <ModalVue
    v-if="displayAddNoteDetails"
    :restrictRemoveScroll="true"
    :show="displayAddNoteDetails"
    :defaultCloseBtn="false"
    mWidth="670px"
  >
    <template #body>
      <div class="modal-overlay">
        <div class="modal-container">
          <div class="notemodal-wrap">
            <div class="cancel pointer">
              <img @click="closeAddNote" src="@/assets/icons/close.svg" />
            </div>
            <div class="heading">
              <h4>Additional Notes</h4>
            </div>
            <div class="form-wrap">
              <div class="form">
                <p>Title</p>
                <input
                  v-model="Notes.Title"
                  type="text"
                  @input="handleTitleInput"
                  placeholder="Please enter a title"
                />
                <p class="error-text" v-if="v$.Title?.$error">
                  {{ v$.Title?.$errors[0].$message }}
                </p>
              </div>
              <div class="form">
                <p>Content</p>
                <textarea
                  v-model="Notes.Content"
                  placeholder="Write your Content"
                  :maxlength="250"
                ></textarea>
                <p class="error-text" v-if="v$.Content?.$error">
                  {{ v$.Content?.$errors[0].$message }}
                </p>
              </div>

              <div class="btn-wrap">
                <button @click="saveNotes" type="button">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoaderVue :loading="loaderState" />
    </template>
  </ModalVue>
  <!-- delete modal -->
  <ConfirmModalVue
    :visible="displayDeleteModal"
    :restrict-scroll="true"
    :is-loading="loaderState"
    title="Are you sure you want to delete?"
    primaryButtonText="Delete"
    secondaryButtonText="Cancel"
    @on-cancel="closeDeleteModal"
    @on-confirm="onDelete(deleteItem)"
  />
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import moment from "moment";
import { useVuelidate } from "@vuelidate/core";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { useUserData } from "@/stores/useUserDataCopy";
import { useRoute } from "vue-router";

import { required, helpers } from "@vuelidate/validators";
const store = useUserData();
const route = useRoute();
const classDetailsService = new ClassDetails();
const loaderState = ref(false);
const noteList = ref([]);
const noteDetails = ref([]);
const Notes = reactive({
  Title: "",
  Content: "",
});
const page = ref(1);
const totalPage = ref(1);
const totalRecords = ref(0);
const limit = 20;

//validation
const rules = {
  Title: {
    required: helpers.withMessage("Please enter a title.", required),
  },
  Content: {
    required: helpers.withMessage("Please write your content.", required),
  },
};

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const displayAddNoteDetails = ref(false);
const displayDeleteModal = ref(false);

const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};

const openAddNote = () => {
  displayAddNoteDetails.value = true;
};
let deleteItem = null;
const DeleteModal = (item) => {
  displayDeleteModal.value = true;
  deleteItem = item;
};

const closeDeleteModal = () => {
  deleteItem = null;
  displayDeleteModal.value = false;
};

const closeAddNote = () => {
  Notes.Title = "";
  Notes.Content = "";
  displayAddNoteDetails.value = false;
  v$.value.$reset();
};

let isTitleExceededLimit = false;
const handleTitleInput = () => {
  isTitleExceededLimit = Notes.Title.length > 20;
  if (isTitleExceededLimit) {
    Notes.Title = Notes.Title.slice(0, 20 - 1) + Notes.Title.slice(-1);
  }
};

let isContentExceededLimit = false;

const handleContentTextarea = () => {
  isContentExceededLimit = Notes.Content.length > 350;
  if (isContentExceededLimit) {
    Notes.Content = Notes.Content.slice(0, 350 - 1) + Notes.Content.slice(-1);
  }
};

//Additional Notes
const v$ = useVuelidate(rules, Notes);
const saveNotes = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  } else {
    let data = {
      title: Notes.Title,
      body: Notes?.Content,
      class_seq: route.params.class_seq,
    };
    try {
      loaderState.value = true;
      const res = await classDetailsService.AdditionalNote(data);
      if (res.data?.success) {
        loaderState.value = false;
        closeAddNote();
        totalRecords.value++;
        const pages = Math.ceil(totalRecords.value / limit);
        if (pages !== page.value) page.value++;
        await getNoteList();
      }
    } catch (error) {
      console.error(error);
    } finally {
      loaderState.value = false;
    }
  }
};

//Notes List
const getNoteList = async () => {
  let data = {
    page: page.value,
    limit: limit,
    class_seq: route.params.class_seq,
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.NoteList(data);
    if (res.data?.success) {
      loaderState.value = false;
      noteDetails.value = res.data.list;
      noteList.value.push(...res.data.list);

      noteList.value = [
        ...new Map(
          noteList.value.map((item) => [item["note_seq"], item])
        ).values(),
      ];
      totalPage.value = res.data.pages;
      totalRecords.value = res.data.totalRows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
//Delete
const onDelete = async (deleteItem) => {
  let data = {
    note_seq: deleteItem?.note_seq,
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.DeleteList(data);
    if (res.data?.success) {
      page.value = 1;
      noteList.value = [];
      await getNoteList();
      closeDeleteModal();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

onMounted(async () => {
  loaderState.value = true;
  document
    .querySelector(".bottom-modal-content")
    .addEventListener("scroll", function () {
      if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
        if (totalPage.value !== page.value) {
          page.value++;
          getNoteList();
        }
      }
    });
  await getNoteList();
});
</script>
