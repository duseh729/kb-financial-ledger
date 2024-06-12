<template>
    <div class="monthlyChartIndex">
        <div class="totalPrice">
            <span>이번 달 {{ props.title }} <span :style="{ color: props.title=='수입' ? 'blue' : 'red'}">{{ totalPrice }} </span>금액</span>
        </div>
        <table>
            <tr class="category" v-for="(item, index, id) in groupedData">
                <td><div class="circle categoryElement" :style="{ backgroundColor: colors[id] }"></div></td>
                <td><span class="categoryElement">{{ index }} </span></td>
                <td><span class="categoryElement">{{ item }}</span></td>
            </tr>
        </table>
    </div>
</template>
<script setup>
import { ref, toRef, unref, computed, reactive, watch, onUpdated } from "vue";
import { getChartColors } from './util/ChartColorPallete';

const props = defineProps({ title: String, data: Array })

const groupedData = computed(() => groupByCategory(props.data));
const totalPrice = computed(() => calcTotalPrice(props.data))
const colors = reactive([])
onUpdated(() =>{
    Object.assign(colors, getChartColors(Object.keys(groupedData.value).length))
    totalPrice.value = 1000;
})

const calcTotalPrice = (data) =>{
    let sum = 0;
    for(let i = 0; i < data.length; i++){
        sum += data[i].amount
    }
    return sum;
}
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