<template>
  <div>
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
        <div class="col my-1" v-for="vs in packets.missing" :key="vs.label">
          <Lines :what="'missing-'+vs.label" :list="vs.list" :field="'count'"/>
        </div>
      </div>
    </div>
    <div class="px-3 my-4">
      <div class="row">
        <div class="col my-1" v-for="vs in packets.corrupted" :key="vs.label">
          <Lines :what="'corrupted-'+vs.label" :list="vs.list" :field="'count'"/>
        </div>
      </div>
    </div>
    <div class="px-3 my-4">
      <div class="row">
        <div class="col my-1" v-for="vs in counts.vmu" :key="vs.label">
          <Lines :what="'vmu-gaps-0x'+vs.label" :list="vs.list" :field="'count'"/>
        </div>
        <div class="w-100"></div>
        <div class="col my-1" v-for="vs in counts.hrd" :key="vs.label">
          <Lines :what="'hrd-gaps-'+vs.label" :list="vs.list" :field="'count'"/>
        </div>
        <div class="w-100"></div>
        <div class="col my-1">
          <Lines :what="'replays-count'" :list="counts.replay" :field="'count'"/>
        </div>
      </div>
    </div>
    <div class="px-3 my-4">
      <div class="row">
        <div class="col my-1">
          <Lines :what="'pending'" :list="replays.PENDING" :field="'count'"/>
        </div>
        <div class="col my-1">
          <Lines :what="'running'" :list="replays.RUNNING" :field="'count'"/>
        </div>
        <div class="w-100"></div>
        <div class="col my-1">
          <Lines :what="'completed'" :list="replays.COMPLETED" :field="'count'"/>
        </div>
        <div class="col my-1">
          <Lines :what="'cancelled'" :list="replays.CANCELLED" :field="'count'"/>
        </div>
      </div>
    </div>
    <!-- <div class="px-3 my-4">
      <div class="row">
        <div class="col-8">
        </div>
        <div class="col-4">
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import _ from 'lodash'
import {Duration} from 'luxon'
import TinyStat from './TinyStat.vue'
import Lines from './charts/Lines.vue'

function toArray(values) {
  return _.chain(values)
    .entries()
    .map(arr => {
      return {label: arr[0], list: arr[1]}
    })
    .value()
}

function formatDuration(d) {
  let time = Duration.fromObject({seconds: d})
  return time.toFormat("h'H'mm'.'ss")
}

export default {
  name: 'Dashboard',
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fetch())
  },
  data() {
    return {
      replays: {},
      counts: {
        replay: [],
        vmu: [],
        hrd: [],
      },
      packets: {
        missing: [],
        corrupted: [],
      },
      durationFormatter: formatDuration,
    }
  },
  methods: {
    fetch() {
      this.$store.dispatch('fetch.requests.stats').then(list => this.replays = Object.assign({}, list))
      this.$store.dispatch('fetch.packets.stats').then(list => {
        this.packets.missing = toArray(_.groupBy(list.MISSING, 'channel'))
        this.packets.corrupted = toArray(_.groupBy(list.CORRUPTED, 'channel'))
      })
      this.$store.dispatch('fetch.items.stats').then(list => {
        this.counts.replay = [...list.REPLAY]
        this.counts.vmu = toArray(_.groupBy(list.VMU, 'origin'))
        this.counts.hrd = toArray(_.groupBy(list.HRD, 'origin'))
      })
    },
  },
  components: {
    TinyStat,
    Lines,
  },
}
</script>
