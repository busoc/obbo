<template>
  <div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Cancel Request</h5>
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
        <router-link :to="{name: 'view.requests'}" class="btn btn-secondary">close</router-link>
        <button @click="cancel" type="button" class="btn btn-primary">confirm</button>
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
    }
  },
  methods: {
    cancel() {
      this.$store.dispatch("cancel.request", {id: this.$route.params.id, comment: this.comment})
        .catch(rs => this.err = rs)
        .then(() => {
          this.$router.push({name: 'view.requests'})
        })
    },
    toggle() {
      $(this.$el).modal('toggle')
    },
  },
  beforeRouteEnter(to, from, next) {
    next(v => {
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
