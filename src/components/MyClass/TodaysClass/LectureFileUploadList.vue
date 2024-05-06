<template>
    <!-- <div class="tablemain-wrap">
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>To</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="uploadList?.length > 0">
                        <tr class="pointer" v-for="data in uploadList" :key="data" @click="$emit('openFileUploadData', data)">
                            <td>{{ moment(data.reg_date).format("YYYY.MM.DD") }}</td>
                            <td>{{ data.target_id ? data.target_id : 'All' }}</td>
                            <td>{{ data.title }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="3">
                                No data found
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div> -->

    <TableVue :fields="fields" :data="uploadList" :page="pageDetails.currentPage" :totalRecord="pageDetails.totalRecord"
        :limit="pageDetails.limit" @paginationHandler="$emit('getUploadList', $event)"
        @on-row-clicked="$emit('openFileUploadData', $event)">
        <template #reg_date="{ slotData }">
            <span>{{ moment(slotData.reg_date).format("YYYY.MM.DD") }}</span>
        </template>
        <template #target_id="{ slotData }">
            <span>{{ slotData.target_id ? slotData.target_id : 'All' }}</span>
        </template>
    </TableVue>
</template>
<script setup>
import moment from "moment";
const props = defineProps({
    uploadList: {
        typeof: Array
    },
    pageDetails: {
        type: Object,
        default: () => { },
    }
});
const emit = defineEmits(['openFileUploadData', 'getUploadList']);

const fields = [
    {
        title: "Date",
        key: "actions",
        is_display_on_both: true,
        slot_name: "reg_date",
    },
    {
        title: "To",
        key: "actions",
        is_display_on_both: true,
        slot_name: "target_id",
    },
    {
        title: "Title",
        is_display_on_both: true,
        key: "title",
    },
];
</script>