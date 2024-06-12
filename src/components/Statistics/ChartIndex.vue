<template>
    <div class="monthlyChartIndex">
        <ul>
            <li class="category" v-for="(item, index, id) in groupedData">
                <div v-if="index != 'undefined'">
                    <div class="circle" :style="{ backgroundColor: colors[id] }"></div>
                    <span>{{ index }} </span>
                    <span>{{ item }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { ref, toRef, unref, computed, reactive, watch, onUpdated } from "vue";
import { getChartColors } from './util/ChartColorPallete';

const props = defineProps({ title: String, data: Array })

const groupedData = computed(() => groupByCategory(props.data));
const colors = reactive([])
onUpdated(() =>{
    Object.assign(colors, getChartColors(Object.keys(groupedData.value).length))
})

const groupByCategory = (data) => {
    if (!data || !Array.isArray(data)) {
        return {};
    }
    return data.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = 0;
        }
        acc[item.category] += item.amount;
        return acc;
    }, {});
};
</script>
<style></style>