<template>
  <div>
    <PageHeader :title="'VMU Gaps'"/>
    <form class="form-inline my-3 px-3">
      <label for="dtstart">Start Date</label>
      <input type="datetime-local" class="form-control form-control-sm mx-2" id="dtstart"/>
      <label for="dtend">End Date</label>
      <input type="datetime-local" class="form-control form-control-sm mx-2" id="dtend"/>
      <label for="record">Record</label>
      <select id="record" class="form-control form-control-sm mx-2">
      </select>
      <label for="source">Source</label>
      <select id="source" class="form-control form-control-sm">
      </select>
    </form>
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
            <router-link :to="{name: 'view.vmu.detail', params: {id: g.id}}" class="btn btn-secondary btn-sm mx-2">
              <span>view</span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'

export default {
  name: "VmuGap",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.fetch())
  },
  mounted() {
    this.fetch()
  },
  computed: {
    gaps() {
      return this.$store.state.vmugaps
    }
  },
  methods: {
    fetch() {
      this.$store.dispatch('fetch.vmu.gaps')
    },
  },
  components: {
    PageHeader,
  },
}
</script>
