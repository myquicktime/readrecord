<template>
  <div class="hello">

    <div>{{detailitem.title}}</div>
    <div>{{detailitem.author}}</div>
    <div style="display: flex;flex-direction: row;">
      <div style="width: 50%;">
        <div>阅读时长</div>
        <div> {{detailitem.alltime|timechange}}</div>
      </div>
      <div style="width: 50%;">
        <div>阅读天数</div>
        <div>{{detailitem.records.length}}</div>
      </div>
    </div>

    <!-- <div v-for="(item, index) in detailitem.records" :key="index" @click="goback">
      {{item.date}}
      {{item.read_seconds|timechange}}
    </div> -->


    <div v-for="(item, index) in monthList" :key="index" @click="goback">
      <div style="background-color: palegoldenrod;">
        {{item}}
        {{sumlist[item]|timechange}}
        {{recordlist[item].length}}天
      </div>
      <div v-for="(record, indey) in recordlist[item]" :key="indey"
        style="display: flex;flex-direction: row;justify-content: space-between;">
        <div>{{record.date}}</div>
        <div>{{record.read_seconds|timechange}}</div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'bookTime',
    props: {
      detailitem: Object
    },
    filters: {
      timechange(seconds) {
         if(!seconds){
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
        monthList: [],
        sumlist: [],
        recordlist: []
      };
    },
    mounted() {

      this.recordlist = this.groupByMonth(this.detailitem.records)
      this.sumlist = this.sumByMonth(this.detailitem.records)
      this.monthList = Object.keys(this.recordlist)
    },
    methods: {
      groupByMonth(list) {
        return list.reduce((result, item) => {
          // 提取 年-月
          const monthKey = item.date.slice(0, 7)

          if (!result[monthKey]) {
            result[monthKey] = []
          }

          result[monthKey].push(item)
          return result
        }, {})
      },
      sumByMonth(list) {
        return list.reduce((res, item) => {
          const key = item.date.slice(0, 7);
          res[key] = (res[key] || 0) + item.read_seconds;
          return res;
        }, {})
      },


      goback() {
        this.$emit('goback');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>