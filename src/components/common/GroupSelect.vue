<template>
  <div class="mx-3">
    <a v-if="multiple"
      href="#"
      title="edit new request from selected requests"
      class="btn btn-primary btn-sm mx-1">
      <i data-feather="edit"></i>
    </a>
    <a v-if="multiple"
      href="#"
      title="cancel selected requests"
      class="btn btn-danger btn-sm mx-1">
      <i data-feather="trash-2"></i>
    </a>
    <button type="button"
      class="btn btn-sm btn-light"
      data-toggle="button"
      aria-pressed="false"
      title="select multiple items"
      @click.prevent="updateMultiple">
      <i data-feather="bookmark"></i>
    </button>
  </div>
</template>
<script>
export default {
  name: 'GroupSelect',
  emit: ['update:multiple'],
  data() {
    return {
      multiple: false,
    }
  },
  methods: {
    updateMultiple() {
      this.multiple = !this.multiple
      this.$emit('update:multiple', this.multiple)
    }
  },
}
</script>
