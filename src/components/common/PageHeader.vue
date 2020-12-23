<template>
  <header>
    <h1 class="h5 text-capitalize border-bottom px-3">{{title}}</h1>
  </header>
</template>
<script>
export default {
  name: 'PageHeader',
  props: ['title'],
}
</script>
