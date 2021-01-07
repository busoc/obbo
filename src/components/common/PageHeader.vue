<template>
  <header class="d-flex justify-content-between border-bottom py-1">
    <h1 class="h5 text-capitalize px-3">{{title}}</h1>
    <slot>
    </slot>
  </header>
</template>
<script>
export default {
  name: 'PageHeader',
  props: ['title'],
}
</script>
