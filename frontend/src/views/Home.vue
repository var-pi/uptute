<template>
  <div id="container" ref="container">
    <!-- <div class="img">
      <div class="img-container">
        <div class="img-blur">
          <div class="img-content">
            <h1>{{ $l("home.landing.title") }}</h1>
            <h2>{{ $l("home.landing.subtitle") }}</h2>
          </div>
        </div>
      </div>
    </div> -->

    <div id="hero" :style="`--fadeTimeout: ${heroFadeTimeout}ms`">
      <HeroCanvas
        :fadeTimeout="heroFadeTimeout"
        class="heroCanvas"
        ref="heroCanvas"
      ></HeroCanvas>

      <div id="heroWrapper" class="boxShadow">
        <!-- <div id="moto">Fun. Fast. Friendly.</div> -->
        <!-- id="beginWrapper" -->

        <!-- <Begin
          v-if="roles.length == 0"
          :color="menu.color"
          :textColor="menu.textColor"
          :borderRadius="menu.borderRadius"
          :border="menu.border"
          :padding="menu.padding"
        /> -->
        <Account
          v-if="roles.length == 0"
          :ifWithIcon="false"
          :color="menu.color"
          :textColor="menu.textColor"
          :borderRadius="menu.borderRadius"
          :border="menu.border"
          :padding="menu.padding"
        />
        <LessonMenu
          v-if="roles.length > 0"
          :ifWithIcon="false"
          :color="menu.color"
          :textColor="menu.textColor"
          :borderRadius="menu.borderRadius"
          :border="menu.border"
          :padding="menu.padding"
        />
      </div>
    </div>

    <div id="innerContainer" ref="innerContainer">
      <SliderLayout
        ref="block0"
        :title="$l('home.mission.title')"
        :elements="[
          {
            img: 'happiness',
            txt: $l('home.mission.list.process'),
          },
          {
            img: 'heart',
            txt: $l('home.mission.list.passion'),
          },
          {
            img: 'coins',
            txt: $l('home.mission.list.affordable'),
          },
        ]"
      />
      <CheckerLayout
        inversed
        ref="block1"
        color="background"
        :title="$l('home.how_it_works.title')"
        :rows="[
          {
            img: 'howItWorks/filter',
            title: $l('home.how_it_works.list.filters.h'),
            txt: $l('home.how_it_works.list.filters.p'),
          },
          {
            img: 'howItWorks/choosing',
            title: $l('home.how_it_works.list.choose.h'),
            txt: $l('home.how_it_works.list.choose.p'),
          },
          {
            img: 'howItWorks/notebook',
            title: $l('home.how_it_works.list.lesson.h'),
            txt: $l('home.how_it_works.list.lesson.p'),
          },
          {
            img: 'howItWorks/rating',
            title: $l('home.how_it_works.list.rate.h'),
            txt: $l('home.how_it_works.list.rate.p'),
          },
        ]"
      />
      <CheckerLayout
        ref="block2"
        inversed
        color="header"
        :title="$l('why_us.student.title')"
        :rows="[
          {
            img: 'whyUpTute/forStudent/piggy-bank',
            title: $l('why_us.student.list.price.h'),
            txt: $l('why_us.student.list.price.p'),
          },
          {
            img: 'whyUpTute/forStudent/fast',
            title: $l('why_us.student.list.now.h'),
            txt: $l('why_us.student.list.now.p'),
          },
          {
            img: 'whyUpTute/forStudent/friend',
            title: $l('why_us.student.list.understand.h'),
            txt: $l('why_us.student.list.understand.p'),
          },
        ]"
      />
      <CheckerLayout
        ref="block3"
        color="background"
        :title="$l('why_us.tutor.title')"
        :rows="[
          {
            img: 'whyUpTute/forTutor/goal',
            title: $l('why_us.tutor.list.not_just.h'),
            txt: $l('why_us.tutor.list.not_just.p'),
          },
          {
            img: 'whyUpTute/forTutor/money-bag',
            title: $l('why_us.tutor.list.salary.h'),
            txt: $l('why_us.tutor.list.salary.p'),
          },
          {
            img: 'whyUpTute/forTutor/algorithm',
            title: $l('why_us.tutor.list.price.h'),
            txt: $l('why_us.tutor.list.price.p'),
          },
          {
            img: 'whyUpTute/forTutor/time-management',
            title: $l('why_us.tutor.list.flexible.h'),
            txt: $l('why_us.tutor.list.flexible.p'),
          },
        ]"
      />
    </div>
  </div>
</template>

<script>
import SliderLayout from "@/components/global/layouts/SliderLayout.vue";
// import Begin from "@/components/header/Begin.vue";
import Account from "@/components/header/Account.vue";
import LessonMenu from "@/components/header/LessonMenu.vue";
import CheckerLayout from "@/components/global/layouts/CheckerLayout.vue";
import HeroCanvas from "@/components/HeroCanvas.vue";

export default {
  name: "Home",
  path: "/",
  permissons: {
    roles: "ALL",
    redirect: "Home",
  },
  components: {
    SliderLayout,
    CheckerLayout,
    // Begin,
    Account,
    LessonMenu,
    HeroCanvas,
  },
  data() {
    return {
      menu: {
        color: "var(--v-background-base)",
        textColor: "var(--v-secondary-darken3)",
        borderRadius: "15px",
        border: "dashed 2px var(--v-accent-base)",
        padding: "1rem 3rem",
      },
      url:
        "https://player.vimeo.com/video/20924263?muted=1&autoplay=1&loop=1&sidedock=0&color=ffa500&enablejsapi=1",
      heroFadeTimeout: 300,
    };
  },
  computed: {
    roles: function() {
      return this.$store.getters["auth/roles"];
    },
  },
  mounted() {
    document.addEventListener("mouseenter", this.$refs.heroCanvas.mouseEnter);
  },
  beforeDestroy() {
    document.removeEventListener(
      "mouseenter",
      this.$refs.heroCanvas.mouseEnter
    );
  },
  //   data() {
  //     return {
  //       currentBlock: 0,
  //       oldScrollPos: 0,
  //     };
  //   },
  //   mounted() {
  //     document.addEventListener("scroll", this.scrolled);
  //   },
  //   destroyed() {
  //     document.removeEventListener("scroll", this.scrolled);
  //   },
  //   methods: {
  //     scrolled() {
  //       var dom = this.$refs[
  //         `block${this.currentBlock}`
  //       ].$el.getBoundingClientRect();
  //       var newScrollPos = window.scrollY;

  //       var offsetY = 0;
  //       console.log(document.documentElement.scrollTop);

  //       if (
  //         dom.top < window.innerHeight - dom.height &&
  //         this.currentBlock != 3 &&
  //         newScrollPos > this.oldScrollPos
  //       ) {
  //         for (var i = 0; i <= this.currentBlock; i++) {
  //           offsetY += this.$refs[`block${i}`].$el.getBoundingClientRect().height;
  //         }

  //         console.log("TRIED DOWN");

  //         window.scrollTo(0, offsetY + window.innerHeight, "smooth"); //innerHeight for Hero

  //         this.currentBlock++;
  //         // }
  //       }

  //       // -------------
  //       else if (
  //         dom.top > 0 &&
  //         this.currentBlock != 0 &&
  //         newScrollPos < this.oldScrollPos
  //       ) {
  //         if (this.currentBlock > 0) {
  //           for (var l = 0; l <= this.currentBlock - 1; l++) {
  //             offsetY += this.$refs[`block${l}`].$el.getBoundingClientRect()
  //               .height;
  //           }
  //         }

  //         console.log("TRIED UP");
  //         console.log("domTop:" + dom.top);
  //         console.log("new: " + newScrollPos);
  //         console.log("old: " + this.oldScrollPos);

  //         document.documentElement.scrollTop = offsetY;

  //         this.currentBlock--;
  //         // }
  //       }
  //       this.oldScrollPos = newScrollPos;
  //     },
  //   },
};
</script>

<style scoped lang="scss">
@import "@/scss/mixins.scss";

html:hover .heroCanvas {
  animation: fadeOutIn calc(var(--fadeTimeout) * 2) ease-out both;
}

#container {
  #innerContainer {
    margin-top: 100vh;
  }

  .heroCanvas {
    opacity: 1;
    transition: all;
  }

  @keyframes fadeOutIn {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}

h1 {
  color: var(--v-primary-base);
}

#hero {
  position: fixed;
  background: var(--v-background-base);
  top: 0;
  width: 100vw;
  height: 100vh;
  @include flexbox();
  #heroWrapper {
    border-radius: 15px;
    // padding: 1rem 3rem;
    @include box-shadow();
    background: #efefefcc;

    // & > * {
    //   padding: 16px;
    //   padding-top: 0;
    //   &:first-child {
    //     padding-top: 16px;
    //   }
    // }

    #moto {
      font-size: 28px;
      letter-spacing: 0.5ch;
    }
  }
}

// ------------------- hero img --------------------------

// .img {
//   background-image: url("../assets/images/home.jpg");
//   height: 100vh;
//   width: 100vw;
//   background-attachment: fixed;
//   background-repeat: no-repeat;
//   background-size: cover;
//   background-position: 41%;
//   position: relative;
// }
// .img-container {
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   clip: rect(0, auto, auto, 0);
// }
// .img-blur {
//   top: 5%;
//   position: sticky;
//   max-width: fit-content;
//   float: right;
//   margin: 20px var(--side-margin);
// }
// @media (min-width: 700px) {
//   .img-content h2,
//   .img-content h1 {
//     text-align: center;
//   }
// }
// .img-content::before {
//   position: absolute;
//   content: "";

//   $size: calc(100% + 2 * var(--side-margin));
//   width: $size;
//   height: $size;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
//   z-index: -1;
//   mask: rgba(0, 0, 0, 1);
//   mask: radial-gradient(
//     closest-side,
//     rgba(0, 0, 0, 1) max(40%, 130px),
//     rgba(0, 0, 0, 0) 100%
//   );
//   backdrop-filter: blur(5px);
//   background-color: rgba($color: #fff, $alpha: 0.4);
// }
</style>
