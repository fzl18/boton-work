<template>
  <keep-alive :include="cachedRoutes">
    <router-view :key="$route.path" />
  </keep-alive>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'DynamicSegment',
    computed: {
      ...mapGetters({
        visitedRoutes: 'coreTabsBar/visitedRoutes',
      }),
      cachedRoutes() {
        return this.visitedRoutes
          .filter((item) => !item.meta.noKeepAlive)
          .flatMap((item) => item.matched)
      },
    },
  }
</script>
