<template>
  <div class="d-flex justify-content-center">
    <nav aria-label="Page navigation example" v-if="pages > 1">
      <ul class="pagination">
        <li v-for="i in pages" :class="['page-item', {active: current==i}]">
          <router-link class="page-link" :to="{name: $route.name, query: build(i)}">
            <span>{{i}}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
export default {
  name: 'Paginate',
  props: ["query"],
  computed: {
    pages() {
      return this.$store.getters.pages
    },
    current() {
      let q = this.$route.query
      return q && q.page ? q.page : 1
    }
  },
  methods: {
    build(page) {
      return Object.assign({}, this.query, {page})
    },
  },
}
</script>
