<template>
  <div></div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import Highcharts3D from "highcharts/highcharts-3d";
HighchartsMore(Highcharts);
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
export default {
  props: ["options", "styles"],
  name: "highcharts",
  data() {
    return {
      chart: null,
      style: {
        width: "300px",
        height: "120px",
      },
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      this.$el.style.width = (this.styles.width || 800) + "px";
      this.$el.style.height = (this.styles.height || 400) + "px";
      this.chart = new Highcharts.Chart(this.$el, this.options);
    },
  },
};
</script>

<style lang="scss" scoped></style>
