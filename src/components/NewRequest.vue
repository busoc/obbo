<template>
  <div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create Request</h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent>
          <p v-if="err" class="alert alert-danger border-0">{{err}}</p>
          <div class="form-group">
            <label for="dtstart">start date</label>
            <input type="datetime-local" v-model="dtstart" class="form-control" id="dtstart"/>
          </div>
          <div class="form-group">
            <label for="dtend">end date</label>
            <input type="datetime-local" v-model="dtend" class="form-control" id="dtend"/>
          </div>
          <div class="form-group">
            <label for="priority">priority</label>
            <input type="number" v-model="priority" class="form-control" id="priority"/>
          </div>
          <div class="form-group">
            <label for="comment">comment</label>
            <input type="number" v-model="comment" class="form-control" id="comment"/>
          </div>
        </form>
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
import {DateTime} from 'luxon'

export default {
  name: 'NewRequest',
  data() {
    return {
      prev: undefined,
      dtstart: "",
      dtend: "",
      priority: "",
      comment: "",
      err: "",
    }
  },
  methods: {
    toggle() {
      $(this.$el).modal('toggle')
    },
  },
  beforeRouteEnter(to, from, next) {
    next(v => {
        v.prev = from.name
        if (to.query.dtstart && to.query.dtend) {
          v.dtstart = DateTime.fromISO(to.query.dtstart).toFormat("yyyy-LL-dd'T'HH:mm:ss")
          v.dtend = DateTime.fromISO(to.query.dtend).toFormat("yyyy-LL-dd'T'HH:mm:ss")
        }
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
