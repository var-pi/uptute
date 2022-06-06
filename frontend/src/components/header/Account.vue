<template>
  <HeaderMenu
    :color="color"
    :textColor="textColor"
    :borderRadius="borderRadius"
    :border="border"
    :padding="padding"
  >
    <template v-slot:title>
      <v-icon v-if="ifWithIcon" class="icon"> mdi-account-plus-outline </v-icon>
      <span v-if="ifWithText">{{ $l("auth.header.account") }}</span>
    </template>
    <template v-slot:content>
      <v-list-item>
        <v-btn text @click="goTo('LogIn')">{{
          $l("auth.header.sign_in")
        }}</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text @click="goTo('Register')">{{
          $l("auth.header.sign_up")
        }}</v-btn>
      </v-list-item>
    </template>
  </HeaderMenu>
</template>

<script>
import HeaderMenu from "@/components/header/HeaderMenu.vue";
import { goTo } from "@/plugins/GlobalMethods.js";

export default {
  props: {
    ifWithText: {
      type: Boolean,
      default: true,
    },
    ifWithIcon: {
      type: Boolean,
      default: true,
    },
    color: String,
    textColor: String,
    borderRadius: String,
    border: String,
    padding: String,
  },
  components: {
    HeaderMenu,
  },
  methods: {
    goTo,
  },
};
</script>

<style lang="scss" scoped>
.icon.v-icon {
  color: var(--v-accent-base);
  font-size: 20px;
  padding: 4.78px !important;
  padding-right: 10px !important;
  border-radius: 50%;
  transform: translateX(0px);
}
</style>
