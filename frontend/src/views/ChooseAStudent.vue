<template>
  <Background>
    <Subheader :title="$l('choose_a.student.header')" />
    <div class="innerContent">
      <InfoCardBase class="price" radius="15px">
        <h3>{{ $l("choose_a.student.price") }}</h3>
        <h3>65 UC</h3>
      </InfoCardBase>
      <Searching />
      <SortBy
        id="sortBy"
        v-model="filter"
        :filters="filters"
        :label="$l('find.filters.filters.h')"
        :flat="false"
        :text="`${$l('find.filters.filters.' + filter.name)} ${
          filter.dir === 'up' ? '↑' : '↓'
        }`"
        :convertor="(item) => $l('find.filters.filters.' + item.name)"
      />
      <StudentPanels id="panels" :students="getStudentsArr()" />
    </div>
  </Background>
</template>

<script>
import Background from "@/components/global/background/Background.vue";
import Subheader from "@/components/app/Subheader.vue";

import InfoCardBase from "@/components/choosing/infoCards/InfoCardBase.vue";
import Searching from "@/components/choosing/Searching.vue";
import SortBy from "@/components/filterPanel/ExpandableSortBy.vue";
import StudentPanels from "@/components/choosing/choosingAStudent/StudentPanels.vue";

export default {
  permisions: {
    roles: "ROLE_TUTOR",
    redirect: "/setting_up/tutor",
  },
  components: {
    Background,
    Subheader,

    InfoCardBase,
    Searching,
    SortBy,
    StudentPanels,
  },
  data() {
    return {
      filter: { name: "time", dir: "up" },
      filters: [
        //TO DO!!!!!!!!!
        { name: "time", dir: "up" },
        { name: "subject", dir: "up" },
        { name: "grade", dir: "up" },
      ],
      // students: [
      //   {
      //     name: "NoName",
      //     date: { date: "mkm" },
      //     time: {
      //       start: "16.00",
      //       end: "17.30",
      //     },
      //     grade: 11,
      //     subject: "Maths",
      //     topic: {
      //       title: "Logarithms",
      //       text: "Woud like to revise the basics before the test.",
      //     },
      //   },
      // ],
      // weekdays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      // months: [
      //   "jan",
      //   "feb",
      //   "mar",
      //   "apr",
      //   "may",
      //   "jun",
      //   "jul",
      //   "aug",
      //   "sept",
      //   "oct",
      //   "nov",
      //   "dec",
      // ],
    };
  },
  methods: {
    // settingDate() {
    //   var date = new Date();
    //   this.students[0].date = {
    //     weekday: this.weekdays[date.getDay()],
    //     day: date.getDate(),
    //     month: this.months[date.getMonth()],
    //     year: date.getFullYear(),
    //   };
    // },
    getStudentsArr() {
      const stateObj = this.$store.state["lesson/tutor"];
      console.log(stateObj);
      if (stateObj.offeredLessons.length > 0) return stateObj.offeredLessons;
      return stateObj.lessons;
    },
  },
  beforeMount() {
    // this.settingDate();
    this.$store.dispatch("lesson/tutor/getLessons", { vm: this });
  },
  mounted() {
    // for (var i = 0; i < 5; i++) {
    //   this.students.push(this.students[0]);
    // }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("lesson/tutor/mutate", { name: "state", val: "idle" });
    next();
  },
};
</script>

<style lang="scss" scoped>
$inner-content-width: 350px;

.innerContent {
  margin: calc(106px + 3rem) auto 3rem auto;
  width: $inner-content-width;
}

.price {
  color: var(--v-primary-lighten4);
  border-radius: 15px;
  // overflow: hidden;
  * {
    display: inline;
    margin: 0;
  }
  & *:last-child {
    float: right;
  }
}

#sortBy {
  border-radius: 15px;
}
</style>
