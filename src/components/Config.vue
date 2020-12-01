<template>
  <div>
    <router-view></router-view>
    <PageHeader :title="'settings'"/>
    <table class="table table-hover my-3">
      <thead class="thead-dark">
        <tr>
          <th class="text-capitalize">Parameter</th>
          <th class="text-center text-capitalize">Type</th>
          <th class="text-capitalize">Value</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in variables" :key="v.name">
          <td>{{v.name}}</td>
          <td class="text-center">{{v.type || "-"}}</td>
          <td>{{v.value}}</td>
          <td class="text-right">
            <router-link :to="{name: 'edit.variable', params:{id: v.id}}" class="btn btn-primary btn-sm mx-2">
              <i data-feather="edit"></i>
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

export default {
  name: "Config",
  computed: {
    variables() {
      return this.$store.state.config
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.fetch())
  },
  beforeRouteUpdate() {
    this.fetch()
  },
  updated() {
    feather.replace()
  },
  methods: {
    fetch() {
      this.$store.dispatch('fetch.config')
    },
  },
  components: {
    PageHeader
  },
}
</script>
