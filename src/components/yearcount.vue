<template>
  <div class="wrap">
    <!-- 日期变换 -->
    <div style="display: flex;justify-content: space-around;align-items: center;  height: 50px;background-color: white;
    margin: 0 auto;width: 330px;border-radius: 5px;">
      <div @click="lastYear">＜</div>
      <div>{{targetDateStr}}</div>
      <div @click="nextYear">＞</div>
    </div>
    <!-- 中间四个数值 -->
    <div style="margin: 0 auto;width: 330px;">
      <div style="display: flex;justify-content: space-between;">
        <div class="readbox">
          <div>{{sumyear|timechange}}</div>
          <div>本年阅读</div>
        </div>
        <div class="readbox">
          <div>{{bookdailyToshow.length}}</div>
          <div>本年阅读书籍</div>
        </div>
      </div>
    </div>
    <div ref="yearchart" style="width: 100%; height: 150px;"></div>

    <div style="margin: 0 auto;width: 330px;">
      本年阅读记录
    </div>
    <div style="margin: 0 auto;width: 330px;">

      <div v-for="(item, index) in bookdailyToshow" :key="index" class="booklist">
        <div>{{index+1}}</div>
        <div>{{item.bookname}}</div>
        <div>{{item.read_seconds|timechange}}</div>
      </div>
    </div>
  </div>
</template>

<script>

  import * as echarts from 'echarts'

  export default {
    name: 'yearcount',
    props: {
      msg: String,
    },
    filters: {
      timechange(seconds) {
        if (!seconds) {
          return 0
        }
        const hours = Math.floor(seconds / 3600); // 计算小时数
        const minutes = Math.floor((seconds % 3600) / 60); // 计算剩余分钟数
        // const remainingSeconds = seconds % 60; // 计算剩余秒数
        return `${hours}时${minutes}分`;
      }
    },
    data() {
      return {
        targetDateStr: '',
        recordlist: [],
        bookdailyToshow: [],
        sumyear: 0,
        myChart: null, // 图表实例
        sumdaylist: [],
        heatData: []
      };
    },
    mounted() {
      // 获取所有阅读记录
      this.dataget()
      // 获取本年
      let today = Date.now()
      this.targetDateStr = this.timestampToDateStr(today)
      // 处理本年阅读记录
      this.yeardataInit()
      this.echartsinit()
    },
    methods: {
      // 获取所有阅读记录
      dataget() {
        let recordlist = localStorage.getItem('recordlist');
        this.recordlist = JSON.parse(recordlist) || [];
        let sumdaylist = localStorage.getItem('sumdaylist');
        this.sumdaylist = JSON.parse(sumdaylist) || [];
      },
      // 处理本年阅读记录
      yeardataInit() {
        // 获取本年的记录
        this.bookdailyToshow = this.recordlist.filter(
          (item) => {
            return item.date.substring(0, 4) === this.targetDateStr

          }
        )
        // 将本年同一本书的记录相加
        this.bookdailyToshow = this.mergeByBookId(this.bookdailyToshow)
        // 排序
        this.bookdailyToshow.sort((a, b) => {
          return b.read_seconds - a.read_seconds;
        });
      },
      // 上年
      lastYear() {
        this.targetDateStr = String(Number(this.targetDateStr) - 1)
        this.yeardataInit()
      },
      // 下年
      nextYear() {
        this.targetDateStr = String(Number(this.targetDateStr) + 1)
        this.yeardataInit()
      },
      echartsinit() {
        // 获取图表数据
        const dateKeys = Object.keys(this.sumdaylist);
        for (let i = 0; i < dateKeys.length; i++) {
          let item = [dateKeys[i], this.sumdaylist[dateKeys[i]]]
          this.heatData.push(item)
        }

        // 图表绘制
        // 🔥 防止在同一个 DOM 元素上，已经存在一个 ECharts 实例，你重复初始化了，导致冲突。
        const existingInstance = echarts.getInstanceByDom(this.$refs.yearchart);
        if (existingInstance) {
          existingInstance.dispose();
        }
        // 初始化
        this.myChart = echarts.init(this.$refs.yearchart)

        // 配置项
        const option = {
          // 颜色范围
          visualMap: {
            min: 0,
            max: 36000,
            show: false, // 不显示颜色条
            inRange: {
              // GitHub 风格颜色
              color: ['#c6e48b', '#7bc96f', '#239a3b', '#196127']
            }
          },
          // 日历配置
          calendar: {
            range: ['2026-01-01', '2026-06-30'], // 显示哪一年
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
              firstDay: 1
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
      },

      // 下方都是数据处理方法

      timestampToDateStr(timestamp) {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        return `${year}`
      },
      mergeByBookId(arr) {
        this.sumyear = 0
        const map = {};
        arr.forEach(item => {
          const key = item.book_id;
          if (!map[key]) {
            map[key] = { ...item }; // 第一次出现，直接存
          } else {
            map[key].read_seconds += item.read_seconds; // 累加秒数
          }
          //统计本年总时长
          this.sumyear += item.read_seconds
        });
        // 转回数组
        return Object.values(map);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrap {
    width: 100%;
    height: 100%;
    background: rgb(244, 244, 244);
    /* margin: 10px; */
    /* background-color: #b44040; */
  }

  .readbox {
    height: 60px;
    width: 150px;
    border-radius: 5px;
    margin: 5px 0;
    background: white;
  }

  .booklist {
    /* height: 60px; */
    background: rgb(242, 226, 227);
    /* width: 80%; */
    margin: 5px 0;
    border-radius: 5px;
    text-align: left;
  }
</style>