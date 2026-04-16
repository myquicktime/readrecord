<template>
  <div class="hello">
    <!-- <div style="display: flex;flex-direction: row;justify-content: space-between;background-color: pink;">
      <div>我的书架</div>
      <div @click="loadJsonData">刷新</div>
    </div> -->
    <div v-show="!showTime">
      <div style="display: flex;flex-direction: row;justify-content: space-between;background-color: pink;">
      <div>我的书架</div>
      <div @click="loadJsonData">刷新</div>
    </div>
      <div v-for="(item, index) in bookdata" :key="index" class="bookitem" @click="todetail(item)">
        <div>{{item.title}}</div>
        <div>{{item.author}}</div>
        <div>{{item.alltime|timechange}}</div>
        <!-- {{item.section_num}} -->
        <!-- {{item.read_finish_time}} -->
      </div>
    </div>

    <bookList></bookList>
    <bookTime v-if="showTime"  :detailitem="detailitem" @goback="goback"></bookTime>
    <ceshi></ceshi>
    <ceshi2></ceshi2>
  </div>
</template>

<script>
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
      bookList,
      bookTime,
      ceshi,
      ceshi2
    },
    filters: {
      timechange(seconds) {
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
        showTime: false,
        bookdata: [],
      };
    },
    mounted() {
      // this.loadJsonData();
      this.getdata()
    },
    methods: {
      async loadJsonData() {
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
          localStorage.setItem('recordlist', JSON.stringify(recorddata))

          console.log("读取成功", recorddata)
        } catch (err) {
          console.error("读取失败", err)
        }
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
        console.log(bookdata)
        // 排序
        bookdata.sort((a, b) => {
          return b.alltime - a.alltime;
        });
        this.bookdata = bookdata
        localStorage.setItem('bookdata', JSON.stringify(bookdata))
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
        console.log(this.detailitem)
        this.showTime = true

      },
      goback(){
        this.showTime=false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bookitem {
    /* height: 60px; */
    margin: 20px 5px;
    background-color: bisque;
    text-align: left;
  }
</style>