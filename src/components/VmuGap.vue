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
      <SortBy :values="['time', 'record', 'source', 'date', 'missing']"
        :empty="true"
        :field="field"
        @update:field="field = $event"
        :order="order"
        @update:order="order = $event"/>
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
          <td class="text-center">{{g.last - g.first}}</td>
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
import SortBy from './SortBy.vue'
import _ from 'lodash'
import {MaxDays, MaxMessage, Periods, IsoFormat} from './intervals.js'

export default {
  name: "VmuGap",
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.load()
      vm.fetch()
    })
  },
  beforeRouteLeave() {
    this.save()
  },
  data() {
    return {
      field: "",
      order: "",
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
      return this.orderData()
    },
  },
  methods: {
    load() {
      this.dtstart = localStorage["filter.dtstart"] ? JSON.parse(localStorage["filter.dtstart"]) : ""
      this.dtend = localStorage["filter.dtend"] ? JSON.parse(localStorage["filter.dtend"]) : ""
      this.source = localStorage["filter.source"] ? JSON.parse(localStorage["filter.source"]) : ""
      this.channel = localStorage["filter.record"] ? JSON.parse(localStorage["filter.record"]) : ""

      let field = `sort.${this.$route.name}.field`
      let order = `sort.${this.$route.name}.order`
      this.field = localStorage[field] ? JSON.parse(localStorage[field]) : ""
      this.order = localStorage[order] ? JSON.parse(localStorage[order]) : ""
    },
    save() {
      localStorage.setItem("filter.dtstart", JSON.stringify(this.dtstart))
      localStorage.setItem("filter.dtend", JSON.stringify(this.dtend))
      localStorage.setItem("filter.source", JSON.stringify(this.source))
      localStorage.setItem("filter.record", JSON.stringify(this.record))
    },
    fetch() {
      this.save()
      let start = DateTime.fromISO(this.dtstart)
      let end = DateTime.fromISO(this.dtend)
      let q = {
        source: this.source,
        record: this.record,
        dtstart: "",
        dtend: "",
      }
      if (start.isValid) {
        q.dtstart = start.toFormat("yyyy-LL-dd'T'HH:mm:ss'Z'")
      }
      if (end.isValid) {
        q.dtend = end.toFormat("yyyy-LL-dd'T'HH:mm:ss'Z'")
      }
      if (start.isValid && end.isValid) {
        if (end < start) {
          return
        }
        let diff = end.diff(start, 'days').toObject()
        if (diff.days >= MaxDays) {
          if (!confirm(MaxMessage)) {
            return
          }
        }
      }
      this.$store.dispatch('fetch.vmu.gaps', q)
      this.$store.dispatch('fetch.vmu.records').then(list => {this.recordlist = _.sortBy(list, 'record') })
      this.$store.dispatch('fetch.vmu.sources').then(list => {this.sourcelist = _.sortBy(list, 'source') })
    },
    orderData() {
      return this.$store.getters.sortGapsVMU(this.field, this.order)
    },
    updateRange() {
      if (!this.duration) {
        return
      }
      let end = DateTime.local()
      let start = end.minus(Duration.fromISO(this.duration))

      this.dtstart = start.toFormat(IsoFormat)
      this.dtend = end.toFormat(IsoFormat)
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
