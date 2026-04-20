<template>
  <div class="wrap">
    <!-- 日期变换 -->
    <div style="display: flex;justify-content: space-around;align-items: center;  height: 50px;background-color: white;
    margin: 0 auto;width: 93%;border-radius: 5px;">
      <div @click="lastWeek">＜</div>
      <div>{{targetDateStr[0]}}-{{targetDateStr[6]}}</div>
      <div @click="nextWeek">＞</div>
    </div>
    <!-- 中间四个数值 -->
    <div style="margin: 0 auto;width: 93%;">
      <div style="display: flex;justify-content: space-between;">
        <div class="readbox">
          <div>{{summonth|timechange}}</div>
          <div>本周阅读</div>
        </div>
        <div class="readbox">
          <div>{{bookdailyToshow.length}}</div>
          <div>本周阅读书籍</div>
        </div>
      </div>
    </div>
    <div ref="weekchart" style="width: 93%; height: 210px;margin:  0 auto;background-color: white;border-radius: 5px;">
    </div>

    <div style="margin: 0 auto;width: 93%;text-align: left;height: 40px;line-height: 40px;">
      本周阅读记录
    </div>
    <div style="margin: 0 auto;width: 93%;">
      <div v-for="(item, index) in bookdailyToshow" :key="index" class="booklist">
        <div>{{item.bookname}}</div>
        <div>{{item.read_seconds|timechange}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'

  export default {
    name: 'weekcount',
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
        return `${hours}时${minutes}分`;
      }
    },
    data() {
      return {
        targetDateStr: [],
        recordlist: [],
        bookdailyToshow: [],
        summonth: 0,
        myChart: null, // 图表实例
        sumdaylist: []
      };
    },
    mounted() {
      // 获取所有阅读记录
      this.dataget()
      // 获取本周所有日期
      this.targetDateStr = this.getThisWeekRange()
      // 处理本周阅读记录
      this.weekdataInit()
      // 本周柱状图绘制
      this.echartsinit()
    },
    methods: {
      // 获取本周所有日期
      getThisWeekRange() {
        const now = new Date();
        const day = now.getDay();

        // 计算本周一
        const monday = new Date(now);
        monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));

        const week = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          week.push(this.formatDate(date));
        }
        return week;
      },
      // 获取所有阅读记录
      dataget() {
        let recordlist = localStorage.getItem('recordlist');
        this.recordlist = JSON.parse(recordlist) || [];
        let sumdaylist = localStorage.getItem('sumdaylist');
        this.sumdaylist = JSON.parse(sumdaylist) || [];
      },
      // 处理本周阅读记录
      weekdataInit() {
        // 获取本周的记录
        this.bookdailyToshow = this.recordlist.filter(
          (item) => {
            if (this.targetDateStr.includes(item.date)) {
              return item
            }
          }
        )
        // 将本周同一本书的记录相加
        this.bookdailyToshow = this.mergeByBookId(this.bookdailyToshow)
        // 排序
        this.bookdailyToshow.sort((a, b) => {
          return b.read_seconds - a.read_seconds;
        });
      },
      // 上周
      lastWeek() {
        let newtargetDate = []
        for (let i = 0; i < 7; i++) {
          let currentDate = new Date(this.targetDateStr[i]);
          currentDate.setDate(currentDate.getDate() - 7)
          newtargetDate.push(this.formatDate(currentDate));
        }
        this.targetDateStr = newtargetDate
        this.weekdataInit()
        this.echartsinit()
      },
      // 下周
      nextWeek() {
        let newtargetDate = []
        for (let i = 0; i < 7; i++) {
          let currentDate = new Date(this.targetDateStr[i]);
          currentDate.setDate(currentDate.getDate() + 7)
          newtargetDate.push(this.formatDate(currentDate));
        }
        this.targetDateStr = newtargetDate
        this.weekdataInit()
        this.echartsinit()
      },
      // 本周柱状图绘制
      echartsinit() {
        // 获取图表数据
        let echartdata = []
        for (let i = 0; i < 7; i++) {
          let sumday = this.sumdaylist[this.targetDateStr[i]]
          echartdata.push(sumday / 60)
        }
        // 🔥 防止在同一个 DOM 元素上，已经存在一个 ECharts 实例，你重复初始化了，导致冲突。
        const existingInstance = echarts.getInstanceByDom(this.$refs.weekchart);
        if (existingInstance) {
          existingInstance.dispose();
        }
        // 图表绘制
        this.myChart = echarts.init(this.$refs.weekchart)

        // 2. 配置项
        const option = {
          // 提示框（鼠标悬浮显示）
          tooltip: {},
          // X轴
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
          },
          // Y轴
          yAxis: {
            // 分割线
            splitLine: {
              lineStyle: {
                color: '#E5E5E5',  // Y轴横线颜色
                width: '0.5'
              }
            }
          },
          // 内边距
          grid: {
            left: '5%',
            right: '5%',
            top: '12%',
            bottom: '10%',
            containLabel: true
          },
          // 数据系列（柱状图核心）
          series: [
            {
              type: 'bar', // 指定图表类型：柱状图
              data: echartdata,
              // 柱子宽度
              barWidth: '20',
              // 柱子样式
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#f2e2e3' },
                  { offset: 0.5, color: '#f2e2e3' },
                  { offset: 1, color: '#f2e2e3' }
                ]),
                borderRadius: [4, 4, 0, 0], // 顶部圆角，底部直角
              },
            }
          ]
        };
        // 渲染
        this.myChart.setOption(option)

        // 响应式
        window.addEventListener('resize', () => {
          this.myChart.resize()
        })
      },
      // 下方都是数据处理方法

      mergeByBookId(arr) {
        this.summonth = 0
        const map = {};
        arr.forEach(item => {
          const key = item.book_id;
          if (!map[key]) {
            map[key] = { ...item }; // 第一次出现，直接存
          } else {
            map[key].read_seconds += item.read_seconds; // 累加秒数
          }
          //统计本周总时长
          this.summonth += item.read_seconds
        });
        // 转回数组
        return Object.values(map);
      },
      formatDate(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const d_ = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${d_}`;
      }
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
    height: 45px;
    width: 170px;
    border-radius: 5px;
    margin: 5px 0;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 10px 0;
  }

  .booklist {
    background: rgb(242, 226, 227);
    margin: 10px 0;
    border-radius: 5px;
    text-align: left;
    padding: 8px 10px;
    box-sizing: border-box;
  }
</style>