<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'HRD Gaps'"/>
    <div class="d-flex justify-content-between my-3 px-3">
      <form class="form-inline filter-form">
        <label for="period">Period</label>
        <select v-model="duration" @change="updateRange" id="period" class="form-control form-control-sm mx-1">
          <option></option>
          <option v-for="(p, i) in periods" :key="i" :value="p.toISO()">{{formatDuration(p)}}</option>
        </select>
        <label>Range</label>
        <input @change="fetch" v-model="dtstart" type="datetime-local" class="form-control form-control-sm mx-1" id="dtstart"/>
        <input @change="fetch" v-model="dtend" type="datetime-local" class="form-control form-control-sm mx-1" id="dtend"/>
        <label for="channel">Channel</label>
        <select @change="fetch" v-model="channel" id="channel" class="form-control form-control-sm mx-1">
          <option value=""></option>
          <option v-for="c in channellist" :value="c.channel" :key="c.channel">{{c.channel}}</option>
        </select>
      </form>
      <SortBy :fields="fields" @update:sort="sortData"/>
    </div>
    <table class="table table-hover my-3">
      <thead class="thead-dark">
        <tr>
          <th class="text-capitalize">Time</th>
          <th class="text-capitalize">Channel</th>
          <th class="text-capitalize">Starts</th>
          <th class="text-capitalize">Ends</th>
          <th class="text-capitalize text-center">Missing</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="g in gaps" :key="g.id">
          <td>{{g.time}}</td>
          <td>{{g.channel}}</td>
          <td>{{g.dtstart}}</td>
          <td>{{g.dtend}}</td>
          <td class="text-center" :title="missing(g)">{{g.last - g.first}}</td>
          <td class="text-right">
            <!-- <router-link title="view detail" :to="{name: 'view.hrd.detail', params: {id: g.id}}" class="btn btn-primary btn-sm mx-1">
              <i data-feather="edit"></i>
            </router-link> -->
            <router-link title="create request" :to="{name: 'hrd.new.request', params: {id: g.id}, query: {dtstart: g.dtstart, dtend: g.dtend}}" class="btn btn-secondary btn-sm mx-1">
              <i data-feather="plus-square"></i>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {DateTime, Duration} from 'luxon'
import feather from 'feather-icons'
import PageHeader from './PageHeader.vue'
import SortBy from './SortBy.vue'
import _ from 'lodash'
import {IsoFormat, RFC3339, Periods} from './intervals.js'
import {hrdfields} from './sort.js'

export default {
  name: "HrdGap",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.fetch())
  },
  updated() {
    feather.replace()
  },
  data() {
    return {
      dtstart: "",
      dtend: "",
      channel: "",
      channellist: [],
      periods: Periods,
      duration: "",
    }
  },
  computed: {
    gaps() {
      return this.$store.state.hrdgaps
    },
    fields() {
      return hrdfields
    }
  },
  methods: {
    missing(g) {
      return `${g.first} -> ${g.last}`
    },
    fetch() {
      let start = DateTime.fromISO(this.dtstart)
      let end = DateTime.fromISO(this.dtend)
      let q = {
        channel: this.channel,
        dtstart: "",
        dtend: "",
      }
      if (start.isValid) {
        q.dtstart = start.toFormat(RFC3339)
      }
      if (end.isValid) {
        q.dtend = end.toFormat(RFC3339)
      }
      if (start.isValid && end.isValid) {
        if (end < start) {
          return
        }
      }
      this.$store.dispatch('fetch.hrd.gaps', q)
      this.$store.dispatch('fetch.hrd.channels').then(list => {this.channellist = _.sortBy(list, 'channel') })
    },
    sortData(field, order) {
      this.$store.commit('sort.hrd.gaps', {field, order})
    },
    updateRange() {
      if (!this.duration) {
        return
      }
      let end = DateTime.local()
      let start = end.minus(Duration.fromISO(this.duration))

      this.dtstart = start.toFormat(IsoFormat)
      this.dtend = end.toFormat(IsoFormat)
      this.fetch()
    },
    formatDuration(d) {
      return d.days ? `${d.days} DAYS` : `${d.hours} HOUR(S)`
    },
  },
  components: {
    PageHeader,
    SortBy,
  },
}
</script>
