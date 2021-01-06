<template>
  <div class="col-md-12 col-lg-12 d-md-block bg-light px-3 py-2 border-top border-right bg-light">
    <h6>Status</h6>
    <dl class="row">
      <dt class="col-5">autobrm</dt>
      <dd class="col-7 text-right">{{autobrm.state ? "running" : "unknown"}}</dd>
      <dt class="col-5">requests</dt>
      <dd class="col-7 text-right">{{$store.getters.totalRequest || 0}}</dd>
      <dt class="col-5">vmu gaps</dt>
      <dd class="col-7 text-right">{{$store.getters.totalVMU || 0}}</dd>
      <dt class="col-5">hrd gaps</dt>
      <dd class="col-7 text-right">{{$store.getters.totalHRD || 0}}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: "Status",
  computed: {
    autobrm() {
      return this.$store.getters.autobrm || {}
    },
  },
}
</script>

<style scoped>
div {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 180px;
}
div dt {
  font-size: 13px;
}

div dd {
  font-size: 14px;
}
</style>
