<template>
  <div>
    <HiddenButtonCard v-for="(student, id) in students" :key="id" class="card">
      <template v-slot:static>
        <table>
          <tr>
            <td class="profile">
              <img class="userImg" src="@/assets/icons/user.svg" />
              <div class="nameAndAge">
                <div id="nameWrapper">
                  <h3>
                    {{ student.details ? student.details.firstName : null }}
                  </h3>
                  <h3>
                    {{ student.details ? student.details.lastName : null }}
                  </h3>
                </div>
                <span class="age"
                  >{{ student.details ? student.details.grade : null }}
                  {{ $l("choose_a.student.grade") }}</span
                >
              </div>
            </td>
            <!-- <td class="dateAndTime">
              <div class="date">
                {{ $l(`data.days.${student.date.weekday}.short`) }}
                {{ student.date.day }}
                <div class="lighter">
                  {{ $l(`data.months.${student.date.month}.short`) }}
                  {{ student.date.year }}
                </div>
              </div>
              <div class="time">
                {{ student.time.start }} - {{ student.time.end }}
              </div>
            </td> -->
          </tr>
        </table>
      </template>

      <template v-slot:moving>
        <div class="infoContainer">
          <div class="subject">
            {{ getSubject(student) }}
            <v-spacer />

            <div class="topic">
              {{
                student.details && student.details.topic
                  ? student.details.topic
                  : null
              }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:activator>
        <DetailsButton :student="student" />
      </template>
    </HiddenButtonCard>
  </div>
</template>

<script>
import HiddenButtonCard from "@/components/choosing/HiddenButtonCard.vue";
import DetailsButton from "@/components/choosing/choosingAStudent/DetailsButton.vue";

export default {
  components: {
    HiddenButtonCard,
    DetailsButton,
  },
  props: {
    students: Array,
  },
  methods: {
    getSubject(student) {
      return student.details
        ? this.$l(`data.subjects.${student.details.subject}`)
        : null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

table {
  width: 100%;
  td {
    width: 50%;
    &.profile {
      @include flexbox;
      justify-content: flex-start;
      .userImg {
        width: 50px;
        height: 50px;

        border-radius: 50%;
        border: 2px solid var(--v-primary-base);
        opacity: 0.2;
      }
      .nameAndAge {
        @include flexbox(column);
        #nameWrapper {
          @include flexbox(row);
          & > *:first-child {
            margin-right: 0.5ch;
          }
        }
        .age {
          margin-right: auto;
        }
        margin-left: 10px;
      }
    }
    &.dateAndTime {
      text-align: right;
      vertical-align: top;

      .date {
        display: inline-flex;
        .lighter {
          margin-left: 0.5ch;
          color: var(--v-secondary-darken2);
        }
      }
    }
  }
}

.topic {
  color: var(--v-accent-base);
}

.infoContainer {
  @include flexbox(column);
  align-items: flex-end;
  .subject {
    @include flexbox;
    width: 100%;
  }
}
</style>
