import Vue from "vue";

import MobileInput from "./mobileInput";

declare module "vue/types/vue" {
  interface Vue {
    $mb: MobileInput;
  }
}

export {};
