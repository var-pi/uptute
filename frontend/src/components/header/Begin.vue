<template>
  <HeaderMenu
    :color="color"
    :textColor="textColor"
    :borderRadius="borderRadius"
    :border="border"
    :padding="padding"
  >
    <template v-slot:title>
      <span>{{ $l("app.pages.begin") }}</span>
    </template>
    <template v-slot:content>
      <v-list-item>
        <GoogleSignIn>
          <v-btn text id="google">
            <img src="@/assets/icons/signIn/google.svg" alt="" />
            {{ $l("auth.google") }}
          </v-btn>
        </GoogleSignIn>
      </v-list-item>
      <v-list-item>
        <GoogleSignIn>
          <v-btn text id="facebook">
            <img src="@/assets/icons/signIn/facebook.svg" alt="" />
            {{ $l("auth.facebook") }}
          </v-btn>
        </GoogleSignIn>
        <!-- INSTEAD FACEBOOK SIGN IN !!!!!!!!!!!!!! -->
      </v-list-item>
    </template>
  </HeaderMenu>
</template>

<script>
import GoogleSignIn from "@/components/account/GoogleSignIn.vue";
import HeaderMenu from "@/components/header/HeaderMenu.vue";

export default {
  components: {
    GoogleSignIn,
    HeaderMenu,
  },
  props: {
    color: String,
    textColor: String,
    borderRadius: String,
    border: String,
    padding: String,
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

span {
  @include hoverOpacity();
}
</style>

