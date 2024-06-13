<template>
  <div>
    <h2>자산</h2>
    <div class="assets-overview">
      <div class="asset-card-wrapper">
        <div class="asset-card">
          <h3>현금</h3>
          <div class="details">
            <span>총 금액: </span><span>{{ groupedAssets.cash.total.toLocaleString("ko-KR") }} 원</span>
          </div>
        </div>
        <div class="asset-card">
          <h3>은행</h3>
          <div class="details">
            <span>총 금액: </span><span>{{ groupedAssets.bank.total.toLocaleString("ko-KR") }} 원</span>
          </div>
        </div>
      </div>
      <div class="asset-summary">
        <h4>자산 전체</h4>
        <div class="chart-wrapper">
          <asset-chart v-if="groupedAssets.chartData && groupedAssets.chartData.length" :assetData="groupedAssets.chartData"></asset-chart>
          <div v-else>차트 데이터가 없습니다.</div>
        </div>
        <div class="assets-total-wrapper">
          <span>총 자산</span>
          <span>{{ totalAssets.toLocaleString("ko-KR") }} 원</span>
        </div>
        <div class="chart-wrapper">
          <DonutChart v-if="donutChartData.length" :data="donutChartData" />
          <div v-else>도넛 차트 데이터가 없습니다.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AssetChart from "../components/Assets/AssetChart.vue";
import DonutChart from "../components/Assets/DonutChart.vue";

export default {
  components: {
    AssetChart,
    DonutChart,
  },
  data() {
    return {
      assetData: [],
      groupedAssets: {
        cash: { total: 0 },
        bank: { total: 0 },
        chartData: [],
      },
      donutChartData: [],
    };
  },
  created() {
    this.fetchAssets();
  },
  methods: {
    async fetchAssets() {
      try {
        const response = await axios.get("http://localhost:3001/data");
        if (response.data && Array.isArray(response.data)) {
          this.assetData = response.data.map(item => ({
            date: item.date,
            amount: item.amount,
            asset: item.asset,
            type: item.type,
          }));
          this.groupAssets();
          this.prepareChartData();
          this.prepareDonutChartData();
        } else {
          console.error("올바르지 않은 데이터 형식:", response.data);
        }
      } catch (error) {
        console.error("자산 데이터를 가져오는 데 실패했습니다:", error);
      }
    },
    groupAssets() {
      if (!Array.isArray(this.assetData)) {
        console.error("자산 데이터가 배열이 아닙니다:", this.assetData);
        return;
      }

      this.assetData.forEach(asset => {
        // console.log(asset.asset, asset.type)
        if (asset.asset === "현금" && asset.type === "income") {
          this.groupedAssets.cash.total += asset.amount;
        } else if (asset.asset === "현금" && asset.type === "expense") {
          this.groupedAssets.cash.total -= asset.amount;
        } else if (asset.asset === "은행" && asset.type === "income") {
          this.groupedAssets.bank.total += asset.amount;
        } else if (asset.asset === "은행" && asset.type === "expense") {
          this.groupedAssets.bank.total -= asset.amount;
        }
      });
    },
    prepareChartData() {
      if (!Array.isArray(this.assetData)) {
        console.error("자산 데이터가 배열이 아닙니다:", this.assetData);
        return;
      }

      const monthlyData = {};

      this.assetData.forEach(entry => {
        const date = new Date(entry.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        if (!monthlyData[year]) {
          monthlyData[year] = {};
        }
        if (!monthlyData[year][month]) {
          monthlyData[year][month] = 0;
        }
        monthlyData[year][month] += entry.amount;
      });

      const chartData = [];

      Object.keys(monthlyData).forEach(year => {
        const months = Object.keys(monthlyData[year])
          .map(Number)
          .sort((a, b) => a - b);
        months.forEach(month => {
          // cumulativeAmount += monthlyData[year][month];
          chartData.push({
            date: `${year}-${String(month).padStart(2, "0")}`,
            amount: monthlyData[year][month],
          });
        });
      });

      Object.keys(monthlyData).forEach(year => {
        // 전년도 데이터가 있는 경우, 현재년도 1월에 추가
        // console.log(monthlyData[year])
        if (monthlyData[year - 1]) {
          const lastYearData = Object.values(monthlyData[year - 1]);
          // console.log(lastYearData);
          const lastYearTotal = lastYearData.reduce((total, amount) => total + amount, 0);
          // console.log(lastYearTotal);
          if (!monthlyData[year]["01"]) {
            monthlyData[year]["01"]=lastYearTotal
            chartData.push({
              date: `${year}-01`,
              amount: lastYearTotal,
            });
          } else {
            monthlyData[year]["01"] += lastYearTotal;
          }
        }
      });
      // console.log(monthlyData)

      // console.log('chartData', chartData);
      this.groupedAssets.chartData = chartData;
    },
    prepareDonutChartData() {
      const totalCash = this.groupedAssets.cash.total;
      const totalBank = this.groupedAssets.bank.total;
      const totalAssets = totalCash + totalBank;

      this.donutChartData = [
        {
          label: "현금",
          value: totalCash,
        },
        {
          label: "은행",
          value: totalBank,
        },
      ];
    },
  },
  computed: {
    totalAssets() {
      return this.groupedAssets.cash.total + this.groupedAssets.bank.total;
    },
  },
};
</script>

<style scoped>

.assets-overview {
  display: flex;
  /* justify-content: space-between; */
  gap: 16px;
}

.asset-card-wrapper {
  display: flex;
  flex-direction: column;
}

.asset-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.asset-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.asset-summary {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.assets-total-wrapper {
  background-color: rgb(235, 246, 255);
  color: rgb(37, 157, 255);
  margin-top: 16px;
  padding: 12px 28px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
}
</style>
