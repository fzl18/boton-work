<script>
  import BaseLayer from '../BaseLayer.vue'
  import { nanoid } from 'nanoid'
  import {
    addClusterLayer,
    addVectorSource,
    setFeatures,
    setStyle,
    validObjKey,
    selectFeatureStyle,
  } from '../../utils'
  import VectorLayer from 'ol/layer/Vector'
  import { Modify, Select } from 'ol/interaction'
  import { Collection } from 'ol'
  import { unByKey } from 'ol/Observable'
  import { getVectorContext } from 'ol/render'
  import { easeOut } from 'ol/easing'
  import { Stroke, Style } from 'ol/style'
  import CircleStyle from 'ol/style/Circle'
  import { asArray } from 'ol/color'
  import { Cluster } from 'ol/source'

  export default {
    name: 'VVector',
    extends: BaseLayer,
    inject: ['VMap'],
    props: {
      layerId: {
        type: String,
        default() {
          return `vector-layer-${nanoid()}`
        },
      },
      source: {
        type: Object,
        default() {
          return { features: [] }
        },
      },
      features: {
        type: Array,
        default() {
          return []
        },
      },
      featureStyle: {
        type: [Object, Boolean],
        default() {
          return false
        },
      },
      modify: {
        type: [Object, Boolean],
        default: false,
      },
      select: {
        type: [Object, Boolean],
        default: false,
      },
      cluster: {
        type: [Object, Boolean],
        default: false,
      },
    },
    data() {
      return {
        layer: null,
        layerOpt: {},
        selectObj: null,
        modifyObj: null,
        clusterObj: null,
        clusterDefault: {
          distance: 20,
          minDistance: 0,
        },
        flashInterval: null,
      }
    },
    computed: {
      map() {
        return this.VMap.map
      },
    },
    watch: {
      cluster: {
        handler(value) {
          console.log('watch cluster', value)
          this.dispose()
          this.init()
        },
        immediate: false,
        deep: true,
      },
      features: {
        handler(value) {
          // console.log('layer features change', value)
          this.dispose()
          this.init()
        },
        immediate: false,
        deep: true,
      },
      visible: {
        handler(value) {
          console.log('layer visible change', value)
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
        deep: true,
      },
      modify: {
        handler(value) {
          console.log(value)
          if (value) {
            this.setModify()
          } else {
            if (this.selectObj) {
              this.map.removeInteraction(this.selectObj)
              this.selectObj = null
            }
            if (this.modifyObj) {
              this.map.removeInteraction(this.modifyObj)
              this.modifyObj = null
            }
          }
        },
        immediate: false,
      },
    },
    mounted() {
      this.init()
    },
    beforeUnmount() {
      this.dispose()
    },
    methods: {
      init() {
        const source = addVectorSource(this.source, this.map)
        if (this.source.features.length <= 0 && this.features.length > 0) {
          const features = setFeatures(
            this.features,
            this.map,
            this.featureStyle && Object.keys(this.featureStyle).length > 0
          )
          source.addFeatures(features)
        }
        if (this.cluster) {
          // let defaultOptions = {}
          // if (typeof this.cluster === 'boolean' && this.cluster) {
          //   defaultOptions = { ...defaultOptions, ...this.clusterDefault }
          // } else {
          //   defaultOptions = this.cluster
          // }
          // const clusterOption = { source, ...defaultOptions }
          // this.clusterObj = new Cluster(clusterOption)
          // this.layerOpt = {
          //   ...this.$props,
          //   ...{ source: this.clusterObj, style: clusterOption.style },
          // }
          // this.layer = addClusterLayer(this.layerOpt, this.map)
          // this.layer.set('cluster', true)
        } else {
          this.layerOpt = { ...this.$props, ...{ source } }
          this.layer = new VectorLayer(this.layerOpt)
          this.layer.setStyle((feature) => {
            if (feature.get('style')) {
              return setStyle(feature.get('style'))
            } else {
              if (
                this.featureStyle &&
                Object.keys(this.featureStyle).length > 0
              ) {
                return setStyle(this.featureStyle)
              } else {
                return setStyle({
                  fill: {
                    color: 'rgba(67,126,255,0.15)',
                  },
                  stroke: {
                    color: 'rgba(67,126,255,1)',
                    width: 1,
                  },
                })
              }
            }
          })
        }
        this.layer.set('id', this.layerId)
        this.layer.set('type', 'vector')
        this.layer.set('users', true)
        this.layer.setZIndex(1)
        this.map.addLayer(this.layer)
        // this.setFlashAnimate()
        // this.flashInterval = setInterval(() => {
        //   this.setFlashAnimate()
        // }, 1000)
        // this.map.on('moveend', () => this.setFlashAnimate())
        this.$emit('load', this.layer, this.map)
        if (this.modify) {
          this.setModify()
        }
      },
      // setFlashAnimate() {
      //   if (this.cluster) {
      //     const features = this.clusterObj.getFeatures()
      //     if (features.length > 0) {
      //       features.forEach((cluster) => {
      //         const clusters = cluster.get('features')
      //         if (clusters.length === 1) {
      //           clusters.forEach((feature) => {
      //             if (feature.get('flash')) {
      //               this.flash(feature)
      //             }
      //           })
      //         }
      //       })
      //     }
      //   } else {
      //     // console.log(this.layer.getSource().getFeatures())
      //     this.layer
      //       .getSource()
      //       .getFeatures()
      //       .forEach((feature) => {
      //         if (feature.get('flash')) {
      //           this.flash(feature)
      //         }
      //       })
      //   }
      // },
      clearTimer(feature) {
        let timer = feature.get('timer')
        if (timer) {
          clearInterval(timer)
          timer = null
        }
      },
      dispose() {
        clearInterval(this.flashInterval)
        if (this.cluster && this.clusterObj) {
          this.clusterObj.clear()
        } else {
          this.layer.getSource().clear()
        }
        this.map.removeLayer(this.layer)
        this.map.removeInteraction(this.selectObj)
        this.map.removeInteraction(this.modifyObj)
      },
      getFeatureById(id) {
        const features = this.layer.getSource().getFeatures()
        let target
        features.forEach((feature) => {
          if (feature.get('id') === id || feature.getId() === id) {
            target = feature
          }
        })
        return target
      },
      updateFeatureById(featureId, update) {
        const features = this.layer.getSource().getFeatures()
        console.log(features)
        features.forEach((feature) => {
          if (feature.get('id') === featureId) {
            if (typeof update === 'object') {
              for (const i in update) {
                if (Object.prototype.hasOwnProperty.call(update, i)) {
                  feature.update(i, update[i])
                }
              }
            }
          }
        })
      },
      setModify() {
        let features = []
        if (this.select) {
          if (validObjKey(this.select, 'style')) {
            selectStyle = setStyle(this.select.style)
          }
          this.selectObj = new Select({
            style: (feature, map) => {
              const geometryType = feature.getGeometry().getType()
              // console.log('geometryType:', geometryType)
              let style
              style = selectFeatureStyle[geometryType]
              return style
            },
            layers: [this.layer],
          })
          this.map.addInteraction(this.selectObj)
          this.selectObj.on('select', (evt) => {
            // const params = { ...evt, ...{ select: this.select } }
            this.$emit('select', evt, this.map)
          })
          features = this.selectObj.getFeatures()
        } else {
          features = new Collection(this.layer.getSource().getFeatures())
        }
        let modifyStyle
        if (validObjKey(this.modify, 'style')) {
          modifyStyle = setStyle(this.modify.style)
        }
        this.modifyObj = new Modify({
          features,
          style: modifyStyle,
        })
        this.map.addInteraction(this.modifyObj)
        this.modifyObj.on('modifystart', (evt) => {
          this.$emit('modifystart', evt, this.map)
          features.getArray().forEach((feature) => {
            feature.getGeometry().on('change', (evt) => {
              this.$emit('modifychange', evt, this.map, feature)
            })
          })
        })
        this.modifyObj.on('modifyend', (evt) => {
          const params = { ...evt, ...{ select: this.selectObj } }
          this.$emit('modifyend', params, this.map)
        })
      },
      // flash(feature) {
      //   const flash = feature.get('flash')
      //   const duration = Number(flash.rate) * 1000 || 3000
      //   const start = Date.now()
      //   const flashGeom = feature.getGeometry().clone()
      //   const listenerKey = this.layer.on('postrender', (event) => {
      //     const frameState = event.frameState
      //     const elapsed = frameState.time - start
      //     if (elapsed >= duration) {
      //       unByKey(listenerKey)
      //       return
      //     }
      //     const vectorContext = getVectorContext(event)
      //     const elapsedRatio = elapsed / duration
      //     // radius will be 5 at start and 30 at end.
      //     const radius = easeOut(elapsedRatio) * 25 + 5
      //     const color = asArray(flash.color || 'rgba(255, 0, 0, 1)')
      //     color.slice()
      //     const opacity = easeOut(1 - elapsedRatio)

      //     const style = new Style({
      //       image: new CircleStyle({
      //         radius,
      //         stroke: new Stroke({
      //           // color: 'rgba(255, 0, 0, ' + opacity + ')',
      //           color: `rgba(${color[0]},${color[1]},${color[2]},${opacity})`,
      //           width: 0.25 + opacity,
      //         }),
      //       }),
      //     })

      //     vectorContext.setStyle(style)
      //     vectorContext.drawGeometry(flashGeom)
      //     // tell OpenLayers to continue postrender animation
      //     this.map.render()
      //   })
      // },
    },
    render(createElement, context) {
      return null
    },
  }
</script>

<style scoped></style>
