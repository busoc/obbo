<template>
  <div class="mx-3">
    <router-link v-if="multiple"
      :to="{name: editRoute, query: period}"
      title="edit new request from selected requests"
      @click="updateMultiple"
      class="btn btn-primary btn-sm mx-1"
      :class="{disabled: disableEdit}">
      <i data-feather="plus-square"></i>
    </router-link>
    <router-link v-if="multiple"
      :to="{name: cancelRoute, query: {replay: this.replays}}"
      title="cancel selected requests"
      @click="updateMultiple"
      class="btn btn-danger btn-sm mx-1"
      :class="{disabled: disableCancel}">
      <i data-feather="trash-2"></i>
    </router-link>
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
  props: [
    'period',
    'replays',
    'cancelRoute',
    'editRoute'
  ],
  data() {
    return {
      multiple: false,
    }
  },
  computed: {
    disableEdit() {
      return !this.period || Object.keys(this.period) == 0 || !this.period.dtstart || !this.period.dtend
    },
    disableCancel() {
      return !this.replays || this.replays.length == 0
    },
  },
  methods: {
    updateMultiple() {
      this.multiple = !this.multiple
      this.$emit('update:multiple', this.multiple)
    }
  },
}
</script>
