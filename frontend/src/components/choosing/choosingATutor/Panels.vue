<template>
  <div id="main">
    <div v-for="(tutor, index) in tutors" class="vForDiv" :key="index">
      <v-tooltip
        :attach="`#panel-${tutor.uuid}`"
        content-class="tooltip"
        open-delay="300"
        absolute
        ref="tooltip"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-hover v-model="isActive">
            <div
              v-bind="attrs"
              v-on="on"
              class="panelWrapper"
              :id="`panel-${tutor.uuid}`"
            >
              <Panel :tutor="tutor" class="panel" />
            </div>
          </v-hover>
        </template>
        <span>
          <!-- <Moto :moto="tutor.moto" /> -->
          <!-- v-if="isActive" -->

          <Comments
            :isActive="isActive"
            :id="tutor.uuid"
            :background="tooltipBackground"
          />
        </span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import Panel from "./Panel.vue";
// import Moto from "./aboutTutor/Moto.vue";
import Comments from "@/components/choosing/choosingATutor/aboutTutor/Comments.vue";

export default {
  props: {
    tutors: Array,
  },
  components: {
    Panel,
    // Moto,
    Comments,
  },
  data() {
    return {
      isActive: false,
      tooltipBackground: "var(--v-background-base)",
    };
  },

  mounted() {
    setTimeout(() => {
      document.styleSheets[0].insertRule(`:root{
      --tooltipBackground: ${this.tooltipBackground};
      }`);
    }, 0);
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

$button-height: 36px;
$card-rows-margin: 5px;

#main {
  width: 100%;
  min-width: 0px; /* ??? */
}

@keyframes slideInfFromLeft {
  from {
    transform: translateX(-8rem);
    opacity: 0;
  }
  to {
    transform: translateX(0rem);
    opacity: 1;
  }
}

// ::v-deep {
// #moto {
//   margin: 1rem auto;
//   border-radius: 15px;
// }
// }

.vForDiv:last-child {
  & .tooltip {
    bottom: 0 !important;
  }
}

.panelWrapper {
  position: relative;
  @include flexbox();

  .panel {
    @include box-size(100%);
    // margin: 10px auto;
  }
  .tooltip {
    left: auto !important;
    top: auto !important;
    right: calc(100% + 3rem);
    top: auto !important;

    background: var(--tooltipBackground) !important;
    @include box-shadow();
    @media (max-width: 1120px) {
      display: none;
    }
  }
}
</style>

