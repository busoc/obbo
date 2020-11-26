<template>
  <form class="form-inline">
    <label for="sort">sort by</label>
    <select :disabled="!values.length" id="sort" class="form-control form-control-sm mx-2">
      <option v-for="a in all" :key="a" :value="a">{{a}}</option>
    </select>
    <label for="order">order</label>
    <select :disabled="!values.length" id="order" class="form-control form-control-sm mx-2">
      <option value="ASC">ASC</option>
      <option value="DESC">DESC</option>
    </select>
  </form>
</template>
<script>
export default {
  name: 'SortBy',
  props: ['values', 'empty'],
  computed: {
    all() {
      let values = [...this.values]
      if (this.empty) {
        return [''].concat(values)
      }
      return values
    }
  }
}
</script>
