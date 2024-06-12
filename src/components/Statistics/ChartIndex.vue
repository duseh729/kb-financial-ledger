<template>
    <div class="monthlyChartIndex">
        <ul>
            <li class="category" v-for="(item, index) in groupedData">
                <div v-if="index != 'undefined'">
                    <div class="circle" style="background-color: aqua;"></div>
                    <span>{{index}} </span> 
                    <span>{{item }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { ref, toRef, unref, computed } from "vue";
const props = defineProps({ title: String, data: Array })
// console.log(props.data)

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
const groupedData = computed(() => groupByCategory(props.data));
</script>
<style></style>