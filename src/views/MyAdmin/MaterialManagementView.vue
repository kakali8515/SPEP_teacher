<template>
  <div class="martop24">
    <TableVue :fields="fields" :data="ApiRes" :hidePagination="true">
      <template #rentalDate="{ slotData }">
        <div>
          {{ slotData.give_date ? moment(slotData.give_date).format("ll") : "-" }}
        </div>
      </template>
      <template #agreeDate="{ slotData }">
        <div>
          {{
            slotData.agree_date ? moment(slotData.agree_date).format("ll") : "-"
          }}
        </div>
      </template>
      <template #returnDate="{ slotData }">
        <div>
          {{
            slotData.return_sch_date
              ? moment(slotData.return_sch_date).format("ll")
              : "-"
          }}
        </div>
      </template>
      <template #agreement="{ slotData }">
        <button v-if="slotData.agree_date && slotData?.agree_sign"  type="button" class="b-grey">Submitted</button>
        <button
          v-else
          type="button"
          class="bg-ef"
          @click="openAgreementlDetails(slotData)"
        >
          Agreement
        </button>
      </template>
    </TableVue>
  </div>
  <AgreementDetailsModal
    v-if="displayAgreementDetails"
    v-model="displayAgreementDetails"
    :data="agreementData"
    @close="onClose"
  />
  <LoaderVue :loading="loaderState" />
</template>
<script setup>
import { ref, onMounted } from "vue";
import moment from "moment";
import { MaterialManagement } from "@/services/MyAdmin/MaterialManagement";
import { useUserData } from "@/stores/useUserDataCopy";
import AgreementDetailsModal from "@/components/MyAdmin/MaterialManagement/AgreementDetailsModal.vue";
const userStore = useUserData();
const materialManagementService = new MaterialManagement();
const laptopDetails = ref([]);
const displayAgreementDetails = ref(false);
const agreementData = ref(null);
const loaderState = ref(false);
const fields = [
  {
    title: "Item",
    key: "tp_name",
    is_display_on_both: true,
  },
  {
    title: "Rental Date",
    key: "actions",
    slot_name: "rentalDate",
    is_display_on_both: true,
  },
  {
    title: "Agreement",
    key: "actions",
    slot_name: "agreement",
    is_display_on_both: true,
  },
  {
    title: "Agreement date",
    key: "actions",
    slot_name: "agreeDate",
  },
  {
    title: "Return date",
    key: "actions",
    slot_name: "returnDate",
  },
];

const openAgreementlDetails = (_data) => {
  agreementData.value = _data;
  displayAgreementDetails.value = true;
};

const ApiRes = ref([]);

const getLaptopList = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    tp_idx: "",
  };
  try {
    loaderState.value = true;
    const res = await materialManagementService.getLaptopList(data);
    if (res.data?.result) {
      laptopDetails.value = res.data.resultSignature;
      ApiRes.value = res.data.resultSignature;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const onClose = async (_type) => {
  displayAgreementDetails.value = false;
  if (_type === 'success') {
    await getLaptopList();
  }
}
onMounted(async () => {
  loaderState.value = true;
  await userStore.getUserDetails();
  await getLaptopList();
});
</script>
