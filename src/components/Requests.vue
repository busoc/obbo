<template>
  <div>
    <PageHeader :title="'Replay'"/>
    <form class="form-inline my-3 px-3">
      <label for="dtstart">Start Date</label>
      <input type="datetime-local" class="form-control form-control-sm mx-2" id="dtstart"/>
      <label for="dtend">End Date</label>
      <input type="datetime-local" class="form-control form-control-sm mx-2" id="dtend"/>
      <label for="status">Status</label>
      <select id="status" class="form-control form-control-sm mx-2">
      </select>
    </form>
    <table class="table table-hover my-3">
      <thead class="thead-dark">
        <tr>
          <th>Time</th>
          <th class="text-center">Status</th>
          <th>Starts</th>
          <th>Ends</th>
          <th class="text-center">Priority</th>
          <th>Comment</th>
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
          <td>{{r.comment || '-'}}</td>
          <td class="text-right">
            <router-link :to="{name: 'view.request.detail', params: {id: r.id}}" class="btn btn-secondary btn-sm mx-2">
              <span>view</span>
            </router-link>
            <router-link :to="{name: 'view.request.cancel', params: {id: r.id}}" class="btn btn-danger btn-sm mx-2">
              <span>cancel</span>
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
  name: "Requests",
  beforeRouteEnter (to, from, next) {
    next(vm => vm.fetch())
  },
  mounted() {
    this.fetch()
  },
  computed: {
    requests() {
      return this.$store.state.requests
    }
  },
  methods: {
    fetch() {
      this.$store.dispatch('fetch.requests')
    },
  },
  components: {
    PageHeader,
  },
}
</script>
