<template>
  <div id="buttons">
    <CreateButton @create="create" />
    <JoinButton @join="join" />
  </div>
</template>

<script>
import CreateButton from "@/components/conference/preConference/Create.vue";
import JoinButton from "@/components/conference/preConference/Join.vue";
import Main from "@/store/modules/conference/main";

export default {
  components: {
    CreateButton,
    JoinButton,
  },
  methods: {
    create() {
      Main.init({ isCaller: true });
    },
    join(id) {
      console.log("id", id);
      Main.init({ isCaller: false, id });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

#buttons {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
