<template>
  <div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit Variable</h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent="register">
          <p v-if="err" class="alert alert-danger border-0">{{err}}</p>
          <div class="form-group">
            <label for="name" class="text-capitalize">name</label>
            <input readonly v-model="name" type="text" class="form-control" id="name"/>
          </div>
          <div class="form-group">
            <label for="value" class="text-capitalize">value</label>
            <input v-model="value" type="text" class="form-control" id="value"/>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <router-link :to="{name: 'view.settings'}" class="btn btn-secondary">close</router-link>
        <button @click="register" type="button" class="btn btn-primary">save</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'jquery'
import 'bootstrap'

export default {
  name: 'EditVariable',
  data() {
    return {
      name: "",
      value: "",
      err: "",
    }
  },
  methods: {
    register() {
      if (!this.value) {
        return
      }
      this.$store.dispatch("update.variable", {id: this.$route.params.id, data: {value: this.value}})
        .catch(rs => this.err = rs)
        .then(() => {
          this.$router.push({name: 'view.settings'})
        })
    },
    toggle() {
      $(this.$el).modal('toggle')
    },
  },
  beforeRouteEnter(to, from, next) {
    next(v => {
        let obj = v.$store.getters.variable(to.params.id)
        v.name = obj.name
        v.value = obj.value
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
