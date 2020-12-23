<template>
  <div class="d-flex justify-content-center">
    <nav aria-label="Page navigation example" v-if="total > 1">
      <ul class="pagination">
        <li :class="['page-item', {disabled: current==1}]">
          <router-link class="page-link" :to="{name: $route.name, query: build(1)}">
            <span>first</span>
          </router-link>
        </li>
        <li :class="['page-item', {disabled: current==1}]">
          <router-link class="page-link" :to="{name: $route.name, query: build(prev)}">
            <span>previous</span>
          </router-link>
        </li>
        <li v-for="i in pages" :class="['page-item', {active: current==i}]">
          <router-link class="page-link" :to="{name: $route.name, query: build(i)}">
            <span>{{i}}</span>
          </router-link>
        </li>
        <li :class="['page-item', {disabled: current==total}]">
          <router-link class="page-link" :to="{name: $route.name, query: build(next)}">
            <span>next</span>
          </router-link>
        </li>
        <li :class="['page-item', {disabled: current==total}]">
          <router-link class="page-link" :to="{name: $route.name, query: build(total)}">
            <span>last</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
const MaxPage = 11
import _ from 'lodash'

export default {
  name: 'Paginate',
  props: ["query"],
  computed: {
    prev() {
      return this.current > 1 ? this.current-1 : 1
    },
    next() {
      return this.current < this.total ? this.current+1 : this.total
    },
    total() {
      return this.$store.getters.pages
    },
    pages() {
      let start = 0
      let end = 0
      if (this.current < MaxPage) {
        start = 1
        end = MaxPage
      } else if (this.current >= this.total-MaxPage) {
        start = this.total-MaxPage
        end = this.total
      } else {
        start = this.current - parseInt(MaxPage/2)
        end = this.current + parseInt(MaxPage/2)
      }
      return _.range(start, end+1)
    },
    current() {
      let q = this.$route.query
      return q && q.page ? parseInt(q.page) : 1
    }
  },
  methods: {
    build(page) {
      return Object.assign({}, this.query, {page})
    },
  },
}
</script>
