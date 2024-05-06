<template>
    <div class="tablemain-wrap survey-table">
        <!-- <div class="table ">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Small Group</th>
                        <th>1:1 Coaching</th>
                        <th>All Students</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Response Rate</td>
                        <td>
                            10%(1/10)
                        </td>
                        <td>
                            10%(1/10)
                        </td>
                        <td>
                            10%(1/10)
                        </td>
                    </tr>
                    <tr>
                        <td>Response Rate</td>
                        <td>
                            10%(1/10)
                        </td>
                        <td>
                            10%(1/10)
                        </td>
                        <td>
                            10%(1/10)
                        </td>
                    </tr>
                    <tr>
                        <td>Response Rate</td>
                        <td>
                            10%(1/10)
                        </td>
                        <td>
                            10%(1/10)
                        </td>
                        <td>
                            10%(1/10)
                        </td>
                    </tr>
                    <tr>
                        <td>Response Rate</td>
                        <td>
                            10%(1/10)
                        </td>
                        <td>
                            10%(1/10)
                        </td>
                        <td>
                            10%(1/10)
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> -->
        <TableVue :fields="data1fields" :data="data1" :hidePagination="true">
            <template #custom_tr v-if="data1.length > 0">
                <tr>
                    <td>Total Average</td>
                    <td>{{ totalData1SmallGroupAvg / categorylength }}</td>
                    <td> {{ totalData1Coaching / categorylength }} </td>
                    <td>{{ totalData1AllParticipant / categorylength }} </td>
                </tr>
            </template>
        </TableVue>
    </div>

</template>

<script setup>

const props = defineProps({
    data1fields: Array,
    data1: Array,
    totalData1SmallGroupAvg: Number,
    totalData1Coaching: Number,
    totalData1AllParticipant: Number,
    categorylength: Number
});

</script>