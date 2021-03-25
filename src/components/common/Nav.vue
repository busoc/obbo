<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <router-link class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" :to="{name: 'view.index'}">
      <span>OBBO</span>
    </router-link>
    <ul class="navbar-nav">
      <li class="nav-item">
        <router-link :to="{name: 'new.request'}" class="nav-link px-2 mx-1" title="register new request">
          <i data-feather="plus-square"></i>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{name: 'view.autobrm'}" class="nav-link px-2 mx-1" title="autobrm status">
          <i data-feather="cpu"></i>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import feather from 'feather-icons'
export default {
  name: "Nav",
  mounted() {
    feather.replace()
  },
  computed: {
    status() {
      return this.$store.state.status
    }
  },
}
</script>

<style scoped>
.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}
.navbar-nav {
    flex-direction: row;
}
</style>
