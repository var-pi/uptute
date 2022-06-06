<template>
  <SidepanelBase>
    <table id="info" ref="info">
      <tr v-for="(param, id) in info" :key="id">
        <td class="key">{{ param.name }}</td>
        <td class="val">{{ param.val }}</td>
      </tr>
    </table>
  </SidepanelBase>
</template>

<script lang="ts">
import SidepanelBase from "@/components/conference/centerColumn/bars/top/SideBase.vue";

import Main from "@/store/modules/conference/main";
import { Vue, Component, Provide } from "vue-property-decorator";
import { ButtonToggleEvent } from "@/components/conference/types";

interface Info {
  [index: string]: {
    name: string;
    val: string | undefined;
  };
}

@Component({ components: { SidepanelBase } })
export default class SettingsPanel extends Vue {
  info: Info = { id: { name: "Conference ID", val: Main.roomRef?.id } };

  @Provide() path: ButtonToggleEvent = { side: "top", name: "settings" };
  @Provide() isLeft: boolean = true;
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

#info {
  width: 100%;
  td {
    width: fit-content;
    text-align: left;

    &.key {
      padding-right: 12px;
    }
    &.val {
      padding-left: 12px;
      text-align: right;
    }
  }
  tr {
    padding: 12px 0;
  }

  & > * {
    // word-wrap: unset;
    white-space: nowrap;
  }
}
</style>
