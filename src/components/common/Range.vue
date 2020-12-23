<template>
  <form class="form-inline" @submit.prevent="changed">
    <label for="period">Period</label>
    <select v-model="duration" @change="updateRange" id="period" class="form-control form-control-sm mx-1">
      <option></option>
      <option v-for="(p, i) in periods" :key="i" :value="p.toISO()">{{formatDuration(p)}}</option>
    </select>
    <label>Range</label>
    <input @change="changed" v-model="dtstart" type="datetime-local" class="form-control form-control-sm mx-1" id="dtstart"/>
    <input @change="changed" v-model="dtend" type="datetime-local" class="form-control form-control-sm mx-1" id="dtend"/>
  </form>
</template>
<script>
import {IsoFormat, RFC3339, Periods} from '../intervals.js'
import {DateTime, Duration} from 'luxon'

export default {
  name: 'Range',
  props: ["start", "end"],
  emits: ['update:range'],
  data() {
    return {
      duration: "",
      dtstart: this.start,
      dtend: this.end,
      periods: Periods,
    }
  },
  methods: {
    changed() {
      let start = DateTime.fromISO(this.dtstart)
      let end = DateTime.fromISO(this.dtend)
      let q = {}

      if (start.isValid) {
        q.start = start.toFormat(RFC3339)
      }
      if (end.isValid) {
        q.end = end.toFormat(RFC3339)
      }
      if (start.isValid && end.isValid && end < start) {
        return
      }
      this.$emit('update:range', q)
    },
    updateRange() {
      if (!this.duration) {
        return
      }
      let end = DateTime.local()
      let start = end.minus(Duration.fromISO(this.duration))

      this.dtstart = start.toFormat(IsoFormat)
      this.dtend = end.toFormat(IsoFormat)

      this.changed()
    },
    formatDuration(d) {
      return d.days ? `${d.days} DAYS` : `${d.hours} HOUR(S)`
    },
  },
}
</script>
