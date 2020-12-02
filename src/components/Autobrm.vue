<template>
  <div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">autoBRM Status</h5>
      </div>
      <div class="modal-body">
        <table class="table table-striped">
          <tbody>
            <tr>
              <th>Command</th>
              <td class="text-right">{{autobrm.cmdline}}</td>
            </tr>
            <tr>
              <th>PID</th>
              <td class="text-right">{{autobrm.pid}}</td>
            </tr>
            <tr>
              <th>State</th>
              <td class="text-right">{{autobrm.state}}</td>
            </tr>
            <tr>
              <th>Resident Set Size</th>
              <td class="text-right">{{autobrm.vmrss}}</td>
            </tr>
            <tr>
              <th>Virtual Memory</th>
              <td class="text-right">{{autobrm.vmsize}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <router-link :to="{name: prev}" class="btn btn-primary">close</router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'jquery'
import 'bootstrap'

export default {
  name: 'Autobrm',
  data() {
    return {
      prev: undefined,
    }
  },
  computed: {
    autobrm() {
      return this.$store.getters.autobrm || {}
    },
  },
  methods: {
    toggle() {
      $(this.$el).modal('toggle')
    },
  },
  beforeRouteEnter(to, from, next) {
    next(v => {
        v.prev = from.name
        v.toggle()
    });
  },
  beforeRouteLeave(to, from, next) {
    this.toggle()
    return next()
  },
  mounted() {
    $(this.$el).modal({show: false, keyboard: false, backdrop: 'static'})
  },
}
</script>
