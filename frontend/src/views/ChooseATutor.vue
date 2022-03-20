<template>
  <Background :title="$l('choose_a.tutor.header')">
    <div class="innerContent">
      <LessonInfo
        ref="lessonInfo"
        :radius="radiusUpperInfo"
        class="lessonInfo"
      />
      <InfoCardBase ref="infoCard" :radius="radiusLowerInfo" class="infoCard">
        <h3 class="chooseOne">{{ $l("choose_a.tutor.choose") }}</h3>
      </InfoCardBase>
      <Searching />
      <FilterPanel id="filterPanel">
        <ExpandableSortBy
          v-model="filter"
          :filters="[
            { name: 'rating', dir: 'up' },
            { name: 'price', dir: 'up' },
            { name: 'hours_taught', dir: 'up' },
          ]"
          :label="$l('find.filters.filters.h')"
          :flat="false"
          :text="
            `${$l('find.filters.filters.' + filter.name)} ${
              filter.dir === 'up' ? '↑' : '↓'
            }`
          "
          :convertor="(item) => $l('find.filters.filters.' + item.name)"
          borderRadius="15px"
        />
      </FilterPanel>
      <Panels id="panels" :tutors="getTutors()" />
    </div>
    <v-snackbar max-width="800" color="error" timeout="-1" v-model="showAlert">
      {{ $l("choose_a.tutor.ended") }}
      <div id="snackButtons">
        <v-btn text v-model="closeButton" ref="closeBtn">
          {{ $l("choose_a.tutor.anyway") }}
        </v-btn>
        <v-btn text v-model="backButton" ref="backBtn">
          {{ $l("choose_a.tutor.cancel") }}
        </v-btn>
      </div>
    </v-snackbar>
  </Background>
</template>

<script>
import Background from "@/components/global/background/Background.vue";
import InfoCardBase from "@/components/choosing/infoCards/InfoCardBase.vue";
import Panels from "@/components/choosing/choosingATutor/Panels";
import Searching from "@/components/choosing/Searching.vue";
import LessonInfo from "@/components/choosing/infoCards/LessonInfo.vue";
import FilterPanel from "@/components/filterPanel/FilterPanel.vue";
import ExpandableSortBy from "@/components/filterPanel/ExpandableSortBy.vue";

export default {
  permisions: {
    roles: "USER",
    allowedOrigins: "FindATutor",
    redirect: "FindATutor",
  },
  components: {
    Background,
    InfoCardBase,
    Panels,
    Searching,
    LessonInfo,
    FilterPanel,
    ExpandableSortBy,
  },
  data() {
    return {
      tutors: [],
      filter: { name: "rating", dir: "up" },
      showAlert: false,
      closeButton: false,
      backButton: false,
      radiusUpperInfo: "15px",
      radiusLowerInfo: "15px",
    };
  },
  methods: {
    preventNav(event) {
      event.preventDefault();
      event.returnValue = "";
    },
    untilClick() {
      return new Promise((res) => {
        const backBtn = this.$refs.backBtn.$el;
        const closeBtn = this.$refs.closeBtn.$el;
        backBtn.onclick = () => res("back");
        closeBtn.onclick = () => res("close");
      });
    },
    resized() {
      var ww = window.innerWidth;
      var lessonInfo = this.$refs.lessonInfo.$el;
      var infoCard = this.$refs.infoCard.$el;
      if (
        infoCard.getBoundingClientRect().width +
          2 * lessonInfo.getBoundingClientRect().width +
          100 >
        ww
      ) {
        lessonInfo.style = "position: static;";
        infoCard.style = "position: static; margin-top: 0.8rem;";
        this.radiusUpperInfo = "15px 15px 5px 5px";
        this.radiusLowerInfo = "5px 5px 15px 15px";
      } else {
        lessonInfo.style = "position: fixed; right: 2rem; top: 8rem;";
        infoCard.style = "position: static;";
        this.radiusUpperInfo = "15px";
        this.radiusLowerInfo = "15px";
      }
    },
    getTutors() {
      return this.$store.state.studentLessonAPI.tutors;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.studentLessonAPI.state === "idle") next();
    this.showAlert = true;
    this.untilClick().then(async (val) => {
      this.showAlert = false;
      if (val === "close") {
        await this.$store.dispatch("studentLessonAPI/deleteLesson");
        next();
      }
    });
  },
  mounted() {
    window.addEventListener("beforeunload", this.preventNav);
    window.addEventListener("resize", this.resized);
    this.resized();
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventNav);
    window.removeEventListener("resize", this.resized);
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";
$inner-content-width: 350px;

::v-deep .v-snack__wrapper {
  border-radius: 15px !important;
  .v-snack__content {
    @include flexbox(column);
  }
  #snackButtons .v-btn {
    border-radius: 15px !important;
    margin: 0.5rem 0.5rem 0 0.5rem;
  }
}

.innerContent {
  margin: calc(106px + 3rem) auto 3rem auto;
  width: $inner-content-width;
}

#filterPanel {
  margin-bottom: 2rem;
}

#panels {
  margin-bottom: 3rem;
}

@media (max-width: 400px) {
  .innerContent {
    width: 100vh;
    padding: 0 1rem;
  }
}

@media (max-width: 330px) {
}

@media (max-width: 300px) {
}

// ::v-deep {
//   @media (max-width: 1200px) {
//     .lessonInfo {
//       &#wrapper {
//         border-radius: 15px 15px 0 0;
//         // position: static;
//       }

//       // position: static;
//     }
//     .infoCard {
//       &.baseCard {
//         border-radius: 0 0 15px 15px;
//       }
//     }
//   }
// }

.chooseOne {
  font-size: 1rem;
  font-weight: normal;
  color: var(--v-primary-lighten4);
  text-align: center;
}
</style>
