<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'Replay'">
      <GroupSelect v-if="requests && requests.length > 0"
          :period="isoPeriod"
          :replays="replays"
          :cancelRoute="'replay.request.cancel.all'"
          :newRoute="'replay.new.request'"
          :editRoute="'replay.request.priority.all'"
          @update:multiple="updateMulti"/>
    </PageHeader>
    <div class="d-flex justify-content-between my-3 px-3">
      <RangeForm @update:range="updateRange" :start="criteria.dtstart" :end="criteria.dtend"/>
      <form class="form-inline filter-form">
        <label for="status">Status</label>
        <select @change="fetch" v-model="criteria.status" id="status" class="form-control form-control-sm mx-1">
          <option></option>
          <option v-for="s in statuslist" :key="s.name">{{s.name}}</option>
        </select>
      </form>
      <SortBy :fields="sortFields" @update:sort="updateSort"/>
    </div>
    <Loading />
    <table class="table table-hover my-3 table-sm" v-if="requests && requests.length">
      <thead class="thead-dark">
        <tr>
          <th v-if="multiple"></th>
          <th class="text-capitalize">Time</th>
          <th class="text-center text-capitalize">Status</th>
          <th class="text-capitalize">Starts</th>
          <th class="text-capitalize">Ends</th>
          <th class="text-center text-capitalize">Missing</th>
          <th class="text-center text-capitalize">Corrupted</th>
          <th class="text-center text-capitalize">Priority</th>
          <th class="text-center text-capitalize">Automatic</th>
          <th v-if="!multiple"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in requests" :key="r.id">
          <td v-if="multiple">
            <input @click="selectRequest(r)" type="checkbox" v-if="r.cancellable"/>
          </td>
          <td>{{formatTime(r.time)}}</td>
          <td class="text-center">{{r.status}}</td>
          <td>{{formatTime(r.dtstart)}}</td>
          <td>{{formatTime(r.dtend)}}</td>
          <td class="text-center">{{r.missing}}</td>
          <td class="text-center">{{r.corrupted}}</td>
          <td class="text-center">{{r.priority == -1 ? '-' : r.priority}}</td>
          <td class="text-center">
            <i v-if="r.automatic" data-feather="award"></i>
          </td>
          <td v-if="!multiple" class="text-right">
            <router-link v-if="r.cancellable" title="edit request priority" :to="{name: 'replay.request.priority', params: {id: r.id}}" class="btn btn-primary btn-sm mx-1">
              <i data-feather="edit"></i>
            </router-link>
            <router-link v-if="r.cancellable" title="cancel request" :to="{name: 'replay.request.cancel', params: {id: r.id}}" class="btn btn-danger btn-sm mx-1">
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
import {DateTime} from 'luxon'
import {RFC3339} from './intervals.js'
import $ from 'jquery'
import 'bootstrap'
import _ from 'lodash'
import feather from 'feather-icons'
import PageHeader from './common/PageHeader.vue'
import SortBy from './common/SortBy.vue'
import GroupSelect from './common/GroupSelect.vue'
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
  field: "",
  order: "",
}

export default {
  name: "Requests",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.resetAndFetch())
  },
  data() {
    return {
      criteria: defaultCriteria,
      replays: [],
      period: {
        dtstart: undefined,
        dtend: undefined,
      },
      multiple: false,
      statuslist: [],
    }
  },
  mounted() {
    $().button('toggle')
  },
  updated() {
    feather.replace()
  },
  computed: {
    requests() {
      return this.$store.getters.objects
    },
    sortFields() {
      return repfields
    },
    query() {
      return Object.assign({}, this.criteria)
    },
    isoPeriod() {
      let dtstart, dtend;
      if (this.period.dtstart && this.period.dtstart.isValid) {
        dtstart = this.period.dtstart.toFormat(RFC3339)
      }
      if (this.period.dtend && this.period.dtend.isValid) {
        dtend = this.period.dtend.toFormat(RFC3339)
      }
      return {dtstart, dtend}
    }
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
    selectRequest(r) {
      let x = this.replays.indexOf(r.id)
      if (x < 0) {
        this.replays.push(r.id)
      } else {
        this.replays.splice(x, 1)
      }
      let when = DateTime.fromISO(r.time)
      if (!this.period.dtstart || when < this.period.dtstart) {
        this.period.dtstart = when
      }
      if (!this.period.dtend || when > this.period.dtend) {
        this.period.dtend = when
      }
    },
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
    updateMulti(multi) {
      this.multiple = multi
      if (!multi) {
        this.replays = []
        this.period = {}
      }
    },
    updateRange({start, end}) {
      this.criteria.dtstart = start
      this.criteria.dtend = end
      this.$router.push({name: this.$route.name, query: this.criteria})
    },
    updateSort({field, order}) {
      this.criteria.field = field
      this.criteria.order = order
      this.$router.push({name: this.$route.name, query: this.criteria})
    },
    fetch() {
      let q = {
        status: this.criteria.status,
        dtstart: this.criteria.dtstart,
        dtend: this.criteria.dtend,
        page: this.$route.query.page ? this.$route.query.page : 1,
        by: this.criteria.field,
        order: this.criteria.order,
      }
      this.$store.dispatch('fetch.requests', q)
      this.$store.dispatch('fetch.requests.status').then(list => {this.statuslist = _.sortBy(list, 'name') })
    },
  },
  components: {
    PageHeader,
    Paginate,
    SortBy,
    RangeForm,
    Loading,
    Empty,
    GroupSelect,
  },
}
</script>
