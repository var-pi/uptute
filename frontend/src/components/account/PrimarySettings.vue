<template>
  <div id="wrapper">
    <label id="imgLabel">
      <img :src="img.imageUrl" alt="" />
      <input type="file" accept="image/*" @change="addImg" />
    </label>
    <FilterPanel ref="panel" @next="(action) => $refs.panel2[action]()">
      <TextField
        v-model="name"
        :label="$l('set_up.name')"
        :rules="(val) => val != '' && val != null"
        :borderRadius="'15px 15px 0px 0px'"
      />
      <TextField
        v-model="surname"
        :label="$l('set_up.surname')"
        :rules="(val) => val != '' && val != null"
        :borderRadius="'0px 0px 15px 15px'"
      />
    </FilterPanel>

    <FilterPanel ref="panel2">
      <ExpandableCalendar
        v-model="birthday"
        :label="$l('set_up.birth')"
        :text="birthday"
        :rules="(item) => item != null"
        borderRadius="15px 15px 0px 0px"
      />
      <ExpandableSlider
        v-model="grade"
        :label="$l('set_up.grade')"
        :text="grade"
        :min="1"
        :max="12"
        borderRadius="0px 0px 15px 15px"
      />
    </FilterPanel>
  </div>
</template>

<script>
import FilterPanel from "@/components/filterPanel/FilterPanel.vue";
import ExpandableCalendar from "@/components/filterPanel/ExpandableCalendar.vue";
import ExpandableSlider from "@/components/filterPanel/ExpandableSlider.vue";
import TextField from "@/components/filterPanel/TextField";

export default {
  components: {
    FilterPanel,
    ExpandableCalendar,
    ExpandableSlider,
    TextField,
  },
  data() {
    return {
      img: {
        name: "profile",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9tbe0h9I_HCaMS2lyCsdTRXmznpSg9Rn5iA&usqp=CAU",
      },
      name: "",
      surname: "",
      birthday: null,
      grade: 1,
    };
  },
  methods: {
    addImg(e) {
      const file = e.target.files[0];

      this.img = {
        image: file,
        imageUrl: URL.createObjectURL(file),
      };
    },
    async isValid() {
      await this.$refs.panel.isValid();
    },
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
  & > * {
    margin-bottom: 2rem;
  }
}
#imgLabel {
  @include flexbox;
  input {
    display: none;
  }
  img {
    @include box-size(100px);
    border-radius: 50%;
    opacity: 0.99; // bug - input desn't allow to select with full opacity

    @include box-shadow();
    // border: 2px solid var(--v-secondary-darken2);
    cursor: pointer;

    transition: box-shadow 400ms;
    &:hover {
      box-shadow: 1px 2px 8px 0px var(--v-card-darken2);
    }
  }
}
</style>
