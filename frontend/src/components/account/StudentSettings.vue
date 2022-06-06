<template>
  <div id="wrapper">
    <FilterPanel ref="panel">
      <ExpandableSlider
        v-model="data.grade"
        :label="$l('set_up.grade')"
        :text="data.grade"
        :min="1"
        :max="12"
        borderRadius="15px"
        :flat="false"
      />
    </FilterPanel>
  </div>
</template>

<script>
import FilterPanel from "@/components/filterPanel/FilterPanel.vue";
import ExpandableSlider from "@/components/filterPanel/ExpandableSlider.vue";

export default {
  components: {
    FilterPanel,
    ExpandableSlider,
  },
  data() {
    return {};
  },
  methods: {
    async isValid() {
      await this.$refs.panel.isValid();
    },
  },
  props: {
    data: Object,
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

#wrapper {
  width: 25rem;
  @media (max-width: 450px) {
    width: 100%;
    padding: 0 1rem;
  }

  & > *:not(:last-child) {
    margin-bottom: 2rem;
  }
}

#panels {
  border-radius: 15px;
}
</style>
