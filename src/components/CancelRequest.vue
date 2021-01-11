<template>
  <div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Cancel Request(s) <span>({{total}})</span></h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent="cancel">
        <p v-if="err" class="alert alert-danger border-0">{{err}}</p>
        <p>Confirm canceling the current request? No more actions will be performed by autobrm after the request has been marked as canceled</p>
          <div class="form-group">
            <label for="comment" class="text-capitalize">comment</label>
            <input v-model="comment" type="text" class="form-control" id="comment" placeholder="additional information about the reason"/>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <router-link :to="origin" class="btn btn-secondary">close</router-link>
        <button @click="cancel" type="button" class="btn btn-primary">
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
  name: 'CancelRequest',
  data() {
    return {
      err: "",
      comment: "",
      origin: {},
      working: false,
    }
  },
  computed: {
    total() {
      if (this.$route.params.id) {
        return 1
      }
      return this.$route.query.replay.length
    }
  },
  methods: {
    cancel() {
      if (this.working) {
        return
      }
      let replays = []
      if (this.$route.params.id) {
        replays.push(this.$route.params.id)
      }
      if (this.$route.query.replay) {
        this.$route.query.replay.forEach(i => replays.push(i))
      }
      this.working = true
      this.$store.dispatch("cancel.request.all", {replays, comment: this.comment})
        .catch(err => {
          this.err = err
          this.working = false
        })
        .then(() => {
          this.working = false
          this.$router.push(this.origin)
        })
    },
    toggle() {
      $(this.$el).modal('toggle')
    },
  },
  beforeRouteEnter(to, from, next) {
    next(v => {
      v.toggle()
      v.origin = Object.assign(from, {query: from.query})
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
