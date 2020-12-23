<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'HRD Gaps'"/>
    <div class="d-flex justify-content-between my-3 px-3">
      <RangeForm @update:range="updateRange" :start="criteria.dtstart" :end="criteria.dtend"/>
      <form class="form-inline filter-form">
        <label for="channel">Channel</label>
        <select @change="fetch" v-model="criteria.channel" id="channel" class="form-control form-control-sm mx-1">
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
    <Paginate :query="query"/>
  </div>
</template>

<script>
import feather from 'feather-icons'
import PageHeader from './common/PageHeader.vue'
import SortBy from './common/SortBy.vue'
import _ from 'lodash'
import {hrdfields} from './sort.js'
import Paginate from './common/Paginate.vue'
import RangeForm from './common/Range.vue'

const defaultCriteria = {
  dtstart: "",
  dtend: "",
  channel: "",
}

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
      criteria: defaultCriteria,
      channellist: [],
    }
  },
  computed: {
    gaps() {
      return this.$store.getters.objects
    },
    fields() {
      return hrdfields
    },
    query() {
      return Object.assign({}, this.criteria)
    },
  },
  watch: {
    $route() {
      this.criteria = _.pick(this.$route.query, ["channel", "dtstart", "dtend"])
      this.fetch()
    },
  },
  methods: {
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
        channel: this.criteria.channel,
        dtstart: this.criteria.dtstart,
        dtend: this.criteria.dtend,
        page: this.$route.query.page ? this.$route.query.page : 1,
      }
      this.$store.dispatch('fetch.hrd.gaps', q)
      this.$store.dispatch('fetch.hrd.channels').then(list => {this.channellist = _.sortBy(list, 'channel') })
    },
    sortData(field, order) {
      this.$store.commit('sort.data', {field, order})
    },
  },
  components: {
    PageHeader,
    SortBy,
    Paginate,
    RangeForm,
  },
}
</script>
