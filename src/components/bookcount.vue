<template>
  <div class="wrap">
    <div style="display: flex;flex-direction: row;justify-content: space-between;background-color: pink;">
      <div>我的统计</div>
      <div @click="goback">返回</div>
    </div>
    <div style="display: flex;flex-direction: row;">

      <div style="width: 50px;height: 50px;line-height: 50px;" @click="changecount('day')">日</div>
      <div style="width: 50px;height: 50px;line-height: 50px;" @click="changecount('week')">周</div>
      <div style="width: 50px;height: 50px;line-height: 50px;" @click="changecount('month')">月</div>
      <div style="width: 50px;height: 50px;line-height: 50px;" @click="changecount('year')">年</div>
      <div style="width: 50px;height: 50px;line-height: 50px;" @click="changecount('all')">总</div>
    </div>
    <daycount v-show="showcount=='day'"></daycount>
    <weekcount v-if="showcount=='week'"></weekcount>
    <monthcount v-if="showcount=='month'"></monthcount>
    <yearcount v-if="showcount=='year'"></yearcount>
    <allcount v-show="showcount=='all'"></allcount>



  </div>
</template>

<script>
  import daycount from './daycount.vue'
  import weekcount from './weekcount.vue'
  import monthcount from './monthcount.vue'
  import yearcount from './yearcount.vue'
  import allcount from './allcount.vue'


  // import axios from 'axios';
  export default {
    name: 'bookcount',
    props: {
      msg: String,
    },
    components: {
      daycount,
      weekcount,
      monthcount,
      yearcount,
      allcount
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

        showcount: 'year',
        recordlist: [],
        sumdaylist: []
      };
    },
    mounted() {
      this.dataget()

    },
    methods: {
      changecount(type) {
        this.showcount = type
      },
      dataget() {
        let recordlist = localStorage.getItem('recordlist');
        this.recordlist = JSON.parse(recordlist) || [];
      },
      goback(){
        this.$emit('goback');
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
    height: 60px;
    background: rgb(242, 226, 227);
    /* width: 80%; */
    margin: 5px 0;
    border-radius: 5px;
    text-align: left;
  }
</style>