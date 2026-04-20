<template>
  <div class="wrap">
    <div
      style="display: flex;flex-direction: row;justify-content: space-between;background-color: #e8d9db;height: 45px;line-height: 45px;">
      <div style="width: 60px;text-align: center;" @click="goback">返回</div>
      <div style="width: 100px;">我的统计</div>
      <div style="width: 60px;"></div>
    </div>
    <div style="display: flex;flex-direction: row;width:93%;height: 50px;background-color:#f2e2e3;margin: 10px auto;
    justify-content: space-around;align-items: center;">
      <div style="width: 62px;height: 40px;line-height: 40px;border-radius: 10px;"
        :class="{tabitem:showcount==item.type}" v-for="(item,index) in tabitem" :key="index"
        @click="changecount(item.type)">{{item.label}}</div>
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
        tabitem: [
          { label: '日', type: 'day' },
          { label: '周', type: 'week' },
          { label: '月', type: 'month' },
          { label: '年', type: 'year' },
          { label: '总', type: 'all' },
        ],
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
      goback() {
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
  .tabitem {
    background-color: white;
  }

</style>