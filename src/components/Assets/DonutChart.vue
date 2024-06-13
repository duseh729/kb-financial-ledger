<template>
    <div class="donut-chart-container">
        <h3 style="position: relative;top: 165px; ">자산 구성</h3>
        <canvas id="donutChart"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    mounted() {
        if (Array.isArray(this.data) && this.data.length > 0) {
            this.createDonutChart();
        } else {
            console.error('유효한 데이터가 없습니다.');
        }
    },
    methods: {
        createDonutChart() {
            const ctx = document.getElementById('donutChart').getContext('2d');

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.data.map(item => item.label),
                    datasets: [
                        {
                            data: this.data.map(item => item.value),
                            backgroundColor: ['#36A2EB', '#FFCE56'],
                            hoverBackgroundColor: ['#36A2EB', '#FFCE56'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            });
        },
    },
};
</script>

<style scoped>
.donut-chart-container {
    width: 100%;
    max-width: 300px;
    text-align: center;
    margin: 0 auto;
}
</style>