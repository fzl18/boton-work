<template>
  <el-row :gutter="0" class="core-query-form">
    <slot></slot>
  </el-row>
</template>

<script>
  export default {
    name: 'CoreQueryForm',
  }
</script>

<style lang="scss" scoped>
  @mixin panel {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: flex-start;
    min-height: $base-input-height;
    margin: 0 0 $base-padding/2 0;
    > .el-button {
      margin: 0 10px $base-padding/2 0px !important;
    }
  }

  .core-query-form {
    ::v-deep() {
      .el-form-item:first-child {
        margin: 0 0 $base-padding/2 0 !important;
      }
      .el-form-item + .el-form-item {
        margin: 0 0 $base-padding/2 10px !important;
      }

      .top-panel {
        @include panel;
      }

      .bottom-panel {
        @include panel;
        border-top: 1px solid #dcdfe6;
      }

      .left-panel {
        @include panel;
      }

      .right-panel {
        @include panel;

        justify-content: flex-end;
      }
    }
  }
</style>
