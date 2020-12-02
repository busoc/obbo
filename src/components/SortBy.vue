<template>
  <form class="form-inline">
    <label for="sort">sort by</label>
    <select :disabled="!values.length" id="sort" class="form-control form-control-sm mx-2" @change="fieldChanged">
      <option v-for="a in all" :key="a" :value="a" class="text-capitalize">{{a}}</option>
    </select>
    <label for="order">order</label>
    <select :disabled="!values.length" id="order" class="form-control form-control-sm mx-2" @change="orderChanged">
      <option value="asc">ASC</option>
      <option value="desc">DESC</option>
    </select>
  </form>
</template>
<script>
export default {
  name: 'SortBy',
  props: ['values', 'empty', 'field', 'order'],
  emits: ['update:field', 'update:order'],
  computed: {
    all() {
      let values = [...this.values]
      if (this.empty) {
        return [''].concat(values)
      }
      return values
    }
  },
  methods: {
    fieldChanged(event) {
      this.$emit('update:field', event.target.value)
      localStorage.setItem(`sort.${this.$route.name}.field`, JSON.stringify(event.target.value))
    },
    orderChanged(event) {
      this.$emit('update:order', event.target.value)
      localStorage.setItem(`sort.${this.$route.name}.order`, JSON.stringify(event.target.value))
    },
  },
}
</script>
