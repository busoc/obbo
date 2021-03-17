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
            <input @change="validate"
              type="text"
              pattern="[0-9]{4}.[0-9]{3}.[0-9]{2}.[0-9]{2}.[0-9]{2}"
              placeholder="yyyy.ddd.hh.mm.ss"
              v-model="dtstart"
              :class="['form-control', {'is-invalid': errors.dtstart}]"
              id="dtstart"/>
          </div>
          <div class="form-group">
            <label class="text-capitalize" for="dtend">end date</label>
            <input @change="validate"
              type="text"
              pattern="[0-9]{4}.[0-9]{3}.[0-9]{2}.[0-9]{2}.[0-9]{2}"
              placeholder="yyyy.ddd.hh.mm.ss"
              v-model="dtend"
              :class="['form-control', {'is-invalid': errors.dtend}]"
              id="dtend"/>
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
        <router-link :to="origin" class="btn btn-secondary">close</router-link>
        <button :disabled="errors.dtstart || errors.dtend" @click="register" type="button" class="btn btn-primary">
          <span v-if="working" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>save</span>
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {DateTime} from 'luxon'
import {DoyFormat, RFC3339} from './intervals.js'
import $ from 'jquery'
import 'bootstrap'

export default {
  name: 'NewRequest',
  data() {
    return {
      origin: {},
      dtstart: "",
      dtend: "",
      priority: "",
      comment: "",
      working: false,
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
    validate() {
      let start = DateTime.fromFormat(this.dtstart, DoyFormat)
      let end = DateTime.fromFormat(this.dtend, DoyFormat)

      this.errors.dtstart = false
      this.errors.dtend = false

      if (!start.isValid) {
        this.errors.dtstart = true
      }
      if (!end.isValid) {
        this.errors.dtend = true
      }
    },
    register() {
      if (this.workking) {
        return
      }
      let start = DateTime.fromFormat(this.dtstart, DoyFormat)
      let end = DateTime.fromFormat(this.dtend, DoyFormat)
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
      q.dtstart = start.toFormat(RFC3339)
      if (!end.isValid) {
        this.errors.dtend = true
        return
      }
      q.dtend = end.toFormat(RFC3339)

      if (end < start) {
        this.errors.dtstart = true
        this.errors.dtend = true
        return
      }

      this.working = true
      this.$store.dispatch("register.request", q)
        .catch(rs => {
          this.err = rs
          this.working = false
        })
        .then(() => {
          this.working = false
          this.$router.push(this.origin)
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(v => {
        if (to.query.dtstart && to.query.dtend) {
          v.dtstart = DateTime.fromISO(to.query.dtstart).toFormat(DoyFormat)
          v.dtend = DateTime.fromISO(to.query.dtend).toFormat(DoyFormat)
        }
        v.origin = Object.assign(from, {query: from.query})
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
