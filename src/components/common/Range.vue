<template>
  <form class="form-inline" @submit.prevent="changed">
    <label for="period">Period</label>
    <select v-model="duration" @change="updateRange" id="period" class="form-control form-control-sm mx-1">
      <option></option>
      <option v-for="(p, i) in periods" :key="i" :value="p.toISO()">{{formatDuration(p)}}</option>
    </select>
    <label>Range</label>
    <input @change="changed"
      v-model="dtstart"
      type="text"
      pattern="[0-9]{4}.[0-9]{3}.[0-9]{2}.[0-9]{2}.[0-9]{2}"
      placeholder="yyyy.ddd.hh.mm.ss"
      :class="['form-control', 'form-control-sm', 'mx-1', {'is-invalid': errors.dtstart}]"
      id="dtstart"/>
    <input @change="changed"
      v-model="dtend"
      type="text"
      pattern="[0-9]{4}.[0-9]{3}.[0-9]{2}.[0-9]{2}.[0-9]{2}"
      placeholder="yyyy.ddd.hh.mm.ss"
      :class="['form-control', 'form-control-sm', 'mx-1', {'is-invalid': errors.dtend}]"
      id="dtend"/>
  </form>
</template>
<script>
import {RFC3339, DoyFormat, Periods} from '../intervals.js'
import {DateTime, Duration} from 'luxon'

export default {
  name: 'Range',
  props: ["start", "end"],
  emits: ['update:range'],
  data() {
    return {
      duration: Periods[Periods.length-1],
      dtstart: this.start,
      dtend: this.end,
      errors: {
        dtstart: false,
        dtend: false,
      },
      periods: Periods,
    }
  },
  methods: {
    changed() {
      let start = DateTime.fromFormat(this.dtstart, DoyFormat)
      let end = DateTime.fromFormat(this.dtend, DoyFormat)
      let q = {}

      if (start.isValid) {
        q.start = start.toFormat(RFC3339)
        this.errors.dtstart = false
      } else {
        this.errors.dtstart = true
        return
      }
      if (end.isValid) {
        q.end = end.toFormat(RFC3339)
        this.errors.dtend = false
      } else {
        this.errors.dtend = true
        return
      }
      if (start.isValid && end.isValid && end < start) {
        this.errors.dtend = true
        this.errors.dtend = true
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

      this.dtstart = start.toFormat(DoyFormat)
      this.dtend = end.toFormat(DoyFormat)

      this.changed()
    },
    formatDuration(d) {
      return d.days ? `${d.days} DAYS` : `${d.hours} HOUR(S)`
    },
  },
}
</script>
