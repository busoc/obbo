<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'Replay'"/>
    <div class="d-flex justify-content-between my-3 px-3">
      <RangeForm @update:range="updateRange" :start="criteria.dtstart" :end="criteria.dtend"/>
      <form class="form-inline filter-form">
        <label for="status">Status</label>
        <select @change="fetch" v-model="criteria.status" id="status" class="form-control form-control-sm mx-1">
          <option></option>
          <option v-for="s in statuslist" :key="s.name">{{s.name}}</option>
        </select>
      </form>
      <SortBy :fields="fields" @update:sort="sortData"/>
    </div>
    <Loading />
    <table class="table table-hover my-3" v-if="requests && requests.length">
      <thead class="thead-dark">
        <tr>
          <th class="text-capitalize">Time</th>
          <th class="text-center text-capitalize">Status</th>
          <th class="text-capitalize">Starts</th>
          <th class="text-capitalize">Ends</th>
          <th class="text-center text-capitalize">Missing</th>
          <th class="text-center text-capitalize">Corrupted</th>
          <th class="text-center text-capitalize">Priority</th>
          <th class="text-center text-capitalize">Automatic</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in requests" :key="r.id">
          <td>{{formatTime(r.time)}}</td>
          <td class="text-center">{{r.status}}</td>
          <td>{{formatTime(r.dtstart)}}</td>
          <td>{{formatTime(r.dtend)}}</td>
          <td class="text-center">?</td>
          <td class="text-center">?</td>
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
    <Empty v-else/>
    <Paginate :query="query"/>
  </div>
</template>

<script>
import _ from 'lodash'
import feather from 'feather-icons'
import PageHeader from './common/PageHeader.vue'
import SortBy from './common/SortBy.vue'
import Paginate from './common/Paginate.vue'
import RangeForm from './common/Range.vue'
import Loading from './common/Loading.vue'
import Empty from './common/Empty.vue'
import {repfields} from './sort.js'
import {formatTime} from './intervals.js'

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
      statuslist: [],
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
      return Object.assign({}, this.criteria)
    },
  },
  watch: {
    $route() {
      this.criteria = _.pick(this.$route.query, ["status", "dtstart", "dtend"])
      this.fetch()
    },
  },
  methods: {
    formatTime(str) {
      return formatTime(str)
    },
    updateRange({start, end}) {
      this.criteria.dtstart = start
      this.criteria.dtend = end
      this.fetch()
    },
    fetch() {
      let q = {
        status: this.criteria.status,
        dtstart: this.criteria.dtstart,
        dtend: this.criteria.dtend,
        page: this.$route.query.page ? this.$route.query.page : 1,
      }
      this.$store.dispatch('fetch.requests', q)
      this.$store.dispatch('fetch.requests.status').then(list => {this.statuslist = _.sortBy(list, 'name') })
    },
    sortData(field, order) {
      this.$store.commit('sort.data', {field, order})
    },
  },
  components: {
    PageHeader,
    Paginate,
    SortBy,
    RangeForm,
    Loading,
    Empty,
  },
}
</script>
