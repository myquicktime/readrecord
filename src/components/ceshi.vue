<template>
  <div class="heatmap">
    <div
      v-for="item in days"
      :key="item.date"
      class="cell"
      :style="{ background: getColor(item.count) }"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 你的数据
      dataMap: {
        '2025-01-01': 3,
        '2025-01-02': 5
      }
    }
  },
  computed: {
    days() {
      // 生成一年的日期数组
      return this.getYearDays().map(date => ({
        date,
        count: this.dataMap[date] || 0
      }))
    }
  },
  methods: {
    getColor(count) {
      if (count >= 8) return '#196127'
      if (count >= 5) return '#239a3b'
      if (count >= 1) return '#7bc96f'
      return '#ebedf0'
    },
    getYearDays() {
      // 生成全年日期
      let days = []
      let date = new Date(2025, 0, 1)
      while (date.getFullYear() === 2025) {
        days.push(date.toISOString().split('T')[0])
        date.setDate(date.getDate() + 1)
      }
      return days
    }
  }
}
</script>

<style>
.heatmap {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>