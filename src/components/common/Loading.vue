<template>
  <div class="d-flex justify-content-center" v-if="$store.getters.isLoading">
    <div class="spinner-border m-5" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
}
</script>
