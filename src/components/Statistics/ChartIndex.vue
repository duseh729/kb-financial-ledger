<template>
    <div class="monthlyChartIndex">
        <div class="totalPrice">
            <span>이번 달 {{ props.title }} 
                <span :style="lineStyle">{{ totalPrice.toLocaleString() }} 
                </span>금액</span>
        </div>
        <table>
            <tr class="category" v-for="(item, index, id) in props.data">
                <td><div class="circle categoryElement" :style="{ backgroundColor: colors[id] }"></div></td>
                <td><span class="categoryElement">{{ index }} </span></td>
                <td><span class="categoryElement">{{ item.toLocaleString() }} 원</span></td>
            </tr>
        </table>
    </div>
</template>
<script setup>
import { ref, toRef, unref, computed, reactive, watch, onUpdated } from "vue";
import { getChartColors } from './util/ChartColorPallete';

const props = defineProps({ title: String, data: Object})

const colors = computed(() => getChartColors(Object.keys(props.data).length));
const totalPrice = computed(() => calcTotalPrice(Object.values(props.data)))
const lineStyle  = computed(() => {
    return {
        color: props.title === '수입' ? 'blue' : 'red',
        textDecoration:  'underline'
    }
})

const calcTotalPrice = (data) =>{
    let sum = 0;
    for(let i = 0; i < data.length; i++){
        sum += data[i]
    }
    return sum;
}
</script>
<style></style>