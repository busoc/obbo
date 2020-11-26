<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'VMU Gaps'"/>
    <div class="d-flex justify-content-between my-3 px-3">
      <form class="form-inline filter-form">
        <label for="dtstart">Start Date</label>
        <input type="datetime-local" class="form-control form-control-sm mx-2" id="dtstart"/>
        <label for="dtend">End Date</label>
        <input type="datetime-local" class="form-control form-control-sm mx-2" id="dtend"/>
        <label for="record">Record</label>
        <select id="record" class="form-control form-control-sm mx-2">
        </select>
        <label for="source">Source</label>
        <select id="source" class="form-control form-control-sm mx-2">
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
            <router-link :to="{name: 'view.vmu.detail', params: {id: g.id}}" class="btn btn-primary btn-sm mx-1">
              <i data-feather="edit"></i>
            </router-link>
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
import feather from 'feather-icons'
import PageHeader from './PageHeader.vue'
import SortBy from './SortBy.vue'

export default {
  name: "VmuGap",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.fetch())
  },
  data() {
    return {
      field: "",
      order: "",
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
    fetch() {
      this.$store.dispatch('fetch.vmu.gaps')
    },
    orderData() {
      return this.$store.getters.sortGapsVMU(this.field, this.order)
    },
  },
  components: {
    PageHeader,
    SortBy,
  },
}
</script>
