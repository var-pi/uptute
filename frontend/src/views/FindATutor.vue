<template>
  <Background>
    <Subheader :title="$l('find.header')" />
    <div id="content">
      <v-btn @click="refresh()" small text rounded id="refreshBtn">
        {{ $l("find.filters.refresh") }}
      </v-btn>
      <FilterPanel
        ref="panel"
        @next="
          (action, callback) =>
            action == 'isValid'
              ? ifPanel2IsValid(action, callback)
              : refreshPanel2(action)
        "
      >
        <!-- $refs.panel2[action]() -->
        <ExpandableListSelector
          v-model="info.subject"
          :label="$l('find.filters.subject.h')"
          :text="$l('data.subjects.' + info.subject)"
          :list="['MATH', 'BIOL', 'ESL', 'PHYS', 'GEOG', 'CHEM', 'CIS']"
          :convertor="(item) => $l('data.subjects.' + item)"
          :searchLabel="$l('find.filters.subject.search')"
          :rules="(item) => item != null"
          :flat="false"
          :backgroundColor="'var(--v-card-lighten3)'"
          :borderRadius="'15px 15px 0px 0px'"
        />

        <TextField
          v-model="info.topic"
          :label="$l('find.filters.topic')"
          :rules="(val) => val != '' && val != null"
          :area="false"
          :flat="false"
          :backgroundColor="'var(--v-card-lighten3)'"
          :borderRadius="'0px'"
        />
        <TextField
          v-model="info.details"
          :label="$l('find.filters.details')"
          :rules="(val) => val != '' && val != null"
          :area="true"
          :flat="false"
          :backgroundColor="'var(--v-card-lighten3)'"
          :borderRadius="'0px 0px 15px 15px'"
        />
      </FilterPanel>

      <PageViewer id="pageViewer" :imgs="info.imgs" :upload="true" />

      <FilterPanel ref="panel2">
        <ExpandableListSelector
          v-model="info.languages"
          :label="$l('find.filters.language.h')"
          :text="
            info.languages.map((l) => $l('data.languages.' + l)).join(', ')
          "
          :list="['EN', 'EST', 'RU']"
          :convertor="(item) => $l('data.languages.' + item)"
          :rules="(item) => item.length > 0"
          :flat="false"
          :backgroundColor="'var(--v-card-lighten3)'"
          :borderRadius="'15px 15px 0px 0px'"
        />

        <ExpandableSlider
          v-model="info.age"
          :label="$l('find.filters.tutor_age.h')"
          :text="info.age.join(' - ')"
          :min="15"
          :max="100"
          :rules="(item) => item.length > 0"
          :flat="false"
          :backgroundColor="'var(--v-card-lighten3)'"
          :borderRadius="'0px'"
        />
        <ExpandableSlider
          v-model="info.price"
          :label="$l('find.filters.price.h')"
          :text="`${info.price[0]} - ${info.price[1]} UC/${$l(
            'find.filters.price.p'
          )}`"
          :min="0"
          :max="150"
          :rules="(item) => item.length > 0"
          :flat="false"
          :backgroundColor="'var(--v-card-lighten3)'"
          :borderRadius="'0px 0px 15px 15px'"
        />
      </FilterPanel>

      <v-btn @click="request()" id="requestBtn" rounded outlined color="accent">
        {{ $l("find.request") }}
      </v-btn>
    </div>

    <v-snackbar max-width="800" color="accent" timeout="-1" v-model="showAlert">
      {{ $l("find.sure") }}
      <div id="snackButtons">
        <v-btn @click="sendLessonRequest()" text>
          {{ $l("find.begin") }}
        </v-btn>
        <v-btn @click="showAlert = false" text>
          {{ $l("find.cancel") }}
        </v-btn>
      </div>
    </v-snackbar>
  </Background>
</template>

<script>
import Background from "@/components/global/background/Background.vue";
import Subheader from "@/components/app/Subheader.vue";

import FilterPanel from "@/components/filterPanel/FilterPanel.vue";
import ExpandableListSelector from "@/components/filterPanel/ExpandableListSelector.vue";
import ExpandableSlider from "@/components/filterPanel/ExpandableSlider.vue";
import TextField from "@/components/filterPanel/TextField";

import PageViewer from "@/components/global/PageViewer.vue";

export default {
  permisions: {
    roles: ["ROLE_STUDENT"],
    redirect: "LogIn",
  },
  components: {
    Background,
    Subheader,

    FilterPanel,
    ExpandableListSelector,
    ExpandableSlider,
    TextField,
    PageViewer,
  },
  data() {
    return {
      info: {
        name: "Someone", // Pull from account !!!!
        grade: 12, //Pull from account !!!!
        subject: null, // null
        topic: "",
        details: "",

        // ----------------- this are going to be checked but not rendered
        languages: [], // ["EN"]
        age: [15, 100],
        price: [0, 150],
        // -----------------

        imgs: [
          // {
          //   name: "physics1.jpg",
          //   imageUrl:
          //     "https://d2vlcm61l7u1fs.cloudfront.net/media%2F8d1%2F8d1789e9-0fb5-467e-906c-7998be55dcf4%2Fphp2hhv2V.png",
          // },
          // {
          //   name: "physics2.jpg",
          //   imageUrl:
          //     "https://slideplayer.com/slide/6196941/18/images/22/Relationships+in+this+problem%3A.jpg",
          // },
          // {
          //   name: "physics3.jpg",
          //   imageUrl:
          //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROzKLzwCiWjKi4IIQVFeOvHoy2lW0ivmxVzA&usqp=CAU",
          // },
        ],
      },

      checkInProgress: false,
      showAlert: false,
    };
  },
  methods: {
    refresh() {
      this.$refs.panel.refresh();
    },
    async request() {
      if (this.checkInProgress) return;

      if (await this.$refs.panel.isValid()) this.showAlert = true;
    },
    getThis() {
      return this;
    },
    ifPanel2IsValid(action, callback) {
      callback(this.$refs.panel2[action]());
    },
    refreshPanel2(action) {
      this.$refs.panel2[action]();
    },
    async sendLessonRequest() {
      const bool = await this.$store.dispatch("lesson/student/request", {
        info: this.info,
        vm: this.getThis(),
      });
      if (bool) this.$router.push({ name: "ChooseATutor" });
    },
    keyPressed(e) {
      if (e.key === "Enter") this.request();
    },
  },
  mounted() {
    addEventListener("keypress", this.keyPressed);
  },
  beforeDestroy() {
    removeEventListener("keypress", this.keyPressed);
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

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

#content {
  @include flexbox(column);
  max-width: 350px;
  min-width: 250px;
  height: max-content;
  margin: calc(106px + 6rem) 1rem 6rem 1rem;
}
#pageViewer {
  margin: 2rem 0 2rem 0;
  width: 100%;
}
#refreshBtn {
  background-color: var(--v-background-base);
  color: var(--v-secondary-darken4);
  opacity: 0.6;
  margin-top: 0.3rem;
  margin-bottom: 2px;
  transform: scale(0.9);

  transition: background-color 600ms;
  &:hover {
    background-color: var(--v-secondary-darken1);
  }
}
#requestBtn {
  margin-top: 48px;
}
</style>
