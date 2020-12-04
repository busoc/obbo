<template>
  <div class="card rounded-0">
    <h5 v-if="!noheader" class="card-header font-weight-light text-capitalize">{{what}}</h5>
    <div class="card-body px-2 py-1" :id="what">
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3'
import _ from 'lodash'
import {DateTime} from 'luxon'
import {margins, PreferredHeight} from './charts.js'

export default {
  name: 'Lines',
  props: {
    what: String,
    field: String,
    list: Array,
    noheader: Boolean,
  },
  data() {
    let xscale = d3.scaleTime()
    let xaxis = d3.axisBottom().scale(xscale).ticks(5).tickFormat(d3.timeFormat("%Y/%j"))
    let yscale = d3.scaleLinear()
    let yaxis = d3.axisLeft().scale(yscale).ticks(8)
    return {
      width: 0,
      height: PreferredHeight,
      xscale,
      yscale,
      xaxis,
      yaxis,
    }
  },
  computed: {
    stats() {
      return this.list
    },
  },
  mounted() {
    this.init()
    this.draw()
  },
  updated() {
    this.draw()
  },
  methods: {
    init() {
      this.width = this.$el.offsetWidth
      d3.select(`#${this.what}`)
        .append('svg')
        .attr('class', 'line-chart')
        .attr('width', '100%')
        .attr('height', `${this.height}`)

      this.xscale.range([0, this.width - margins.left - margins.right])
      this.yscale.rangeRound([this.height - margins.top - margins.bottom, 0])
    },
    draw() {
      if (!this.stats || this.stats.length <= 1) {
        return
      }

      this.xscale.domain(d3.extent(this.stats, d => DateTime.fromISO(d.time).toJSDate()))
      this.xaxis.scale(this.xscale)
      this.yscale.domain([0, d3.max(this.stats, d => d[this.field])])
      this.yaxis.scale(this.yscale).tickSize(-(this.width-margins.left-margins.right))

      let svg = d3.select(`#${this.what}`).select('svg')
      svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margins.left}, ${margins.top})`)
        .call(this.yaxis)
        .select('.domain')
        .remove()

      svg.append("g")
        .attr('transform', `translate(${margins.left}, ${this.height - margins.bottom})`)
        .attr("class", "axis x-axis")
        .call(this.xaxis)
        .select('.domain')
        .remove()

      const line = d3.line()
        .x(d => this.xscale(DateTime.fromISO(d.time).toJSDate()))
        .y(d => this.yscale(d.count))
        .curve(d3.curveStep)

      svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .append('path')
        .datum(_.orderBy(this.stats, 'time', 'asc'))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr('d', line)
    }
  }
}
</script>
