<template>
  <HiddenButtonCard v-if="visible" :tutor="tutor" ref="hiddenButtonCard">
    <template v-slot:static>
      <button class="rejectBtn" @click="reject()">
        <v-icon class="rejectIcon">mdi-close</v-icon>
      </button>
      <div class="profile">
        <UserImg :tutor="tutor" ref="userImg" />

        <div>
          <p class="pph">
            {{ Math.round(tutor.details.pph) }} UC/{{ $l("tutor.hour") }}
          </p>
          <h3>{{ tutor.details.firstName }} {{ tutor.details.lastName }}</h3>
          <p>{{ tutor.details.age }} {{ $l("find.filters.tutor_age.p") }}</p>
        </div>
      </div>
    </template>

    <template v-slot:moving>
      <div class="tutor">
        <v-tooltip top content-class="tooltip" open-delay="300">
          <template v-slot:activator="{ on, attrs }">
            <div class="hoursDiv" v-bind="attrs" v-on="on">
              <img
                width="20px"
                height="20px"
                class="mr-1"
                src="@/assets/icons/clock.svg"
              />
              <p>{{ Math.round(tutor.details.hours) }}{{ $l("tutor.hour") }}</p>
            </div>
          </template>
          <span>
            {{ $l("choose_a.tutor.hours") }}
          </span>
        </v-tooltip>

        <Rating :valueProp="tutor.details.rating" class="rating" />

        <div class="commentsDiv" @click="openComments()">
          <img
            width="20px"
            height="20px"
            class="mr-1"
            src="@/assets/icons/message.svg"
          />
          <p>{{ tutor.details.comments }}</p>
        </div>
      </div>
    </template>
    <template v-slot:activator>
      <BookButton :tutor="tutor" />
    </template>
  </HiddenButtonCard>
</template>

<script>
import HiddenButtonCard from "@/components/choosing/HiddenButtonCard.vue";
import Rating from "./Rating.vue";
import UserImg from "@/components/choosing/choosingATutor/UserImg.vue";
import BookButton from "@/components/choosing/choosingATutor/BookButton.vue";
// import { scrolled } from "@/plugins/GlobalMethods";

export default {
  data() {
    return {
      visible: true,
      windowTop: 0,
    };
  },
  components: {
    HiddenButtonCard,
    Rating,
    UserImg,
    BookButton,
  },
  props: {
    tooltipUse: String,
    tutor: Object,
  },
  methods: {
    openComments() {
      this.$refs.userImg.$refs.dialog.open();
      setTimeout(() => {
        this.$refs.userImg.$refs.aboutTutorContent.scrollToComments(0);
      }, 0);
    },
    async reject() {
      const offerLogId = this.tutor.offerLogId;
      this.$store
        .dispatch("lesson/student/rejectOffer", { offerLogId })
        .then((isRej) => (this.visible = !isRej));
    },
  },
  // mounted() {
  //   window.addEventListener("scroll", () =>
  //     scrolled({ cards: [this.$refs.hiddenButtonCard.$el] })
  //   );
  // },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

* {
  margin: auto 0;
}

.rejectBtn {
  position: absolute;
  right: 4px;
  top: 4px;
  .rejectIcon {
    color: var(--v-secondary-darken2);
    transition: all 500ms;
    &:hover {
      transform: rotate(180deg) scale(0.8);
      color: var(--v-accent-base) !important;
    }
  }
}

.profile {
  display: inline-flex;
  width: 100%;
  text-align: left;
  div {
    margin-left: 10px;
    width: 100%;
    padding: 0;
  }
  .pph {
    float: right;
  }
  p {
    margin: 0;
  }
}

.tutor {
  display: flex;
  position: relative;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .rating {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .hoursDiv,
  .commentsDiv {
    opacity: 0.6;
    cursor: pointer;

    transition: opacity 300ms;
    &:hover {
      opacity: 1;
    }
  }
  div {
    display: flex;
  }
  * {
    margin: auto 0;
  }
}

.tooltip {
  opacity: 1 !important;
  width: max-content !important;
  min-width: 0 !important;
  background: var(--v-background-base) !important;
  color: var(--v-background-darken3) !important;
  @include box-shadow();
}
</style>
