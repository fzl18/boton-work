<template>
  <el-scrollbar
    :class="{ 'is-collapse': collapse, 'side-bar-common': layout === 'common' }"
    class="side-bar-container p-t-20"
  >
    <!-- <div class="toggle">
      <fold />
      <span>{{ appTitle }}</span>
    </div> -->
    <!-- horizontal / vertical -->
    <el-menu
      :active-text-color="variables['menu-color-active']"
      :background-color="variables['menu-background']"
      :text-color="variables['menu-color']"
      :collapse="collapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      :default-openeds="defaultOpens"
      :unique-opened="uniqueOpened"
      menu-trigger="hover"
      mode="horizontal"
      :class="collapse ? 'mini' : ''"
    >
      <core-menu
        v-for="route in routes"
        :key="route.path"
        :item="route"
      ></core-menu>
    </el-menu>
  </el-scrollbar>
</template>
<script>
  import variables from '@/config/variables.scss'
  import { mapGetters } from 'vuex'
  import { defaultOpeneds, uniqueOpened, title } from '@/config'

  export default {
    name: 'MinSideBar',
    props: {
      layout: {
        type: String,
        default: 'common',
      },
    },
    data() {
      return {
        uniqueOpened,
        variables: variables,
        appTitle: title,
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'coreSettings/collapse',
        routes: 'coreRoutes/routes',
      }),
      defaultOpens() {
        return defaultOpeneds
      },
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
    },
  }
</script>
<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: $base-color-white;
      background-color: $base-menu-background-active !important;
    }

    &.is-active {
      color: $base-color-white;
    }
  }

  .side-bar-container {
    $base-menu-item-height: 35px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1501; //$base-z-index;
    width: $base-left-menu-width - 64;
    height: 100vh;
    overflow: hidden;
    background: $base-menu-background;
    box-shadow: $base-box-shadow;
    transition: width $base-transition-time;

    &.side-bar-common {
      top: $base-nav-bar-height-small;
      height: calc(100vh - #{$base-nav-bar-height-small});
    }

    &.is-collapse {
      width: $base-left-menu-width-min-small;
      border-right: 0;
      top: $base-nav-bar-height-small;
      ::v-deep {
        .el-menu--collapse.el-menu {
          > .el-menu-item,
          > .el-submenu {
            // text-align: center;
            transition: width $base-transition-time;
            .el-menu-item {
              min-width: inherit;
            }
            .core-fas-icon {
              padding-right: 0;
            }

            .remix-icon {
              padding-right: 0;
            }
          }
        }
        .toggle {
          padding: 0;
          justify-content: center;
          span {
            display: none;
          }
        }
        // .el-menu-item,
        .el-submenu {
          padding: 0 !important;
          margin: 10px;
          margin-top: 0;
          height: 35px !important;
          line-height: 35px !important;
          span {
            width: 24px !important;
            height: 18px !important;
            line-height: 18px !important;
            visibility: inherit !important;
            font-size: $base-font-size-small !important;
            display: none;
          }
          .el-submenu__title {
            padding: 0 !important;
            height: 35px !important;
            line-height: 35px !important;
          }
        }
        .el-menu-item,
        .el-submenu__title {
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .el-menu--horizontal {
          padding: 0 6px;
          > .el-menu-item {
            padding: 0 16px;
          }
          > .el-menu--popup {
            left: 40px;
            min-width: 180px;
            padding: 10px;
            .el-submenu {
              min-width: 180px;
              margin: 0;
              .el-submenu__title {
                padding: 0 10px !important;
                align-items: flex-start;
              }
              .el-submenu__icon-arrow {
                top: 40%;
                right: 10px;
              }
              .el-menu--popup {
                top: -10px;
                .el-menu-item {
                  margin: 0px;
                  display: flex;
                  align-items: flex-start;
                  padding: 10px !important;
                }
              }
            }
          }
        }
        .el-menu--vertical {
          //?????????
          ul.el-menu--popup {
            border: none;
            margin: 0 0 0 15px;
            padding: 10px;
            min-width: 120px !important;
            border-radius: 6px;
            > .el-menu-item,
            > .el-submenu.el-submenu {
              align-items: flex-start;
              border-radius: 6px !important;
              line-height: inherit !important;
              height: inherit !important;
              min-width: 150px !important;
              &:hover {
                span,
                i {
                  font-weight: bold;
                }
              }
              span {
                width: inherit !important;
                display: inline-block;
              }
              .el-submenu__title {
                align-items: flex-start;
                min-width: 150px !important;
              }
            }
            .ul.el-menu--popup {
              margin-left: 0;
            }
          }
          .el-menu-item,
          .el-submenu {
            margin: 0 !important;
            text-align: left !important;
            border-radius: 6px !important;
            padding: 3px 10px !important;
            i:first-child {
              display: none;
            }
          }
        }
        .el-menu--collapse {
          border-right: 0;

          .el-submenu__icon-arrow {
            right: 0px;
            top: 52%;
          }
        }
      }
    }

    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-menu {
        border: 0;

        .core-fas-icon {
          padding-right: 3px;
          font-size: $base-font-size-default;
        }

        .remix-icon {
          padding-right: 10px;
          font-size: $base-font-size-default + 4;
        }
      }

      .el-menu-item,
      .el-submenu__title {
        font-size: $base-font-size-default;
        height: 35px !important;
        line-height: 35px !important;
        background: none !important;
        border: none !important;
        i {
          color: inherit;
        }
      }
      .el-submenu__title {
        display: flex;
        align-items: center;
        width: 100%;
        .el-icon-arrow-down {
          transform: rotateZ(-90deg) !important;
        }
        .el-submenu__icon-arrow {
          position: absolute;
          top: 39%;
          right: 10px;
        }
      }

      .el-menu-item {
        @include active;
      }
      .el-menu--horizontal {
        z-index: 0 !important;
        .el-menu--popup {
          top: -45px;
          left: 185px;
          padding: 10px;
          border-radius: 6px;
          .el-menu-item,
          .el-submenu,
          .el-submenu__title {
            border-radius: 6px;
            min-width: 120px !important;
            i:first-child {
              display: none;
            }
            .el-submenu__icon-arrow {
              transform: rotateZ(0deg) !important;
            }
          }
          .el-menu--popup {
            top: -10px;
            left: 8px;
          }
        }
        &[x-placement='top-start'] {
          z-index: -1 !important;
          .el-menu--popup {
            top: 45px;
          }
        }
      }
    }
    .el-menu--collapse {
      width: $base-left-menu-width-min-small;
    }
    .toggle {
      margin: 30px 0;
      padding: 0 28px;
      display: flex;
      align-items: center;
    }

    .el-menu--horizontal {
      display: flex;
      align-items: center;
      justify-items: center;
      flex-direction: column;
      .el-menu-item,
      .el-submenu,
      .el-submenu__title {
        display: flex;
        margin: 2px 0px;
        width: 90%;
        border-radius: 6px;
      }
      .el-submenu__title {
        display: flex;
      }
    }
  }
</style>
