<template>
  <div id="wrapper" ref="tutorSettingsWrapper">
    <FilterPanel
      ref="panel"
      @next="(action, callback) => callback($refs.panel2[action]())"
    >
      <TextField
        v-model="data.moto"
        :label="$l('set_up.motto')"
        :borderRadius="'15px 15px 0px 0px'"
        :flat="false"
        :rules="() => true"
      />
      <!-- :rules="(val) => val != '' && val != null" -->
      <TextField
        :area="true"
        v-model="data.about"
        :label="$l('set_up.about')"
        :borderRadius="'0px 0px 15px 15px'"
        :flat="false"
        :rules="() => true"
      />
      <!-- :rules="(val) => val != '' && val != null" -->
    </FilterPanel>

    <FilterPanel
      ref="panel2"
      @next="(action, callback) => callback($refs.panel3[action]())"
      id="zoomDiv"
    >
      <TextField
        v-model="data.conferenceLink"
        class="zoom"
        :label="$l('set_up.zoom')"
        img="zoom-icon"
        :flat="false"
        :rules="linkRules"
        :errMsg="link.errMsg"
      />
      <div id="dialogContainer">
        <Dialog class="notInput">
          <template v-slot:object>
            <button id="dialog">?</button>
          </template>

          <template v-slot:title id="title">
            {{ $l("set_up.dialog.title") }}
          </template>

          <template v-slot:text>
            {{ $l("set_up.dialog.text") }}
            <a
              target="_blank"
              href="https://support.zoom.us/hc/en-us/articles/201362843-Personal-meeting-ID-PMI-and-personal-link"
            >
              {{ $l("set_up.dialog.link") }}</a
            >
          </template>
        </Dialog>
      </div>
    </FilterPanel>

    <FilterPanel ref="panel3">
      <ExpandableListSelector
        v-model="data.subjects"
        :label="$l('set_up.subjects')"
        :text="data.subjects.map((l) => $l('data.subjects.' + l)).join(', ')"
        :list="['MATH', 'BIOL', 'ESL', 'PHYS', 'GEOG', 'CHEM', 'CIS']"
        :convertor="(item) => $l('data.subjects.' + item)"
        :searchLabel="$l('find.filters.subject.search')"
        :rules="(item) => item.length > 0"
        borderRadius="15px 15px 0px 0px"
        :flat="false"
      />
      <ExpandableSlider
        v-model="data.audience"
        :label="$l('find.filters.audience.h')"
        :text="data.audience.join(' - ')"
        :min="1"
        :max="12"
        borderRadius="0px"
        :rules="() => true"
        :flat="false"
      />
      <ExpandableListSelector
        v-model="data.languages"
        :label="$l('find.filters.language.h')"
        :text="data.languages.map((l) => $l('data.languages.' + l)).join(', ')"
        :list="['EN', 'EST', 'RU']"
        :convertor="(item) => $l('data.languages.' + item)"
        :multiple="true"
        :rules="(item) => item.length > 0"
        borderRadius="0px 0px 15px 15px"
        :flat="false"
      />
    </FilterPanel>
  </div>
</template>

<script>
import FilterPanel from "@/components/filterPanel/FilterPanel.vue";
import ExpandableListSelector from "@/components/filterPanel/ExpandableListSelector.vue";
import ExpandableSlider from "@/components/filterPanel/ExpandableSlider.vue";
import TextField from "@/components/filterPanel/TextField";

import Dialog from "@/components/global/Dialog.vue";
import { ruleBase } from "@/plugins/GlobalMethods.js";

export default {
  components: {
    FilterPanel,
    ExpandableListSelector,
    ExpandableSlider,
    TextField,

    Dialog,
  },
  data() {
    return {
      link: {
        errMsg: "",
      },
    };
  },
  methods: {
    async isValid() {
      return await this.$refs.panel.isValid();
    },
    linkRules(v) {
      const title = "link";
      const self = this;
      this.link.errMsg = "";
      const ifNotNull = (v) =>
        rule({
          condition: !!v && v.length > 0,
          pathEnd: "link.require",
        });

      const ifHasHttp = (v) =>
        rule({
          condition: v.match(new RegExp("https?://")),
          pathEnd: "link.valid",
        });

      return ifNotNull(v) && ifHasHttp(v);

      function rule({ condition, pathEnd, lParams }) {
        return ruleBase({
          self,
          title,
          condition,
          pathEnd,
          lParams,
        });
      }
    },
  },
  props: {
    data: Object,
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

#wrapper {
  width: 25rem;
  @media (max-width: 450px) {
    width: 100%;
    padding: 0 1rem;
  }

  & > *:not(:last-child) {
    margin-bottom: 2rem;
  }
}

.motto {
  border-radius: 15px 15px 0 0;
}

.about {
  border-radius: 0 0 15px 15px;
}

#zoomDiv {
  position: relative;

  .zoom {
    border-radius: 15px;
  }

  #dialogContainer {
    position: absolute;
    left: 102%;
    top: 50%;
    transform: translateY(-50%);

    @media (max-width: 450px) {
      left: 84%;
      top: 50%;
      transform: translateY(-50%);
    }

    #dialog {
      @include box-size(30px);
      border-radius: 50%;
      color: var(--v-secondary-darken2);

      transition: color 300ms ease-in-out;
      &:hover {
        color: var(--v-secondary-darken3);
      }
    }
  }
}

#panels {
  border-radius: 15px;
}
</style>
