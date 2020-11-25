<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <router-link class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/">
      <span>OBBO</span>
    </router-link>
    <span class="navbar-text mx-2">
      autobrm: {{status.autobrm}}
    </span>
  </nav>
</template>

<script>
export default {
  name: "Nav",
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
