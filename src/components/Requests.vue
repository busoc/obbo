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
        <input @change="fetch" v-model="criteria.dtstart" type="datetime-local" class="form-control form-control-sm mx-1" id="dtstart"/>
        <input @change="fetch" v-model="criteria.dtend" type="datetime-local" class="form-control form-control-sm mx-1" id="dtend"/>
        <label for="status">Status</label>
        <select @change="fetch" v-model="criteria.status" id="status" class="form-control form-control-sm mx-1">
          <option></option>
          <option v-for="s in statuslist" :key="s.name">{{s.name}}</option>
        </select>
      </form>
      <SortBy :fields="fields" @update:sort="sortData"/>
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
    <Paginate :query="query"/>
  </div>
</template>

<script>
import {DateTime, Duration} from 'luxon'
import _ from 'lodash'
import feather from 'feather-icons'
import PageHeader from './PageHeader.vue'
import SortBy from './common/SortBy.vue'
import Paginate from './common/Paginate.vue'
import {IsoFormat, RFC3339, Periods} from './intervals.js'
import {repfields} from './sort.js'

const defaultCriteria = {
  dtstart: "",
  dtend: "",
  status: "",
}

export default {
  name: "Requests",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.fetch())
  },
  data() {
    return {
      criteria: defaultCriteria,
      duration: "",
      statuslist: [],
      periods: Periods,
    }
  },
  updated() {
    feather.replace()
  },
  computed: {
    requests() {
      return this.$store.getters.objects
    },
    fields() {
      return repfields
    },
    query() {
      return {
        status: this.criteria.status,
        dtstart: this.criteria.dtstart,
        dtend: this.criteria.dtend,
      }
    },
  },
  watch: {
    $route() {
      this.criteria = _.pick(this.$route.query, ["status", "dtstart", "dtend"])
      this.fetch()
    },
  },
  methods: {
    fetch() {
      let start = DateTime.fromISO(this.criteria.dtstart)
      let end = DateTime.fromISO(this.criteria.dtend)
      let q = {
        status: this.criteria.status,
        dtstart: "",
        dtend: "",
        page: this.$route.query.page ? this.$route.query.page : 1,
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
      this.$store.dispatch('fetch.requests', q)
      this.$store.dispatch('fetch.requests.status').then(list => {this.statuslist = _.sortBy(list, 'name') })
    },
    sortData(field, order) {
      this.$store.commit('sort.data', {field, order})
    },
    updateRange() {
      if (!this.duration) {
        return
      }
      let end = DateTime.local()
      let start = end.minus(Duration.fromISO(this.duration))

      this.criteria.dtstart = start.toFormat(IsoFormat)
      this.criteria.dtend = end.toFormat(IsoFormat)

      this.fetch()
    },
    formatDuration(d) {
      return d.days ? `${d.days} DAYS` : `${d.hours} HOUR(S)`
    },
  },
  components: {
    PageHeader,
    Paginate,
    SortBy,
  },
}
</script>
