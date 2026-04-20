<template>
  <div class="hello">
    <div v-show="showTime==1">
      <!-- <div style="display: flex;flex-direction: row;justify-content: space-between;background-color: pink;">
        <div>我的书架</div>
        <div @click="gotocount">统计</div>
        <div @click="loadJsonData">刷新</div>
      </div> -->
      <div
        style="display: flex;flex-direction: row;justify-content: space-between;background-color: #e8d9db;height: 45px;line-height: 45px;">
        <div style="width: 60px;text-align: center;" @click="gotocount">统计</div>
        <div style="width: 100px;">我的书架</div>
        <div style="width: 60px;" @click="loadJsonData">刷新</div>
      </div>
      <div v-for="(item, index) in bookdata" :key="index" class="bookitem" @click="todetail(item)">
        <div>{{item.title}}</div>
        <div>{{item.author}}</div>
        <div>{{item.alltime|timechange}}</div>
      </div>
    </div>

    <bookcount v-if="showTime==3" @goback="goback"></bookcount>
    <bookList></bookList>
    <bookTime v-if="showTime==2" :detailitem="detailitem" @goback="goback"></bookTime>
    <ceshi v-if="showTime==4"></ceshi>
    <ceshi2 v-if="showTime==4"></ceshi2>
  </div>
</template>

<script>
  import bookcount from './bookcount.vue'
  import bookList from './bookList.vue'
  import bookTime from './bookTime.vue'
  import ceshi from './ceshi.vue'
  import ceshi2 from './ceshi2.vue'

  // import axios from 'axios';
  export default {
    name: 'HelloWorld',
    props: {
      msg: String,
    },
    components: {
      bookcount,
      bookList,
      bookTime,
      ceshi,
      ceshi2
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
        booklist: [],// 存储读取的JSON数据
        recordlist: [],
        title: '',
        detailitem: [],
        showTime: 3,
        bookdata: [],
        sumdaylist: []
      };
    },
    mounted() {
      this.getdata()
    },
    methods: {
      async loadJsonData() {
        localStorage.removeItem('booklist');
        localStorage.removeItem('recordlist');
        localStorage.removeItem('bookdata');

        try {
          let bookres = await fetch('https://buuqtcp111ku7t3r.public.blob.vercel-storage.com/book.json')
          let bookdata = await bookres.json()
          this.booklist = bookdata; // 赋值到data中
          localStorage.setItem('booklist', JSON.stringify(bookdata))

          console.log("读取成功", bookdata)
        } catch (err) {
          console.error("读取失败", err)
        }
        try {
          let recordres = await fetch('https://buuqtcp111ku7t3r.public.blob.vercel-storage.com/read_record.json')
          let recorddata = await recordres.json()
          this.recordlist = recorddata; // 赋值到data中
          // localStorage.setItem('recordlist', JSON.stringify(recorddata))

          console.log("读取成功", recorddata)
        } catch (err) {
          console.error("读取失败", err)
        }

        // 获取每本书的阅读详情
        const bookdata = [];
        this.booklist.forEach(book => {
          let alltime = 0
          // 筛选出当前这本书的所有阅读记录
          const records = this.recordlist.filter(record => {
            if (record.book_id === book.id) {
              alltime = alltime + record.read_seconds
            }
            return record.book_id === book.id
          });
          book.records = records
          book.alltime = alltime
          // 组装成 书籍 + 阅读记录 的结构
          bookdata.push(book);
        });
        // 排序
        bookdata.sort((a, b) => {
          return b.alltime - a.alltime;
        });
        this.bookdata = bookdata
        localStorage.setItem('bookdata', JSON.stringify(bookdata))

        // 将每本书的书名填入阅读记录中
        this.recordlist.map(record => {
          this.booklist.find(book => {
            if (book.id == record.book_id) {
              record.bookname = book.title
            }
          })
        })
        localStorage.setItem('recordlist', JSON.stringify(this.recordlist))

        // 获取每天的总时长
        this.sumdaylist = this.sumByDay(this.recordlist)
        localStorage.setItem('sumdaylist', JSON.stringify(this.sumdaylist))

        this.getdata()


        // 获取每月的总时长
        let summonthlist = this.sumByMonth(this.recordlist)
        localStorage.setItem('summonthlist', JSON.stringify(summonthlist))

        // 获取每年的总时长
        let sumyearlist = this.sumByYear(this.recordlist)
        localStorage.setItem('sumyearlist', JSON.stringify(sumyearlist))


      },
      getdata() {
        let booklist = localStorage.getItem('booklist');
        this.booklist = JSON.parse(booklist) || [];

        let recordlist = localStorage.getItem('recordlist');
        this.recordlist = JSON.parse(recordlist) || [];

        let bookdata = localStorage.getItem('bookdata');
        this.bookdata = JSON.parse(bookdata) || [];

      },
      todetail(item) {
        this.detailitem = item
        this.showTime = 2
      },
      goback() {
        this.showTime = 1
      },
      gotocount() {
        this.showTime = 3
      },


      // 数据处理
      sumByDay(list) {
        return list.reduce((res, item) => {
          const key = item.date;
          res[key] = (res[key] || 0) + item.read_seconds;
          return res;
        }, {})
      },

      sumByMonth(list) {
        return list.reduce((res, item) => {
          const key = item.date.substring(0, 7);
          res[key] = (res[key] || 0) + item.read_seconds;
          return res;
        }, {})
      },
      sumByYear(list) {
        return list.reduce((res, item) => {
          const key = item.date.substring(0, 4);
          res[key] = (res[key] || 0) + item.read_seconds;
          return res;
        }, {})
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bookitem {
    margin: 10px auto;
    background: rgb(242, 226, 227);
    text-align: left;
    width: 93%;
    padding: 8px 10px;
    border-radius: 5px;
    box-sizing: border-box;

  }
</style>