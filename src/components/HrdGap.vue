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
        <div class="form-check mx-1">
          <input @change="fetch" type="checkbox" v-model="criteria.corrupted" id="corrupted" class="form-check-input"/>
          <label for="corrupted" class="form-check-label">
            <span>with corrupted</span>
          </label>
        </div>
        <div class="form-check mx-1">
          <input @change="fetch" type="checkbox" v-model="criteria.completed" id="completed" class="form-check-input"/>
          <label for="completed" class="form-check-label">
            <span>with completed</span>
          </label>
        </div>
      </form>
      <SortBy :fields="sortFields" @update:sort="updateSort"/>
    </div>
    <Loading />
    <table class="table table-hover my-3" v-if="gaps && gaps.length">
      <thead class="thead-dark">
        <tr>
          <th class="text-capitalize">Time</th>
          <th class="text-capitalize">Channel</th>
          <th class="text-capitalize">Starts</th>
          <th class="text-capitalize">Ends</th>
          <th class="text-capitalize text-center">Missing</th>
          <th v-if="criteria.corrupted" class="text-capitalize text-center">Corrupted</th>
          <th v-if="criteria.completed" class="text-capitalize text-center">Completed</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="g in gaps" :key="g.id">
          <td>{{formatTime(g.time)}}</td>
          <td>{{g.channel}}</td>
          <td>{{formatTime(g.dtstart)}}</td>
          <td>{{formatTime(g.dtend)}}</td>
          <td class="text-center">
            <span v-if="g.last > g.first" :title="missing(g)">{{g.last - g.first}}</span>
          </td>
          <td class="text-center" v-if="criteria.corrupted">
            <span v-if="g.last == g.first">
              <i data-feather="check"></i>
            </span>
          </td>
          <td v-if="criteria.completed" class="text-center">
            <i v-if="g.completed" data-feather="check"></i>
          </td>
          <td class="text-right">
            <router-link title="create request" :to="{name: 'hrd.new.request', params: {id: g.id}, query: {dtstart: g.dtstart, dtend: g.dtend}}" class="btn btn-secondary btn-sm mx-1">
              <i data-feather="plus-square"></i>
            </router-link>
            <router-link v-if="!g.completed" title="edit request priority" :to="{name: 'hrd.request.priority', params: {id: g.replay}, query: criteria}" class="btn btn-primary btn-sm mx-1">
              <i data-feather="edit"></i>
            </router-link>
            <router-link v-if="!g.completed" title="cancel request" :to="{name: 'hrd.request.cancel', params: {id: g.replay}, query: criteria}" class="btn btn-danger btn-sm mx-1">
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
import feather from 'feather-icons'
import PageHeader from './common/PageHeader.vue'
import SortBy from './common/SortBy.vue'
import _ from 'lodash'
import {hrdfields} from './sort.js'
import Paginate from './common/Paginate.vue'
import RangeForm from './common/Range.vue'
import Loading from './common/Loading.vue'
import Empty from './common/Empty.vue'
import {formatTime} from './intervals.js'

const defaultCriteria = {
  dtstart: "",
  dtend: "",
  channel: "",
  corrupted: false,
  completed: false,
  field: "",
  order: "",
}

export default {
  name: "HrdGap",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.resetAndFetch())
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
    sortFields() {
      return hrdfields
    },
    query() {
      return Object.assign({}, this.criteria)
    },
  },
  watch: {
    $route(to, from) {
      // if (to.name != from.name) {
      //   return
      // }
      let ix = from.matched.findIndex(r => r.name == to.name)
      if (ix < 0) {
        return
      }
      this.criteria = _.pick(this.$route.query, Object.keys(this.criteria))
      this.resetAndFetch()
    },
  },
  methods: {
    resetAndFetch() {
      this.reset()
      this.fetch()
    },
    reset() {
      this.$store.commit('set.reset')
    },
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
    updateSort({field, order}) {
      this.criteria.field = field
      this.criteria.order = order
      this.fetch()
    },
    fetch() {
      let q = {
        channel: this.criteria.channel,
        dtstart: this.criteria.dtstart,
        dtend: this.criteria.dtend,
        corrupted: this.criteria.corrupted,
        completed: this.criteria.completed,
        order: this.criteria.order,
        by: this.criteria.field,
        page: this.$route.query.page ? this.$route.query.page : 1,
      }
      this.$store.dispatch('fetch.hrd.gaps', q)
      this.$store.dispatch('fetch.hrd.channels').then(list => {this.channellist = _.sortBy(list, 'channel') })
    },
  },
  components: {
    PageHeader,
    SortBy,
    Paginate,
    RangeForm,
    Loading,
    Empty,
  },
}
</script>
