<template>
  <el-breadcrumb class="breadcrumb-container" separator=">">
    <el-breadcrumb-item v-for="item in levelList" :key="item.path">
      <!-- <a @click.prevent="handleLink(item.redirect)"> -->
      {{ translateTitle(item.meta.title) }}
      <!-- </a> -->
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'

  export default {
    name: 'BtBreadcrumb',
    data() {
      return {
        levelList: this.getBreadcrumb(),
      }
    },
    watch: {
      $route() {
        this.levelList = this.getBreadcrumb()
      },
    },
    methods: {
      translateTitle,
      getBreadcrumb() {
        return this.$route.matched
        // return this.$route.matched.filter(
        //   (item) => item.name && item.meta.title
        // )
      },
      handleLink(redirect) {
        this.$router.push(redirect)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .breadcrumb-container {
    height: $base-nav-bar-height;
    font-size: $base-font-size-default;
    line-height: $base-nav-bar-height;

    ::v-deep() {
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          a {
            display: flex;
            float: left;
            font-weight: normal;
            color: #515a6e;

            i {
              margin-right: 3px;
            }
          }
        }

        &:last-child {
          .el-breadcrumb__inner {
            a {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
