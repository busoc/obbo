<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'HRD Gaps'"/>
    <div class="d-flex justify-content-between my-3 px-3">
      <form class="form-inline">
        <label for="dtstart">Start Date</label>
        <input type="datetime-local" class="form-control form-control-sm mx-2" id="dtstart"/>
        <label for="dtend">End Date</label>
        <input type="datetime-local" class="form-control form-control-sm mx-2" id="dtend"/>
        <label for="channel">Channel</label>
        <select id="channel" class="form-control form-control-sm mx-2">
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
            <router-link title="view detail" :to="{name: 'view.hrd.detail', params: {id: g.id}}" class="btn btn-primary btn-sm mx-1">
              <i data-feather="edit"></i>
            </router-link>
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
import feather from 'feather-icons'
import PageHeader from './PageHeader.vue'
import SortBy from './SortBy.vue'

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
      field: "",
      order: "",
    }
  },
  computed: {
    gaps() {
      return this.$store.state.hrdgaps
    },
  },
  methods: {
    fetch() {
      this.$store.dispatch('fetch.hrd.gaps')
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
