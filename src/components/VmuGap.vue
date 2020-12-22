<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'VMU Gaps'"/>
    <div class="d-flex justify-content-between my-3 px-3">
      <form class="form-inline filter-form">
        <label for="period">Period</label>
        <select v-model="duration" @change="updateRange" id="period" class="form-control form-control-sm mx-1">
          <option></option>
          <option v-for="(p, i) in periods" :key="i" :value="p.toISO()">{{formatDuration(p)}}</option>
        </select>
        <label for="dtstart">Range</label>
        <input @change="fetch" v-model="dtstart" type="datetime-local" class="form-control form-control-sm mx-1" id="dtstart"/>
        <input @change="fetch" v-model="dtend" type="datetime-local" class="form-control form-control-sm mx-1" id="dtend"/>
        <label for="record">Record</label>
        <select @change="fetch" v-model="record" id="record" class="form-control form-control-sm mx-1">
          <option value=""></option>
          <option v-for="r in recordlist" :key="r.record" :value="r.record">{{r.record}}</option>
        </select>
        <label for="source">Source</label>
        <select @change="fetch" v-model="source" id="source" class="form-control form-control-sm mx-1">
          <option value=""></option>
          <option v-for="s in sourcelist" :key="s.source" :value="s.source">0x{{s.source}}</option>
        </select>
      </form>
      <SortBy @update:sort="sortData"/>
    </div>
    <table class="table table-hover my-3">
      <thead class="thead-dark">
        <tr>
          <th class="text-capitalize">Time</th>
          <th class="text-capitalize">Record</th>
          <th class="text-capitalize">Source</th>
          <th class="text-capitalize">Starts</th>
          <th class="text-capitalize">Ends</th>
          <th class="text-capitalize text-center">Missing</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="g in gaps" :key="g.id">
          <td>{{g.time}}</td>
          <td>{{g.record}}</td>
          <td>0x{{g.source}}</td>
          <td>{{g.dtstart}}</td>
          <td>{{g.dtend}}</td>
          <td class="text-center" :title="missing(g)">{{g.last - g.first}}</td>
          <td class="text-right">
            <!-- <router-link :to="{name: 'view.vmu.detail', params: {id: g.id}}" class="btn btn-primary btn-sm mx-1">
              <i data-feather="edit"></i>
            </router-link> -->
            <router-link title="create request" :to="{name: 'vmu.new.request', params: {id: g.id}, query: {dtstart: g.dtstart, dtend: g.dtend}}" class="btn btn-secondary btn-sm mx-1">
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
import SortBy from './common/SortBy.vue'
import _ from 'lodash'
import {IsoFormat, RFC3339, Periods} from './intervals.js'
import {vmufields} from './sort.js'

export default {
  name: "VmuGap",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.fetch())
  },
  data() {
    return {
      dtstart: "",
      dtend: "",
      source: "",
      record: "",
      recordlist: [],
      sourcelist: [],
      periods: Periods,
      duration: "",
    }
  },
  updated() {
    feather.replace()
  },
  computed: {
    gaps() {
      return this.$store.state.vmugaps
    },
    fields() {
      return vmufields
    },
  },
  methods: {
    missing(g) {
      return `${g.first} -> ${g.last}`
    },
    fetch() {
      let start = DateTime.fromISO(this.dtstart)
      let end = DateTime.fromISO(this.dtend)
      let q = {
        source: this.source,
        record: this.record,
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
      this.$store.dispatch('fetch.vmu.gaps', q)
      this.$store.dispatch('fetch.vmu.records').then(list => {this.recordlist = _.sortBy(list, 'record') })
      this.$store.dispatch('fetch.vmu.sources').then(list => {this.sourcelist = _.sortBy(list, 'source') })
    },
    sortData(field, order) {
      this.$store.commit('sort.vmu.gaps', {field, order})
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
