<template>
  <div class="hello">
    <div v-for="(item, index) in booklist" :key="index" class="booklist" @click="todetail(item)">
      {{item.title}}
    </div>

    <div>
      {{title}}
      <div v-for="(item, index) in detaillist" :key="index">
{{item.read_seconds}}
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'HelloWorld',
    props: {
      msg: String,
    },
    data() {
    return {
      booklist: [] ,// 存储读取的JSON数据
      recordlist:[],
      title:'',
      detaillist:[]
    };
  },
    mounted() {
      this.loadJsonData();
    },
    methods: {
      async loadJsonData() {
       
         try {
          // 请求public目录下的ziyuan.json（/代表public根目录）
          const response = await axios.get('/book.json');
          this.booklist = response.data; // 赋值到data中
          console.log('读取成功：', this.booklist);
        } catch (error) {
          console.error('读取失败：', error);
          this.jsonData = '读取失败，请检查文件路径';
        }
         try {
          // 请求public目录下的ziyuan.json（/代表public根目录）
          const response = await axios.get('/read_record.json');
          this.recordlist = response.data; // 赋值到data中
          console.log('读取成功：', this.recordlist);
        } catch (error) {
          console.error('读取失败：', error);
          this.jsonData = '读取失败，请检查文件路径';
        }
         const responsec = await axios.get('https://gitee.com/myquicktime/testWEEX/blob/newmaster/src/json/data/launcher.json');
          console.log(responsec)
        // https://gitee.com/myquicktime/testWEEX/blob/newmaster/src/json/data/launcher.json
      },
      todetail(item){
        this.title=item.title
       this.detaillist= this.recordlist.filter((record)=>{
        console.log(record.book_id)
        console.log(item.id)
          return record.book_id==item.id

        })
        console.log(this.detaillist)

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .booklist{
    height: 60px;
  margin: 5px;
  background-color: bisque;
  }
</style>