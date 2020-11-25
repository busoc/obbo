<template>
  <div style="position:relative">
    <Nav />
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse px-0">
          <Menu />
          <Status />
        </nav>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-0 border-left" style="margin-top:24px">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Status from './components/Status.vue'
import Menu from './components/Menu.vue'
import Nav from './components/Nav.vue'

export default {
  name: 'App',
  mounted() {
    this.$store.dispatch('fetch.status')
  },
  components: {
    Status,
    Menu,
    Nav,
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}
</style>
