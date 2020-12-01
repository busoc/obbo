<template>
  <div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create Request</h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent="register">
          <p v-if="err" class="alert alert-danger border-0">{{err}}</p>
          <div class="form-group">
            <label class="text-capitalize" for="dtstart">start date</label>
            <input type="datetime-local" v-model="dtstart" :class="['form-control', {'is-invalid': errors.dtstart}]" id="dtstart"/>
          </div>
          <div class="form-group">
            <label class="text-capitalize" for="dtend">end date</label>
            <input type="datetime-local" v-model="dtend" :class="['form-control', {'is-invalid': errors.dtend}]" id="dtend"/>
          </div>
          <div class="form-group">
            <label class="text-capitalize" for="priority">priority</label>
            <input type="number" v-model="priority" class="form-control" id="priority"/>
          </div>
          <div class="form-group">
            <label class="text-capitalize" for="comment">comment</label>
            <input type="text" v-model="comment" class="form-control" id="comment"/>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <router-link :to="{name: prev}" class="btn btn-secondary">close</router-link>
        <button :disabled="errors.dtstart || errors.dtend" @click="register" type="button" class="btn btn-primary">save</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {DateTime} from 'luxon'
import $ from 'jquery'
import 'bootstrap'

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
      errors: {
        dtstart: false,
        dtend: false,
      },
    }
  },
  methods: {
    toggle() {
      $(this.$el).modal('toggle')
    },
    register() {
      let start = DateTime.fromISO(this.dtstart)
      let end = DateTime.fromISO(this.dtend)
      let q = {
        comment: this.comment,
        priority: parseInt(this.priority),
        dtstart: "",
        dtend: "",
      }

      this.errors.dtstart = false
      this.errors.dtend = false

      if (!start.isValid) {
        this.errors.dtstart = true
        return
      }
      q.dtstart = start.toFormat("yyyy-LL-dd'T'HH:mm:ss'Z'")
      if (!end.isValid) {
        this.errors.dtend = true
        return
      }
      q.dtend = end.toFormat("yyyy-LL-dd'T'HH:mm:ss'Z'")

      if (end < start) {
        this.errors.dtstart = true
        this.errors.dtend = true
        return
      }

      this.$store.dispatch("register.request", q)
        .catch(rs => this.err = rs)
        .then(() => {
          this.$router.push({name: this.prev})
        })
    }
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
