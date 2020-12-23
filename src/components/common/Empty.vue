<template>
  <div class="d-flex justify-content-center m-5 text-center" v-if="!$store.getters.isLoading">
    <div>
      <h1 class="lead">No data available</h1>
      <p>please, update your search filter!</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "Empty",
}
</script>
<style scoped>
h1.lead {
  font-size: 36px;
}
h1+p {
  font-size: 16px;
}
</style>
