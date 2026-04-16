<template>
  <div class="heatmap-box">
    <!-- 图表容器：必须给宽高 -->
    <div ref="chart" style="width: 100%; height: 150px;"></div>
  </div>
</template>

<script>
  // 引入 echarts
  import * as echarts from 'echarts'

  export default {
    name: 'CalendarHeatmap',
    data() {
      return {
        myChart: null, // 图表实例
        // 热力数据：[日期, 数值]
        heatData: [
          ['2025-01-01', 4],
          ['2025-01-05', 2],
          ['2025-02-10', 8],
          ['2025-03-15', 10000],
          ['2025-04-18', 30000],
          ['2025-05-20', 35000],
          ['2025-06-01', 28800],
        ]
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      // 销毁图表，防止内存泄漏
      if (this.myChart) {
        this.myChart.dispose()
      }
    },
    methods: {
      initChart() {
        // 初始化
        this.myChart = echarts.init(this.$refs.chart)

        // 配置项
        const option = {
          // 颜色范围
          visualMap: {
            min: 0,
            max: 36000,
            show: false, // 不显示颜色条
            inRange: {
              // GitHub 风格颜色
              color: [ '#c6e48b', '#7bc96f', '#239a3b', '#196127']
            }
          },
          // 日历配置
          calendar: {
            range: ['2025-01-01', '2025-06-30'], // 显示哪一年
            cellSize: [14, 14], // 每个格子大小
            top: 40,
            left: 20,
            right: 2,
            itemStyle: {
              color: '#ebedf0',
              borderWidth: 2,
              borderColor: '#fff'
            },
            splitLine: {
              show: false
            },
            dayLabel: {
              //   show: false
              color: '#787171',
               firstDay:1
            },
            monthLabel: {
              //   show: false
              color: '#787171'


            }
          },
          // 热力系列
          series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: this.heatData,
            tooltip: {
              formatter: '{b}: {c} 次'
            }
          }
        }

        // 渲染
        this.myChart.setOption(option)

        // 响应式
        window.addEventListener('resize', () => {
          this.myChart.resize()
        })
      }
    }
  }
</script>

<style scoped>
  .heatmap-box {
    width: 95%;
    margin: 30px auto;
    /* padding: 10px; */
    background: #fff;
    border-radius: 8px;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); */
  }
</style>