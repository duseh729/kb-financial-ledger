<template>
  <div class="container">
    <h2>자산</h2>
    <div class="assets-overview">
      <div class="asset-cards" v-if="groupedAssets.chartData">
        <div class="asset-card">
          <h3>현금</h3>
          <div class="details">
            <span>총 금액: </span><span>{{ groupedAssets.cash.total }} 원</span>
          </div>
        </div>
        <div class="asset-card">
          <h3>은행</h3>
          <div class="details">
            <span>총 금액: </span><span>{{ groupedAssets.bank.total }} 원</span>
          </div>
        </div>
      </div>
      <div class="asset-summary">
        <h1>자산 전체</h1>
        <div class="container" v-if="groupedAssets.chartData && assetData.length">
          <asset-chart :assetData="groupedAssets.chartData"></asset-chart>
        </div>
        <div v-if="groupedAssets.chartData && assetData.length">
          <DonutChart :data="donutChartData" />
        </div>
        <div v-else>
          자산 데이터가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AssetChart from '../components/Assets/AssetChart.vue';
import DonutChart from '../components/Assets/DonutChart.vue';

export default {
  components: {
    AssetChart,
    DonutChart,
  },
  data() {
    return {
      assetData: [

      ],
      groupedAssets: {

      },
      donutChartData: [],
    };
  },
  created() {
    this.fetchAssets();
  },
  mounted() {
    this.fetchAssetData();
  },
  methods: {
    async fetchAssetData() {
      try {
        const response = await axios.get('http://localhost:3000/temp');
        this.assetData = response.data.map(item => ({
          date: item.date,
          amount: item.amount,
        }));
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
      }
    },
    async fetchAssets() {
      try {
        const response = await axios.get('http://localhost:3000/temp');
        if (response.data && Array.isArray(response.data)) {
          this.assets = response.data;
          this.groupAssets();
          this.prepareChartData();
          this.prepareDonutChartData();
        } else {
          console.error('올바르지 않은 데이터 형식:', response.data);
        }
      } catch (error) {
        console.error('자산 데이터를 가져오는 데 실패했습니다:', error);
      }
    },
    groupAssets() {
      if (!Array.isArray(this.assets)) {
        console.error('자산 데이터가 배열이 아닙니다:', this.assets);
        return;
      }

      this.groupedAssets = {
        cash: { total: 0, unpaid: 0 },
        bank: { total: 0, unpaid: 0 },
      };

      this.assets.forEach(asset => {
        if (asset.asset === 'cash' && asset.type === 'income') {
          this.groupedAssets.cash.total += asset.amount;
        } else if (asset.asset === 'cash' && asset.type === 'expense') {
          this.groupedAssets.cash.total -= asset.amount;
        } else if (asset.asset === 'bank' && asset.type === 'income') {
          this.groupedAssets.bank.total += asset.amount;
        } else if (asset.asset === 'bank' && asset.type === 'expense') {
          this.groupedAssets.bank.total -= asset.amount;
        }
      });
    },
    prepareChartData() {
      if (!Array.isArray(this.assets)) {
        console.error('자산 데이터가 배열이 아닙니다:', this.assets);
        return;
      }

      const sortedAssets = [...this.assets].sort((a, b) => new Date(a.date) - new Date(b.date));
      let cumulativeAmount = 0;

      this.groupedAssets.chartData = sortedAssets.map(asset => {
        if (asset.type === 'income') {
          cumulativeAmount += asset.amount;
        } else if (asset.type === 'expense') {
          cumulativeAmount -= asset.amount;
        }
        return {
          date: asset.date,
          amount: cumulativeAmount,
        };
      });

      console.log('차트 데이터 준비 완료:', this.groupedAssets.chartData);
    },
    prepareDonutChartData() {
      const totalCash = this.groupedAssets.cash.total;
      const totalBank = this.groupedAssets.bank.total;
      const totalAssets = totalCash + totalBank;

      this.donutChartData = [
        {
          label: '현금',
          value: totalCash,
        },
        {
          label: '은행',
          value: totalBank,
        },
      ];

      console.log('도넛 차트 데이터 준비 완료:', this.donutChartData);
    },
  },
};
</script>



<style scoped>
/* 부모 요소들의 높이를 설정하여 자식 요소들이 100% 높이를 가질 수 있도록 함 */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  /* 전체 화면 높이로 설정 */
  padding: 20px;
}

.assets-overview {
  display: flex;
  flex-direction: row;
  /* 수평 정렬 */
  justify-content: space-between;
  /* 양쪽으로 정렬 */
  align-items: stretch;
  /* 자식 요소들이 부모 요소의 높이에 맞추도록 설정 */
  height: 100%;
  /* 전체 높이 */
  gap: 20px;
  /* 카드와 요약 사이의 간격 */
}


.asset-cards {
  display: flex;
  flex-direction: column;

  height: 100%;
  /* 부모 요소의 높이에 맞추도록 설정 */
  width: 30%;
  /* 좌측 카드 영역의 비율 */
  justify-content: flex-start;
  /* 카드들이 상단에 정렬되도록 설정 */

}

.asset-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  /* 카드 사이에 간격 추가 */
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

.details span {
  font-size: 1em;
}

.asset-summary {
  flex: 1;
  /* 우측 요약 영역이 나머지 공간을 차지 */
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  padding: 24px;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.asset-summary h1 {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  max-width: 600px;
}
</style>
