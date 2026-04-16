<template>
  <div class="wrap">
    <!-- 日期变换 -->
    <div style="display: flex;justify-content: space-around;align-items: center;  height: 50px;background-color: white;
    margin: 0 auto;width: 330px;border-radius: 5px;">
      <div @click="lastDay">＜</div>
      <div>{{targetDateStr[0]}}-{{targetDateStr[6]}}</div>
      <div @click="nextDay">＞</div>
    </div>
    <!-- 中间四个数值 -->
    <div style="margin: 0 auto;width: 330px;">
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
    <div style="margin: 0 auto;width: 330px;">
      本周阅读记录
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
        // const remainingSeconds = seconds % 60; // 计算剩余秒数
        return `${hours}时${minutes}分`;
      }
    },
    data() {
      return {
        targetDateStr: [],
        recordlist: [],
        bookdailyToshow: [],
        summonth: 0
      };
    },
    mounted() {
      // 获取所有阅读记录
      this.dataget()
      // 获取本周所有日期
      this.targetDateStr = this.getThisWeekRange()
      // 处理本周阅读记录
      this.weekdataInit()
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
      lastDay() {
        let newtargetDate = []
        for (let i = 0; i < 7; i++) {
          let currentDate = new Date(this.targetDateStr[i]);
          currentDate.setDate(currentDate.getDate() - 7)
          newtargetDate.push(this.formatDate(currentDate));
        }
        this.targetDateStr = newtargetDate
        this.weekdataInit()
      },
      // 下周
      nextDay() {
        let newtargetDate = []
        for (let i = 0; i < 7; i++) {
          let currentDate = new Date(this.targetDateStr[i]);
          currentDate.setDate(currentDate.getDate() + 7)
          newtargetDate.push(this.formatDate(currentDate));
        }
        this.targetDateStr = newtargetDate
        this.weekdataInit()
      },

      // 下方都是数据处理方法

      timestampToDateStr(timestamp) {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，补0
        const day = String(date.getDate()).padStart(2, '0') // 日期补0
        return `${year}-${month}-${day}`
      },
      sumByDay(list) {
        return list.reduce((res, item) => {
          const key = item.date;
          res[key] = (res[key] || 0) + item.read_seconds;
          return res;
        }, {})
      },
      mergeByBookId(arr) {
        this.summonth=0
        const map = {};
        arr.forEach(item => {
          const key = item.book_id;
          if (!map[key]) {
            map[key] = { ...item }; // 第一次出现，直接存
          } else {
            map[key].read_seconds += item.read_seconds; // 累加秒数
          }
          //统计本周总时长
          this.summonth+=item.read_seconds
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