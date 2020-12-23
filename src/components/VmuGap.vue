<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'VMU Gaps'"/>
    <div class="d-flex justify-content-between my-3 px-3">
      <RangeForm @update:range="updateRange" :start="criteria.dtstart" :end="criteria.dtend"/>
      <form class="form-inline filter-form">
        <label for="record">Record</label>
        <select @change="fetch" v-model="criteria.record" id="record" class="form-control form-control-sm mx-1">
          <option value=""></option>
          <option v-for="r in recordlist" :key="r.record" :value="r.record">{{r.record}}</option>
        </select>
        <label for="source">Source</label>
        <select @change="fetch" v-model="criteria.source" id="source" class="form-control form-control-sm mx-1">
          <option value=""></option>
          <option v-for="s in sourcelist" :key="s.source" :value="s.source">0x{{s.source}}</option>
        </select>
      </form>
      <SortBy @update:sort="sortData"/>
    </div>
    <Loading/>
    <table class="table table-hover my-3" v-if="gaps && gaps.length">
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
          <td>{{formatTime(g.time)}}</td>
          <td>{{g.record}}</td>
          <td>0x{{g.source}}</td>
          <td>{{formatTime(g.dtstart)}}</td>
          <td>{{formatTime(g.dtend)}}</td>
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
    <Empty v-else/>
    <Paginate :query="query"/>
  </div>
</template>

<script>
import feather from 'feather-icons'
import PageHeader from './common/PageHeader.vue'
import SortBy from './common/SortBy.vue'
import RangeForm from './common/Range.vue'
import Paginate from './common/Paginate.vue'
import Loading from './common/Loading.vue'
import Empty from './common/Empty.vue'
import _ from 'lodash'
import {vmufields} from './sort.js'
import {formatTime} from './intervals.js'

const defaultCriteria = {
  dtstart: "",
  dtend: "",
  source: "",
  record: "",
}

export default {
  name: "VmuGap",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.fetch())
  },
  data() {
    return {
      criteria: defaultCriteria,
      recordlist: [],
      sourcelist: [],
    }
  },
  updated() {
    feather.replace()
  },
  computed: {
    gaps() {
      return this.$store.getters.objects
    },
    fields() {
      return vmufields
    },
    query() {
      return Object.assign({}, this.criteria)
    },
  },
  watch: {
    $route() {
      this.criteria = _.pick(this.$route.query, ["record", "source", "dtstart", "dtend"])
      this.fetch()
    },
  },
  methods: {
    formatTime(str) {
      return formatTime(str)
    },
    missing(g) {
      return `${g.first} -> ${g.last}`
    },
    updateRange({start, end}) {
      this.criteria.dtstart = start
      this.criteria.dtend = end

      this.fetch()
    },
    fetch() {
      let q = {
        source: this.criteria.source,
        record: this.criteria.record,
        dtstart: this.criteria.dtstart,
        dtend: this.criteria.dtend,
        page: this.$route.query.page,
      }

      this.$store.dispatch('fetch.vmu.gaps', q)
      this.$store.dispatch('fetch.vmu.records').then(list => {this.recordlist = _.sortBy(list, 'record') })
      this.$store.dispatch('fetch.vmu.sources').then(list => {this.sourcelist = _.sortBy(list, 'source') })
    },
    sortData(field, order) {
      this.$store.commit('sort.data', {field, order})
    },
  },
  components: {
    PageHeader,
    SortBy,
    RangeForm,
    Paginate,
    Loading,
    Empty,
  },
}
</script>
