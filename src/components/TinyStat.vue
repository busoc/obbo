<template>
  <div class="col">
    <div class="card rounded-0">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="card-subtitle text-capitalize font-weight-light">{{title}}</h3>
          <div class="trend d-flex align-items-center">
            <span :class="['mx-2', {'text-danger': diff > 0, 'text-primary': diff < 0}]">{{curr.count || 0}}</span>
            <i v-if="diff > 0" data-feather="trending-up"></i>
            <i v-if="diff < 0" data-feather="trending-down"></i>
          </div>
        </div>
        <small class="text-muted d-flex justify-content-between" v-if="period.ok">
          <span class="mx-1">{{period.first ? period.first.time.toISODate() : ""}}</span>
          <span class="mx-1">{{period.last ? period.last.time.toISODate() : ""}}</span>
          <span class="mx-1">{{period.sum}}</span>
        </small>
        <small class="text-muted" v-else>no information available</small>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {DateTime} from 'luxon'
import feather from 'feather-icons'

export default {
  name: 'TinyStat',
  props: ["title", "list"],
  data() {
    return {
      values: []
    }
  },
  watch: {
    list() {
      this.values = _.chain(this.list)
        .map(d => {
          d.time = DateTime.fromISO(d.time)
          return d
        })
        .sortBy('time')
        .value()
    }
  },
  computed: {
    period() {
      return {
        ok: this.values.length > 0,
        first: _.first(this.values),
        last: _.last(this.values),
        sum: _.reduce(this.values, (sum, n) => sum += n.count, 0)
      }
    },
    curr() {
      let obj = this.values.length ? _.last(this.values, 'time') : {}
      if (obj.time && obj.time.toISODate() == DateTime.local().toISODate()) {
        return obj
      }
      return {}
    },
    diff() {
      let obj = this.values.length ? _.last(this.values, 'time') : {}
      if (!obj.time || obj.time.toISODate() != DateTime.local().toISODate()) {
        return 0
      }
      let last = _.takeRight(this.values, 2)
      if (last.length < 2) {
        return 0
      }
      return last[1].count - last[0].count
    },
  },
  updated() {
    feather.replace()
  },
}
</script>

<style scoped>
div.trend {
  font-size: 32px;
}
</style>
