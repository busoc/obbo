<template>
  <div class="sidebar-sticky">
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link :to="{name: 'view.dashboard'}"  :class="['nav-link', {active: $route.name == 'view.dashboard'}]">
          <span>Dashboard</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{name: 'view.requests'}" :class="['nav-link', {active: $route.name == 'view.requests'}]">
          <span>Requests</span>
          <span v-if="totalRequests" class="badge badge-primary float-right">{{totalRequests}}</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{name: 'view.vmu.gaps'}"  :class="['nav-link', {active: $route.name == 'view.vmu.gaps'}]">
          <span>VMU Gaps</span>
          <span v-if="totalVMU" class="badge badge-primary float-right">{{totalVMU}}</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{name: 'view.hrd.gaps'}"  :class="['nav-link', {active: $route.name == 'view.hrd.gaps'}]">
          <span>HRD Gaps</span>
          <span v-if="totalHRD" class="badge badge-primary float-right">{{totalHRD}}</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{name: 'view.settings'}"  :class="['nav-link', {active: $route.name == 'view.settings'}]">
          <span>Variables</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Menu",
  computed: {
    totalHRD() {
      return this.$store.getters.totalHRD
    },
    totalRequests() {
      return this.$store.getters.totalRequests
    },
    totalVMU() {
      return this.$store.getters.totalVMU
    },
  },
}
</script>

<style scoped>
.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px - 270px);
  margin-bottom: 120px;
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}
.sidebar-sticky .nav-link {
  font-weight: 500;
  color: #333;
}
.sidebar-sticky .nav-link.active {
  color: #007bff;
}
.sidebar-sticky .nav-link:hover .feather {
  color: inherit;
}
</style>
