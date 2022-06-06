<template>
  <Background>
    <BackgroundCard>
      <div class="sheetWrapper" ref="calendarDiv">
        <v-sheet class="toolbar">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>

            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
              v-if="!$mb.isMobileInput()"
            >
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
              v-if="!$mb.isMobileInput()"
            >
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>

            <v-spacer class="onPhone" />

            <v-toolbar-title v-if="$refs.calendar" ref="toolbarTitle">
              {{ $refs.calendar.title }}
            </v-toolbar-title>

            <v-spacer class="onComputer" />

            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="menuBtn"
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="setType('day')">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setType('month')">
                  <!-- type = 'month' -->
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>

        <v-sheet class="calendar">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="eventsWithoutNames"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card flat>
              <v-card-text>
                <table>
                  <td>
                    <tr>
                      07-07-2021
                    </tr>
                    <tr>
                      18.00 - 19.30
                    </tr>
                    <tr>
                      80 UC
                    </tr>
                  </td>

                  <td>
                    <tr>
                      Maths
                    </tr>
                    <tr>
                      NoName
                    </tr>
                  </td>
                </table>
              </v-card-text>
              <v-card-actions>
                <v-btn small rounded text> Cancel the lesson </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </div>
    </BackgroundCard>
  </Background>
</template>

<script>
import Background from "@/components/global/background/Background.vue";
import BackgroundCard from "@/components/global/background/BackgroundCard.vue";
export default {
  permisions: {
    roles: ["ROLE_STUDENT"],
    redirect: "LogIn",
  },
  components: {
    Background,
    BackgroundCard,
  },
  data() {
    return {
      SwipeX: 0,
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        day: "Day",
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      eventsWithoutNames: [],
      colors: ["accent"],
      names: [
        "Meeting",
        "Holiday",
        "PTO",
        "Travel",
        "Event",
        "Birthday",
        "Conference",
        "Party",
      ],
    };
  },
  mounted() {
    this.$refs.calendar.checkChange();
    document.addEventListener("touchend", this.touchend);
    this.$nextTick(() => {
      this.$mb.addSwipeListener(this.swipe, this.$refs.calendarDiv);
      this.fadeIn();
    });
  },
  methods: {
    swipe(e) {
      this.SwipeX = e.x;
    },
    touchend() {
      if (this.SwipeX > 30) {
        this.next();
      } else if (this.SwipeX < -30) {
        this.prev();
      }
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
      this.prev(); // TODO
      this.next(); // renders a blank calendar without them
    },
    getEventColor(event) {
      return event.color;
    },
    setType(type) {
      this.type = type;
      this.prev(); // TODO
      this.next(); // renders a blank calendar without them
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.fadeOut();
      setTimeout(() => {
        this.$refs.calendar.prev();
        this.fadeIn();
      }, 500);
    },
    next() {
      this.fadeOut();
      setTimeout(() => {
        this.$refs.calendar.next();
        this.fadeIn();
      }, 500);
    },
    fadeOut() {
      this.$refs.calendar.$el.style.opacity = 0;
      this.$refs.toolbarTitle.style.opacity = 0;
    },
    fadeIn() {
      this.$refs.calendar.$el.style.opacity = 1;
      this.$refs.toolbarTitle.style.opacity = 1;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];
      const eventsWithoutNames = [];
      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      // const days = (max.getTime() - min.getTime()) / 86400000;
      //   const eventCount = this.rnd(days, days);
      const eventCount = 4;
      for (let i = 0; i < eventCount; i++) {
        // const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, 6) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);
        eventsWithoutNames.push({
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: true,
        });
        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: true,
        });
      }
      this.events = events;
      this.eventsWithoutNames = eventsWithoutNames;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
  beforeDestroy() {
    if (this.type === "day") {
      this.type = "month";
      window.history.forward(1);
    }
    document.removeEventListener("touchend", this.touchend);
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";
$border: 1px solid var(--v-background-base);

::v-deep {
  #backgroundCard {
    padding: 0 !important;
    margin: auto;
    // margin-top: auto !important;
    // margin-bottom: auto !important;
    .v-calendar {
      height: 75vh;
      width: 80vw;
      &.v-calendar-daily {
        width: 600px;
      }
    }
    @media (max-width: 800px) {
      .sheetWrapper {
        border-radius: 0 !important;
      }
      .v-calendar,
      .v-calendar.v-calendar-daily {
        width: 100vw;
        height: calc(100vh - 200px);
      }
      width: 100vw;
      margin-top: 56px;
      margin-bottom: auto;
    }
  }
  &.v-menu__content {
    min-width: max-content !important;
    border-radius: 15px;
  }
  .sheetWrapper {
    border-radius: 15px;
    overflow: hidden;
    border: $border;
    // background: red;
    @include box-shadow();
  }
  .v-sheet {
    overflow: hidden;
    .v-toolbar__content {
      & > *:not(:last-child) {
        margin-right: 1rem !important;
      }
      .v-toolbar__title {
        opacity: 0;
        transition: opacity 400ms ease-in-out;
      }
    }
    .v-btn__content {
      color: var(--v-card-darken2);
    }
    &.calendar {
      width: max-content;
      height: max-content;
      .v-calendar {
        opacity: 0;
        transition: opacity 400ms ease-in-out;
        border: none;
        border-top: $border;
        &.v-calendar-daily {
          ::-webkit-scrollbar {
            width: 0;
          }
          .v-calendar-daily__head {
            margin-right: $border !important;
            .v-calendar-daily_head-day {
              border-right: none;
              border-bottom: $border;
            }
          }
          .v-calendar-daily__day {
            border: none;
            &-interval {
              border-top: $border;
            }
          }
          .v-calendar-daily__intervals {
            &-head {
              border-right: $border;
              &::after {
                background: linear-gradient(
                  90deg,
                  transparent,
                  var(--v-background-base)
                );
                border: none;
              }
            }
            &-body {
              border-right: $border;
              .v-calendar-daily__interval::after {
                border-top: $border;
              }
            }
          }
          .v-event-timed-container {
            width: 97%;
            margin: 0 auto;
            .v-event-timed {
              border: none !important;
              border-top: 1px solid !important;
              border-bottom: 1px solid !important;
              border-radius: 15px !important;
              @include flexbox();
              .pl-1 {
                padding-left: 0 !important;
              }
            }
          }
        }
        .v-calendar-weekly__head-weekday {
          border-right: none;
          color: var(--v-card-darken2);
          padding-top: 2px;
          &.v-present {
            color: var(--v-card-darken4) !important;
          }
        }
        .v-calendar-weekly__week {
          &:not(:last-child) {
            .v-calendar-weekly__day {
              border-bottom: $border;
            }
          }
          &:last-child {
            .v-calendar-weekly__day {
              border-bottom: none;
            }
          }
          .v-calendar-weekly__day {
            &:not(:last-child) {
              border-right: $border;
            }
            &:last-child {
              border-right: none;
            }
            &.v-outside {
              background: var(--v-header-base) !important;
            }
            .v-event {
              border-radius: 0;
              width: 100% !important;
              margin: 2px auto !important;
              color: var(--v-secondary-base) !important;
            }
          }
        }
        .v-present .v-btn--fab {
          background-color: var(--v-header-base) !important;
        }
      }
    }
    &.toolbar {
      border: none !important;
      border-bottom: 0px !important;
      background: var(--v-secondary-base);
      .spacer.onPhone {
        display: none;
      }
      * {
        color: var(--v-card-darken2);
      }
      color: var(--v-card-base);
      .v-btn:not(.v-btn--fab) {
        border-radius: 15px;
        border: none;
        background: var(--v-header-base);
      }
      .v-btn--fab {
        margin: auto 2px;
      }
      @media (max-width: 400px) {
        .menuBtn {
          display: none;
        }
        .spacer {
          &.onComputer {
            display: none;
          }
          &.onPhone {
            display: flex;
          }
        }
      }
    }
  }
  .v-toolbar__content .menuBtn.v-btn,
  .v-list {
    width: 10rem;
  }
}
table {
  width: 100%;
  td {
    width: 50%;
    &:first-child {
      text-align: left;
    }
    &:last-child {
      text-align: right;
    }
    tr {
      display: block;
    }
  }
}
.v-card {
  width: 300px;
  .v-card__actions .v-btn {
    margin-left: auto;
  }
}
</style>

