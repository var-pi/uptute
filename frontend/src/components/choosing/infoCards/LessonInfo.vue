<template>
  <InfoCardBase :radius="radius">
    <table>
      <tr>
        <th>{{ $l("find.filters.subject.h") }}</th>
        <td>{{ $l(`data.subjects.${lesson.subject}`) }}</td>
      </tr>
      <tr>
        <th>{{ $l("find.filters.language.h") }}</th>
        <td>{{ getLangStr() }}</td>
      </tr>
      <tr>
        <th>{{ $l("find.filters.price.h") }}</th>
        <td>{{ lesson.price[0] }} - {{ lesson.price[1] }} UC/h</td>
      </tr>
      <tr>
        <th>{{ $l("find.filters.tutor_age.h") }}</th>
        <td>{{ lesson.age[0] }} - {{ lesson.age[1] }} y.o.</td>
      </tr>
    </table>
  </InfoCardBase>
</template>

<script>
import InfoCardBase from "@/components/choosing/infoCards/InfoCardBase.vue";

export default {
  components: {
    InfoCardBase,
  },
  props: {
    radius: String,
  },
  computed: {
    lesson: function () {
      return this.$store.state["lesson/student"].info;
    },
  },
  methods: {
    getLangStr() {
      let arr = this.lesson.languages;
      arr = arr.map((abbr) => this.$l(`data.languages.${abbr}`));
      return arr.join(", ");
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
}
td,
th {
  padding-bottom: 10px;
  margin: 0;
}

tr:last-child {
  td,
  th {
    padding: 0;
    width: 50%;
  }
}

th {
  color: var(--v-secondary-darken2);
}

td {
  text-align: right;
  color: var(--v-primary-lighten4);
}
</style>
