<template>
  <div class="col-md-12 col-lg-12 d-md-block bg-light px-3 py-2 border-top border-right bg-light">
    <h6>status</h6>
    <dl class="row">
      <dt class="col-3">autobrm status</dt>
      <dd class="col-9 text-right">{{state.autobrm}}</dd>
      <dt class="col-3">number gaps</dt>
      <dd class="col-9 text-right">{{total}}</dd>
      <dt class="col-3">gaps duration</dt>
      <dd class="col-9 text-right">47h45min13sec</dd>
      <dt class="col-3">incoming requests</dt>
      <dd class="col-9 text-right">143</dd>
      <dt class="col-3">consolidate size</dt>
      <dd class="col-9 text-right">{{size}}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: "Status",
  computed: {
    state() {
      return this.$store.state.status
    },
    total() {
      return this.$store.getters.totalGap
    },
    size() {
      return this.$store.getters.totalSize
    }
  },
}
</script>

<style scoped>
div {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 270px;
}
div dt {
  font-size: 13px;
}

div dd {
  font-size: 14px;
}
</style>
