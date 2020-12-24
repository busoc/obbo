<template>
  <div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit Request's Priority</h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent="apply">
        <p v-if="err" class="alert alert-danger border-0">{{err}}</p>
          <div class="form-group">
            <label for="priority" class="text-capitalize">priority</label>
            <input v-model.number="priority" type="number" class="form-control" id="priority" placeholder="1106"/>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <router-link :to="origin" class="btn btn-secondary">close</router-link>
        <button @click="apply" type="button" class="btn btn-primary">
          <span v-if="working" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>apply</span>
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'jquery'
import 'bootstrap'

export default {
  name: 'EditRequest',
  data() {
    return {
      err: "",
      priority: "",
      origin: {},
      working: false,
    }
  },
  methods: {
    apply() {
      if (this.working) {
        return
      }
      let q = {
        priority: parseInt(this.priority),
        id: this.$route.params.id,
      }
      this.working = true
      this.$store.dispatch('update.request', q).then(() => {
        this.$router.push(this.origin)
        this.working = false
      }).catch(err => {
        this.err = err
        this.working = false
      })
    },
    toggle() {
      $(this.$el).modal('toggle')
    },
  },
  beforeRouteEnter(to, from, next) {
    next(v => {
        v.toggle()
        v.origin = Object.assign(from, {query: to.query})
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
