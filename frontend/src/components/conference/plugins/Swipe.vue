<script lang="ts">
import { Direction } from "@/types";
import ToggleStore from "@/store/modules/conference/toggleStore";
import { Vue, Component } from "vue-property-decorator";
import { HorizontalSwipe, isDirectionToggled } from "../types";

@Component
export default class ConferenceSwipe extends Vue {
  mounted() {
    this.$mb.addSwipedListener(this.onSwiped);
  }
  beforeDestroy() {
    this.$mb.removeSwipedListener(this.onSwiped);
  }

  onSwiped(direction: Direction) {
    let name: HorizontalSwipe = { towards: "", from: "" };

    switch (direction) {
      case "left":
        name.towards = "settings";
        name.from = "chat";
        break;
      case "right":
        name.towards = "chat";
        name.from = "settings";
        break;
      default:
        return;
    }

    const isToggled: isDirectionToggled = {
      towards: ToggleStore.isToggled["top"][name.towards],
      from: ToggleStore.isToggled["top"][name.from],
    };

    let toggledName: string = "";

    if (isToggled.from) toggledName = name.from;
    else if (!isToggled.towards) toggledName = name.towards;
    else return;

    ToggleStore.toggle({ side: "top", name: toggledName });
  }
}
</script>
