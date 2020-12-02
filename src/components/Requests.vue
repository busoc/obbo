<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'Replay'"/>
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
        <label for="status">Status</label>
        <select @change="fetch" v-model="status" id="status" class="form-control form-control-sm mx-1">
          <option></option>
          <option v-for="s in statuslist" :key="s.name">{{s.name}}</option>
        </select>
      </form>
      <SortBy :values="['time', 'status', 'priority', 'automatic']"
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
          <th class="text-center text-capitalize">Status</th>
          <th class="text-capitalize">Starts</th>
          <th class="text-capitalize">Ends</th>
          <th class="text-center text-capitalize">Priority</th>
          <th class="text-center text-capitalize">Automatic</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in requests" :key="r.id">
          <td>{{r.time}}</td>
          <td class="text-center">{{r.status}}</td>
          <td>{{r.dtstart}}</td>
          <td>{{r.dtend}}</td>
          <td class="text-center">{{r.priority == -1 ? '-' : r.priority}}</td>
          <td class="text-center">
            <i v-if="r.automatic" data-feather="award"></i>
          </td>
          <td class="text-right">
            <!-- <router-link title="view request detail" :to="{name: 'view.request.detail', params: {id: r.id}}" class="btn btn-primary btn-sm mx-1">
              <i data-feather="edit"></i>
            </router-link> -->
            <router-link v-if="r.cancellable" title="cancel request" :to="{name: 'view.request.cancel', params: {id: r.id}}" class="btn btn-danger btn-sm mx-1">
              <i data-feather="trash-2"></i>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {DateTime, Duration} from 'luxon'
import _ from 'lodash'
import feather from 'feather-icons'
import PageHeader from './PageHeader.vue'
import SortBy from './SortBy.vue'
// import {MaxDays, MaxMessage, IsoFormat, RFC3339, Periods} from './intervals.js'
import {IsoFormat, RFC3339, Periods} from './intervals.js'

export default {
  name: "Requests",
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
      statuslist: [],
      dtstart: "",
      dtend: "",
      status: "",
      duration: "",
      periods: Periods,
    }
  },
  updated() {
    feather.replace()
  },
  computed: {
    requests() {
      return this.orderData()
    },
  },
  methods: {
    load() {
      this.dtstart = localStorage["filter.dtstart"] ? JSON.parse(localStorage["filter.dtstart"]) : ""
      this.dtend = localStorage["filter.dtend"] ? JSON.parse(localStorage["filter.dtend"]) : ""
      this.status = localStorage["filter.status"] ? JSON.parse(localStorage["filter.status"]) : ""

      let field = `sort.${this.$route.name}.field`
      let order = `sort.${this.$route.name}.order`
      this.field = localStorage[field] ? JSON.parse(localStorage[field]) : ""
      this.order = localStorage[order] ? JSON.parse(localStorage[order]) : ""
    },
    save() {
      localStorage.setItem("filter.dtstart", JSON.stringify(this.dtstart))
      localStorage.setItem("filter.dtend", JSON.stringify(this.dtend))
      localStorage.setItem("filter.status", JSON.stringify(this.status))
    },
    fetch() {
      this.save()
      let start = DateTime.fromISO(this.dtstart)
      let end = DateTime.fromISO(this.dtend)
      let q = {
        status: this.status,
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
        // let diff = end.diff(start, 'days').toObject()
        // if (diff.days >= MaxDays) {
        //   if (!confirm(MaxMessage)) {
        //     return
        //   }
        // }
      }
      this.$store.dispatch('fetch.requests', q)
      this.$store.dispatch('fetch.requests.status').then(list => {this.statuslist = _.sortBy(list, 'name') })
    },
    orderData() {
      return this.$store.getters.sortRequests(this.field, this.order)
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
