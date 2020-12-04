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
        <Lines :what="'replays-count'" :list="items.REPLAY" :field="'count'"/>
        <Lines :what="'hrd-gaps'" :list="items.HRD" :field="'count'"/>
        <Lines :what="'vmu-gaps'" :list="items.VMU" :field="'count'"/>
      </div>
    </div>
    <div class="px-3 my-4">
      <div class="row">
        <Lines :what="'pending'" :list="replays.PENDING" :field="'count'"/>
        <Lines :what="'running'" :list="replays.RUNNING" :field="'count'"/>
        <div class="w-100"></div>
        <Lines :what="'completed'" :list="replays.COMPLETED" :field="'count'"/>
        <Lines :what="'cancelled'" :list="replays.CANCELLED" :field="'count'"/>
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
      items: {},
    }
  },
  methods: {
    fetch() {
      this.$store.dispatch('fetch.requests.stats').then(list => this.replays = Object.assign({}, list))
      this.$store.dispatch('fetch.items.stats').then(list => this.items = Object.assign({}, list))
    },
  },
}
</script>
