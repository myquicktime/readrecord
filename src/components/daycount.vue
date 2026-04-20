<template>
  <div class="wrap">
    <!-- 日期变换 -->
    <div style="display: flex;justify-content: space-around;align-items: center;  height: 50px;background-color: white;
    margin: 0 auto;width: 93%;border-radius: 5px;">
      <div @click="lastDay">＜</div>
      <div>{{targetDateStr}}</div>
      <div @click="nextDay">＞</div>
    </div>
    <!-- 中间四个数值 -->
    <div style="margin: 0 auto;width: 93%;">
      <div style="display: flex;justify-content: space-between;">
        <div class="readbox">
          <div>{{sumdaylist[targetDateStr]|timechange}}</div>
          <div>今日阅读</div>
        </div>
        <div class="readbox">
          <div>{{bookdailyToshow.length}}</div>
          <div>今日阅读书籍</div>
        </div>
      </div>
    </div>
    <div style="margin: 0 auto;width: 93%;text-align: left;height: 40px;line-height: 40px;">
      今日阅读记录
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
  export default {
    name: 'daycount',
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
        targetDateStr: '',
        recordlist: [],
        bookdailyToshow: [],
        sumdaylist: []
      };
    },
    mounted() {
      //获取数据表
      this.dataget()
      // 获取今天日期
      let today = Date.now()
      this.targetDateStr = this.timestampToDateStr(today)
      // 获取每天阅读总时长
      this.sumdaylist = this.sumByDay(this.recordlist)
      // 获取本日阅读记录
      this.dailydataInit(this.targetDateStr)
    },
    methods: {
      dataget() {
        let recordlist = localStorage.getItem('recordlist');
        this.recordlist = JSON.parse(recordlist) || [];
      },
      dailydataInit(targetDateStr) {
        this.bookdailyToshow = this.recordlist.filter(
          item => {
            return item.date === targetDateStr
          }
        )
      },
      // 昨天
      lastDay() {
        let currentDate = new Date(this.targetDateStr)
        currentDate.setDate(currentDate.getDate() - 1)
        this.targetDateStr = this.timestampToDateStr(currentDate.getTime())
        this.dailydataInit(this.targetDateStr)
      },
      // 明天
      nextDay() {
        let currentDate = new Date(this.targetDateStr)
        currentDate.setDate(currentDate.getDate() + 1)
        this.targetDateStr = this.timestampToDateStr(currentDate.getTime())
        this.dailydataInit(this.targetDateStr)
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