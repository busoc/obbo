<template>
  <form class="form-inline">
    <label for="sort">sort by</label>
    <select v-model="field" id="sort" class="form-control form-control-sm mx-1" @change="changed">
      <option value=""></option>
      <option v-for="(a, k) in fields" :key="a" :value="a" class="text-capitalize">{{k}}</option>
    </select>
    <label for="order">order</label>
    <select v-model="order" id="order" class="form-control form-control-sm mx-1" @change="changed">
      <option value="asc">ASC</option>
      <option value="desc">DESC</option>
    </select>
  </form>
</template>
<script>

export default {
  name: 'SortBy',
  props: ["fields"],
  emits: ['update:sort'],
  data() {
    return {
      field: "",
      order: "",
    }
  },
  methods: {
    changed() {
      this.$emit('update:sort', {field: this.field, order: this.order})
    },
  },
}
</script>
