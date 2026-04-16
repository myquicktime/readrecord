<template>
  <div class="wrap">
    <!-- 日期变换 -->
    <div style="display: flex;justify-content: space-around;align-items: center;  height: 50px;background-color: white;
    margin: 0 auto;width: 330px;border-radius: 5px;">
      <div @click="lastDay">＜</div>
      <div>{{targetDateStr}}</div>
      <div @click="nextDay">＞</div>
    </div>
    <!-- 中间四个数值 -->
    <div style="margin: 0 auto;width: 330px;">
      <div style="display: flex;justify-content: space-between;">
        <div class="readbox">
          <div>{{summonth|timechange}}</div>
          <div>本月阅读</div>
        </div>
        <div class="readbox">
          <div>{{bookdailyToshow.length}}</div>

          <div>本月阅读书籍</div>
        </div>
      </div>
    </div>
    <div style="margin: 0 auto;width: 330px;">
      本月阅读记录
    </div>
    <div style="margin: 0 auto;width: 330px;">

      <div v-for="(item, index) in bookdailyToshow" :key="index" class="booklist">
        <div>{{item.bookname}}</div>
        <div>{{item.read_seconds|timechange}}</div>
      </div>
    </div>
  </div>
</template>

<script>


  // import axios from 'axios';
  export default {
    name: 'monthcount',
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
        summonth: 0
      };
    },
    mounted() {
      // 获取所有阅读记录
      this.dataget()
      // 获取本月
      let today = Date.now()
      this.targetDateStr = this.timestampToDateStr(today)
      // 处理本月阅读记录
      this.monthdataInit()
    },
    methods: {
      // 获取所有阅读记录
      dataget() {
        let recordlist = localStorage.getItem('recordlist');
        this.recordlist = JSON.parse(recordlist) || [];
      },
      // 处理本月阅读记录
      monthdataInit() {
        // 获取本月的记录
        this.bookdailyToshow = this.recordlist.filter(
          (item) => {
            return item.date.substring(0, 7) === this.targetDateStr

          }
        )
        // 将本月同一本书的记录相加
        this.bookdailyToshow = this.mergeByBookId(this.bookdailyToshow)
        // 排序
        this.bookdailyToshow.sort((a, b) => {
          return b.read_seconds - a.read_seconds;
        });
      },
      // 上月
      lastDay() {
        this.targetDateStr = this.getNearMonth('last')
        this.monthdataInit()
      },
      // 下月
      nextDay() {

        this.targetDateStr = this.getNearMonth('next')
        this.monthdataInit()
      },

      // 下方都是数据处理方法

      timestampToDateStr(timestamp) {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，补0
        return `${year}-${month}`
      },
      sumByDay(list) {
        return list.reduce((res, item) => {
          const key = item.date;
          res[key] = (res[key] || 0) + item.read_seconds;
          return res;
        }, {})
      },
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
          //统计本月总时长
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
      },
       //获取相邻的年月即2026-04.获取2026=03和2026-05
      getNearMonth(type) {
        const [year, month] = this.targetDateStr.split('-').map(Number)
        // 格式化补 0
        const fmt = (y, m) => `${y}-${String(m).padStart(2, '0')}`
        // 上月
        if (type == 'last') {
          let lastYear = year
          let lastMonth = month - 1
          if (lastMonth < 1) {
            lastYear--
            lastMonth = 12
          }
          // 格式化补 0
          return fmt(lastYear, lastMonth)
        }
        // 下月
        if (type == 'next') {
          let nextYear = year
          let nextMonth = month + 1
          if (nextMonth > 12) {
            nextYear++
            nextMonth = 1
          }
          // 格式化补 0
          return fmt(nextYear, nextMonth)
        }
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