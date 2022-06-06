import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#000000",
        secondary: "#FFFFFF",
        background: "EFEFEF",
        backgroundHover: "EAEAEA",
        card: "F6F6F6",
        header: "#F8F8F8",
        headerHover: "#F4F4F4",
        accent: "#FFA500",
        accentHover: "#FF8C00",
        error: "#ef5350",
        thumb: "#bbb",
        thumbHover: "#b6b6b6",
        innerThumb: "#ddd",
        innerThumbHover: "#d6d6d6",
      },
      dark: {
        background: "#131313",
        btnOn: "#333",
        btnOff: "#131313",
        light: "#bbb",
        card: "#333",
        accent: "#FFA500",
      },
    },
  },
});

