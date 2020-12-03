<template>
  <div>
    <PageHeader :title="'Dashboard'"/>
    <div class="px-3 my-4">
      <div class="row">
        <TinyStat :title="'pending'" :list="replays.PENDING"/>
        <TinyStat :title="'running'" :list="replays.RUNNING"/>
        <TinyStat :title="'completed'" :list="replays.COMPLETED"/>
        <TinyStat :title="'cancelled'" :list="replays.CANCELLED"/>
      </div>
    </div>
    <div class="px-3 my-4">
      <div class="row">
        <Lines :what="'pending'" :list="replays.PENDING"/>
        <Lines :what="'running'" :list="replays.RUNNING"/>
        <div class="w-100"></div>
        <Lines :what="'completed'" :list="replays.COMPLETED"/>
        <Lines :what="'cancelled'" :list="replays.CANCELLED"/>
      </div>
    </div>
    <div class="px-3 my-4">
      <div class="row">
        <div class="col-8">
        </div>
        <div class="col-4">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TinyStat from './TinyStat.vue'
import PageHeader from './PageHeader.vue'
import Lines from './charts/Lines.vue'

export default {
  name: 'Dashboard',
  components: {
    TinyStat,
    PageHeader,
    Lines,
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fetch())
  },
  data() {
    return {
      replays: {},
    }
  },
  methods: {
    fetch() {
      this.$store.dispatch('fetch.requests.stats').then(list => this.replays = Object.assign({}, list))
    },
  },
}
</script>
