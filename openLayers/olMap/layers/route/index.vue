<script>
  import BaseLayer from '../BaseLayer.vue'
  import { nanoid } from 'nanoid'
  import axios from 'axios'
  import qs from 'qs'
  import { addVectorSource, setFeatures, setStyle } from '../../utils'
  import VectorLayer from 'ol/layer/Vector'

  export default {
    name: 'VRoute',
    extends: BaseLayer,
    inject: ['VMap'],
    props: {
      layerId: {
        type: String,
        default() {
          return `arcgis-route-layer-${nanoid()}`
        },
      },
      serviceUrl: {
        type: String,
        default() {
          return ''
        },
      },
      method: {
        type: String,
        default: 'GET',
        validator(value) {
          return ['GET', 'POST', 'get', 'post'].includes(value)
        },
      },
      stops: {
        type: Array,
        default() {
          return []
        },
      },
      routeType: {
        type: String,
        require: true,
        validator(value) {
          return ['arcgis', 'graphhopper'].includes(value)
        },
      },
      showStart: {
        type: Boolean,
        default: true,
      },
      showPass: {
        type: Boolean,
        default: true,
      },
      showEnd: {
        type: Boolean,
        default: true,
      },
      routeStyle: {
        type: Object,
        default: undefined,
      },
      // arcgis
      barriers: {
        type: String,
        default: '',
      },
      polylineBarriers: {
        type: String,
        default: '',
      },
      polygonBarriers: {
        type: String,
        default: '',
      },
      outSR: {
        type: String,
        default: '',
      },
      ignoreInvalidLocations: {
        type: Boolean,
        default: true,
      },
      accumulateAttributeNames: {
        type: String,
        default: '',
      },
      impedanceAttributeName: {
        type: String,
      },
      restrictionAttributeNames: {
        type: String,
        default: '',
      },
      attributeParameterValues: {
        type: String,
        default: '',
      },
      restrictUTurns: {
        type: String,
        default: 'esriNFSBAllowBacktrack',
      },
      useHierarchy: {
        type: Boolean,
        default: false,
      },
      returnDirections: {
        type: Boolean,
        default: false,
      },
      returnRoutes: {
        type: Boolean,
        default: true,
      },
      returnStops: {
        type: Boolean,
        default: true,
      },
      returnBarriers: {
        type: Boolean,
        default: false,
      },
      returnPolygonBarriers: {
        type: Boolean,
        default: false,
      },
      directionsLanguage: {
        type: String,
        default: 'en',
      },
      directionsStyleName: {
        type: String,
        default: '',
      },
      outputLines: {
        type: String,
        default: 'esriNAOutputLineTrueShape',
      },
      findBestSequence: {
        type: Boolean,
        default: false,
      },
      preserveFirstStop: {
        type: Boolean,
        default: true,
      },
      preserveLastStop: {
        type: Boolean,
        default: true,
      },
      useTimeWindows: {
        type: Boolean,
        default: false,
      },
      startTime: {
        type: Number,
        default: 0,
      },
      startTimeIsUTC: {
        type: Boolean,
        default: false,
      },
      outputGeometryPrecision: {
        type: String,
        default: '',
      },
      outputGeometryPrecisionUnits: {
        type: String,
        default: 'esriDecimalDegrees',
      },
      directionsOutputType: {
        type: String,
        default: 'esriDOTComplete',
      },
      directionsTimeAttributeName: {
        type: String,
        default: '',
      },
      directionsLengthUnits: {
        type: String,
        default: 'esriNAUMiles',
      },
      returnZ: {
        type: Boolean,
        default: false,
      },
      travelMode: {
        type: String,
        default: '',
      },
      f: {
        type: String,
        default: 'pjson',
      },
      // graphhopper
      type: {
        type: String,
        default: 'json',
      },
      points_encoded: {
        type: Boolean,
        default: false,
      },
      point_hint: {
        type: Array,
        default() {
          return []
        },
      },
      locale: {
        type: String,
        default: 'en',
      },
      vehicle: {
        type: String,
        default: 'car',
      },
      weighting: {
        type: String,
        default: 'fastest',
      },
      elevation: {
        type: Boolean,
        default: false,
      },
      convert: {
        type: String,
      },
    },
    data() {
      return {
        layer: null,
        source: null,
        features: [],
        defaultStyle: {
          line: {
            stroke: {
              color: 'rgba(67,126,255,1)',
              width: 4,
            },
          },
          start: {
            circle: {
              radius: 15,
              fill: {
                color: 'rgba(255,255,255,1)',
              },
              stroke: {
                color: 'rgba(67,126,255,1)',
                width: 2,
              },
            },
            text: {
              text: '???',
              fill: {
                color: '#3d73e8',
              },
            },
          },
          end: {
            circle: {
              radius: 15,
              fill: {
                color: 'rgba(255,255,255,1)',
              },
              stroke: {
                color: 'rgba(67,126,255,1)',
                width: 2,
              },
            },
            text: {
              text: '???',
              fill: {
                color: '#3d73e8',
              },
            },
          },
          pass: {
            circle: {
              radius: 8,
              fill: {
                color: 'rgba(255,255,255,1)',
              },
              stroke: {
                color: 'tomato',
                width: 4,
              },
            },
          },
        },
        routeData: null, // Arcgis ??? Graphhopper??????????????????
      }
    },
    computed: {
      map() {
        return this.VMap.map
      },
    },
    watch: {
      stops: {
        handler() {
          this.init()
        },
        immediate: false,
        deep: true,
      },
      visible: {
        handler(value) {
          this.layer.setVisible(value)
        },
        immediate: false,
      },
      zIndex: {
        handler(value) {
          this.layer.setZIndex(value)
        },
        immediate: false,
      },
      maxZoom: {
        handler(value) {
          this.layer.setMaxZoom(value)
        },
        immediate: false,
      },
      minZoom: {
        handler(value) {
          this.layer.setMinZoom(value)
        },
        immediate: false,
      },
      extent: {
        handler(value) {
          this.layer.setExtent(value)
        },
        immediate: false,
      },
    },
    mounted() {
      this.init()
    },
    beforeUnmount() {
      this.layer.getSource().clear()
      this.map.removeLayer(this.layer)
    },
    methods: {
      /**
       * ??????Arcgis????????????????????????
       * @returns {Promise<*[]|[]>}
       */
      async getArcgisRouteData() {
        let params = this.$props
        if (this.stops.length > 0) {
          params = {
            ...this.$props,
            ...{ stops: this.stops.join(';'), routeStyle: '' },
          }
          if (this.method.toUpperCase() === 'POST') {
            return axios
              .post(this.serviceUrl, qs.stringify(params))
              .then((res) => {
                if (res.status === 200 && res.data) {
                  this.routeData = res.data
                }
                return this.getArcgisData(res)
              })
          } else {
            return axios.get(this.serviceUrl, { params }).then((res) => {
              if (res.status === 200 && res.data) {
                this.routeData = res.data
              }
              return this.getArcgisData(res)
            })
          }
        } else {
          return []
        }
      },
      /**
       * ??????Arcgis?????????????????????????????????
       * @param res
       * @returns {*[]}
       */
      getArcgisData(res) {
        if (
          res.status === 200 &&
          res.data &&
          res.data.routes.features.length > 0
        ) {
          const routes = res.data.routes
          // const stops = res.data.stops
          if (routes.features[0].geometry.paths.length > 0) {
            const routesFeatures = []
            if (this.showStart) {
              routesFeatures.push({
                type: 'point',
                style: this.routeStyle
                  ? this.routeStyle.start
                  : this.defaultStyle.start,
                coordinates: routes.features[0].geometry.paths[0][0],
                featureType: 'start',
                convert: this.convert,
              })
            }
            routesFeatures.push({
              type: 'polyline',
              style: this.routeStyle
                ? this.routeStyle.line
                : this.defaultStyle.line,
              coordinates: routes.features[0].geometry.paths[0],
              featureType: 'line',
              convert: this.convert,
            })
            if (this.showPass && this.stops.length > 1) {
              this.stops
                .slice(1, this.stops.length - 1)
                .forEach((point, index) => {
                  routesFeatures.push({
                    type: 'point',
                    style: this.routeStyle
                      ? this.routeStyle.pass
                      : this.defaultStyle.pass,
                    coordinates: point,
                    stopIndex: index,
                    featureType: 'stops',
                  })
                })
              // this.stops.slice(1, this.stops.length - 1).forEach((point, index) => {
              //   routesFeatures.push({
              //     type: 'point',
              //     style: this.routeStyle ? this.routeStyle.pass : this.defaultStyle.pass,
              //     coordinates: point,
              //     stopIndex: index,
              //     featureType: 'stops',
              //     convert: this.convert
              //   })
              // })
            }
            if (this.showEnd) {
              routesFeatures.push({
                type: 'point',
                style: this.routeStyle
                  ? this.routeStyle.end
                  : this.defaultStyle.end,
                coordinates:
                  routes.features[0].geometry.paths[0][
                    routes.features[0].geometry.paths[0].length - 1
                  ],
                featureType: 'end',
                convert: this.convert,
              })
            }
            return setFeatures(routesFeatures, this.map)
          }
        } else {
          return []
        }
      },
      /**
       *  ??????Graphhopper????????????????????????
       * @returns {Promise<*[]|[]>}
       */
      async getGraphhopperRouteData() {
        const props = { ...this.$props, ...{ routeStyle: '' } }
        let params = qs.stringify(props)
        if (this.stops.length > 0) {
          let points = '&point='
          this.stops.forEach((point, index) => {
            points =
              points +
              point[1] +
              ',' +
              point[0] +
              (index < this.stops.length - 1 ? '&point=' : '')
          })
          params = params + points
          if (this.method.toUpperCase() === 'POST') {
            return axios.post(this.serviceUrl, params).then((res) => {
              if (res.status === 200 && res.data) {
                this.routeData = res.data
              }
              return this.getGraphhopperData(res)
            })
          } else {
            return axios.get(this.serviceUrl + '?' + params).then((res) => {
              if (res.status === 200 && res.data) {
                this.routeData = res.data
              }
              return this.getGraphhopperData(res)
            })
          }
        } else {
          return []
        }
      },
      /**
       * ??????Graphhopper?????????????????????????????????
       * @param res
       * @returns {*[]}
       */
      getGraphhopperData(res) {
        if (
          res.status === 200 &&
          res.data &&
          res.data.paths[0].points.coordinates.length > 0
        ) {
          const routes = res.data.paths[0]
          if (routes.points.coordinates.length > 0) {
            const routesFeatures = []
            if (this.showStart) {
              routesFeatures.push({
                type: 'point',
                style: this.routeStyle
                  ? this.routeStyle.start
                  : this.defaultStyle.start,
                coordinates: routes.points.coordinates[0],
                featureType: 'start',
              })
            }
            routesFeatures.push({
              type: 'polyline',
              style: this.routeStyle
                ? this.routeStyle.line
                : this.defaultStyle.line,
              coordinates: routes.points.coordinates,
              featureType: 'line',
            })
            if (this.showPass) {
              this.stops
                .slice(1, this.stops.length - 1)
                .forEach((point, index) => {
                  routesFeatures.push({
                    type: 'point',
                    style: this.routeStyle
                      ? this.routeStyle.pass
                      : this.defaultStyle.pass,
                    coordinates: point,
                    featureType: 'stops',
                    stopIndex: index,
                  })
                })
            }
            if (this.showEnd) {
              routesFeatures.push({
                type: 'point',
                style: this.routeStyle
                  ? this.routeStyle.end
                  : this.defaultStyle.end,
                coordinates:
                  routes.points.coordinates[
                    routes.points.coordinates.length - 1
                  ],
                featureType: 'end',
              })
            }
            return setFeatures(routesFeatures, this.map)
          }
        } else {
          return []
        }
      },
      async init() {
        this.features = []
        if (this.source) {
          this.source.clear()
        } else {
          this.source = addVectorSource({}, this.map)
        }
        if (this.stops.length <= 0) return false
        if (this.stops.length === 1) {
          const routesFeatures = [
            {
              type: 'point',
              style: this.routeStyle
                ? this.routeStyle.start
                : this.defaultStyle.start,
              coordinates: this.stops[0],
              featureType: 'start',
            },
          ]
          this.features = setFeatures(routesFeatures, this.map)
        } else if (this.stops.length >= 2) {
          this.features =
            this.routeType === 'arcgis'
              ? await this.getArcgisRouteData()
              : await this.getGraphhopperRouteData()
        }
        this.source.addFeatures(this.features)
        const layerOpt = { ...this.$props, ...{ source: this.source } }
        if (!this.layer) {
          this.layer = new VectorLayer(layerOpt)
          this.layer.setStyle((feature) => {
            if (feature.get('style')) {
              return setStyle(feature.get('style'))
            } else {
              if (this.FeatureStyle) {
                return setStyle(this.FeatureStyle)
              } else {
                return setStyle({
                  fill: {
                    color: 'rgba(67,126,255,0.15)',
                  },
                  stroke: {
                    color: 'rgba(67,126,255,1)',
                    width: 1,
                    // lineDash: [20, 10, 20, 10]
                  },
                })
              }
            }
          })
          this.layer.set('id', this.layerId)
          this.layer.set('type', 'vector')
          this.layer.set('users', true)
          this.layer.setZIndex(1)
          this.map.addLayer(this.layer)
        }
        this.$emit('render', this.routeData, this.map, this.features)
      },
    },
    render(createElement, context) {
      return null
    },
  }
</script>

<style scoped></style>
