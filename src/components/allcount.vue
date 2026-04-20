<template>
  <div class="wrap">

    <div style="margin: 0 auto;width: 93%;">
      <div style="display: flex;justify-content: space-between;">
        <div class="readbox">
          <div>{{sumall|timechange}}</div>
          <div>阅读书籍</div>
        </div>
        <div class="readbox">
          <div>{{bookdailyToshow.length}}</div>
          <div>总阅读书籍</div>
        </div>
      </div>
    </div>
    <div style="margin: 0 auto;width: 93%;text-align: left;height: 40px;line-height: 40px;">
      阅读记录
    </div>
    <div style="margin: 0 auto;width: 93%;">
      <div v-for="(item, index) in bookdailyToshow" :key="index" class="booklist">
        <div>{{index+1}}</div>
        <div>{{item.bookname}}</div>
        <div>{{item.read_seconds|timechange}}</div>
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'allcount',
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
        sumall: 0
      };
    },
    mounted() {
      // 获取所有阅读记录
      this.dataget()
      // 处理所有阅读记录
      this.yeardataInit()
    },
    methods: {
      // 获取所有阅读记录
      dataget() {
        let recordlist = localStorage.getItem('recordlist');
        this.recordlist = JSON.parse(recordlist) || [];
      },
      // 处理本年阅读记录
      yeardataInit() {
        // 将同一本书的记录相加
        this.bookdailyToshow = this.mergeByBookId(this.recordlist)
        // 排序
        this.bookdailyToshow.sort((a, b) => {
          return b.read_seconds - a.read_seconds;
        });
      },

      // 下方都是数据处理方法

      // 将同一本书的记录相加
      mergeByBookId(arr) {
        this.sumall = 0
        const map = {};
        arr.forEach(item => {
          const key = item.book_id;
          if (!map[key]) {
            map[key] = { ...item }; // 第一次出现，直接存
          } else {
            map[key].read_seconds += item.read_seconds; // 累加秒数
          }
          //统计总时长
          this.sumall += item.read_seconds
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