<template>
  <div class="hello">
    <div
      style="display: flex;flex-direction: row;justify-content: space-between;background-color: #e8d9db;height: 45px;line-height: 45px;">
      <div style="width: 60px;text-align: center;" @click="goback">返回</div>
      <div style="width: 100px;">阅读详情</div>
      <div style="width: 60px;"></div>
    </div>
    <div class="content">
      <div style="background-color: white;text-align: left;padding: 10px;border-radius: 5px;margin-top: 10px;">
        <div>{{detailitem.title}}</div>
        <div>{{detailitem.author}}</div>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 10px;">
        <div class="readbox">
          <div>阅读时长</div>
          <div> {{detailitem.alltime|timechange}}</div>
        </div>
        <div class="readbox">
          <div>阅读天数</div>
          <div>{{detailitem.records.length}}</div>
        </div>
      </div>
      <div v-for="(item, index) in monthList" :key="index" @click="goback">
        <div style="background-color: rgb(242, 226, 227);text-align: left;padding: 5px 10px;margin-top: 10px;border-radius: 5px;
        display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
         <div >
          {{item}}
         </div>
         <div >
           {{sumlist[item]|timechange}}  {{recordlist[item].length}}天
         </div>
        </div>
        <div v-for="(record, indey) in recordlist[item]" :key="indey" style="display: flex;flex-direction: row;justify-content: space-between;padding: 5px 10px;
          background-color: white;margin: 0 0;border-radius: 5px;">
          <div>{{record.date}}</div>
          <div>{{record.read_seconds|timechange}}</div>
        </div>

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
        monthList: [],
        sumlist: [],
        recordlist: []
      };
    },
    mounted() {
      this.detailitem.records.sort((a, b) => a.date.localeCompare(b.date))//按时间排序
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
  .content {
    width: 93%;
    margin: 0 auto;

  }

  .readbox {
    height: 45px;
    width: 49%;
    border-radius: 5px;
    margin: 5px 0;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 10px 0;
  }
</style>