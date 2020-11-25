<template>
  <div>
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
            <a href="#" class="btn btn-secondary btn-sm mx-2">edit</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'

export default {
  name: "Config",
  computed: {
    variables() {
      return this.$store.state.config
    }
  },
  mounted() {
    this.$store.dispatch('fetch.config')
  },
  components: {
    PageHeader
  },
}
</script>
