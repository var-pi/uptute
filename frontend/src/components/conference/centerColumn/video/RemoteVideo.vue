<template>
  <VideoBase :isLocal="false" :muted="true" />
</template>

<script lang="ts">
import VideoBase from "@/components/conference/centerColumn/video/VideoBase.vue";

import { Vue, Component } from "vue-property-decorator";

@Component({ components: { VideoBase } })
export default class LocalVideo extends Vue {}
</script>
