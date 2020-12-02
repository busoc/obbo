<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'HRD Gaps'"/>
    <div class="d-flex justify-content-between my-3 px-3">
      <form class="form-inline filter-form">
        <label for="dtstart">Start Date</label>
        <input @change="fetch" v-model="dtstart" type="datetime-local" class="form-control form-control-sm mx-2" id="dtstart"/>
        <label for="dtend">End Date</label>
        <input @change="fetch" v-model="dtend" type="datetime-local" class="form-control form-control-sm mx-2" id="dtend"/>
        <label for="channel">Channel</label>
        <select @change="fetch" v-model="channel" id="channel" class="form-control form-control-sm mx-2">
          <option value=""></option>
          <option v-for="c in channellist" :value="c.channel" :key="c.channel">{{c.channel}}</option>
        </select>
      </form>
      <SortBy :values="['time', 'channel', 'date', 'missing']"
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
          <td class="text-center">{{g.last - g.first}}</td>
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
import {DateTime} from 'luxon'
import feather from 'feather-icons'
import PageHeader from './PageHeader.vue'
import SortBy from './SortBy.vue'
import _ from 'lodash'

export default {
  name: "HrdGap",
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.load()
      vm.fetch()
    })
  },
  beforeRouteLeave() {
    this.save()
  },
  updated() {
    feather.replace()
  },
  data() {
    return {
      field: "",
      order: "",
      dtstart: "",
      dtend: "",
      channel: "",
      channellist: [],
    }
  },
  computed: {
    gaps() {
      return this.$store.state.hrdgaps
    },
  },
  methods: {
    load() {
      this.dtstart = localStorage["filter.dtstart"] ? JSON.parse(localStorage["filter.dtstart"]) : ""
      this.dtend = localStorage["filter.dtend"] ? JSON.parse(localStorage["filter.dtend"]) : ""
      this.channel = localStorage["filter.channel"] ? JSON.parse(localStorage["filter.channel"]) : ""

      let field = `sort.${this.$route.name}.field`
      let order = `sort.${this.$route.name}.order`
      this.field = localStorage[field] ? JSON.parse(localStorage[field]) : ""
      this.order = localStorage[order] ? JSON.parse(localStorage[order]) : ""
    },
    save() {
      localStorage.setItem("filter.dtstart", JSON.stringify(this.dtstart))
      localStorage.setItem("filter.dtend", JSON.stringify(this.dtend))
      localStorage.setItem("filter.channel", JSON.stringify(this.channel))
    },
    fetch() {
      this.save()
      let start = DateTime.fromISO(this.dtstart)
      let end = DateTime.fromISO(this.dtend)
      let q = {
        channel: this.channel,
        dtstart: "",
        dtend: "",
      }
      if (start.isValid) {
        q.dtstart = start.toFormat("yyyy-LL-dd'T'HH:mm:ss'Z'")
      }
      if (end.isValid) {
        q.dtend = end.toFormat("yyyy-LL-dd'T'HH:mm:ss'Z'")
      }
      this.$store.dispatch('fetch.hrd.gaps', q)
      this.$store.dispatch('fetch.hrd.channels').then(list => {this.channellist = _.sortBy(list, 'channel') })
    },
    orderData() {
      return this.$store.getters.sortGapsHRD(this.field, this.order)
    },
  },
  components: {
    PageHeader,
    SortBy,
  },
}
</script>
