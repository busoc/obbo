import $ from 'jquery'
import _ from 'lodash'
import {createStore} from 'vuex'

const state = {
  status: {},
  requests: [],
  vmugaps: [],
  hrdgaps: [],
  config:  [],
}

function orderArray(arr, field, order) {
  return field ? _.orderBy(arr, field, order) : arr
}

const getters = {
  sortRequests: (state) => (field, order) => {
    return orderArray(state.requests, field, order)
  },
  sortGapsVMU: (state) => (field, order) => {
    return orderArray(state.vmugaps, field, order)
  },
  sortGapsHRD: (state) => (field, order) => {
    return orderArray(state.hrdgaps, field, order)
  },
  variable: (state) => (id) => {
    let i = state.config.findIndex(v => v.id == id)
    return i < 0 ? {} : state.config[i]
  },
  totalSize(state) {
    return state.status.hrd ? state.status.hrd.gap : 0
  },
  totalGap(state) {
    return state.status.hrd ? state.status.hrd.size : 0
  },
  totalRequests(state) {
    return state.status.requests ? state.status.requests.count : 0
  },
  totalHRD(state) {
    return state.status.hrd ? state.status.hrd.count : 0
  },
  totalVMU(state) {
    return state.status.vmu ? state.status.vmu.count : 0
  }
}

const mutations = {
  'update.status'(state, status) {
    state.status = status
  },
  'update.requests'(state, requests) {
    state.requests = requests
  },
  'update.vmu.gaps'(state, gaps) {
    state.vmugaps = gaps
  },
  'update.hrd.gaps'(state, gaps) {
    state.hrdgaps = gaps
  },
  'update.config'(state, config) {
    state.config = config
  }
}

const headers = {
  accept: 'application/json',
}

function fetchData(url, commit, what) {
  return fetch(url, {headers}).then(rs => {
    if (!rs.ok) {
      return Promise.reject(rs.statusText)
    }
    return rs.json()
  }).then(rs => {
    commit(`update.${what}`, rs)
  })
}

function fetchBasic(url) {
  return fetch(url, {headers}).then(rs => {
    return rs.ok ? rs.json() : []
  })
}

const actions = {
  'fetch.status'({commit}) {
    return fetchData(`${process.env.VUE_APP_API}/status/`, commit, "status")
  },
  'fetch.config'({commit}) {
    return fetchData(`${process.env.VUE_APP_API}/config/`, commit, "config")
  },
  'fetch.requests'({commit}, q) {
    let url = `${process.env.VUE_APP_API}/requests/?${$.param(q)}`
    return fetchData(url, commit, "requests")
  },
  'fetch.vmu.gaps'({commit}, q) {
    let url = `${process.env.VUE_APP_API}/archives/vmu/gaps/?${$.param(q)}`
    return fetchData(url, commit, "vmu.gaps")
  },
  'fetch.hrd.gaps'({commit}, q) {
    let url = `${process.env.VUE_APP_API}/archives/hrd/gaps/?${$.param(q)}`
    return fetchData(url, commit, "hrd.gaps")
  },
  'fetch.requests.status'() {
    return fetchBasic(`${process.env.VUE_APP_API}/requests/status/`)
  },
  'fetch.vmu.records'() {
    return fetchBasic(`${process.env.VUE_APP_API}/archives/vmu/records/`)
  },
  'fetch.vmu.sources'() {
    return fetchBasic(`${process.env.VUE_APP_API}/archives/vmu/sources/`)
  },
  'fetch.hrd.channels'() {
    return fetchBasic(`${process.env.VUE_APP_API}/archives/hrd/channels/`)
  },
  'register.request'(_, data) {
    return fetch(`${process.env.VUE_APP_API}/requests/`, {headers, method: 'POST', body: JSON.stringify(data)}).then(rs => {
      if (!rs.ok) {
        return Promise.reject(rs.statusText)
      }
      return Promise.resolve(data)
    })
  },
  'cancel.request'(_, {id, comment}) {
    return fetch(`${process.env.VUE_APP_API}/requests/${id}`, {headers, method: 'POST', body: JSON.stringify({comment})}).then(rs => {
      if (!rs.ok) {
        return Promise.reject(rs.statusText)
      }
      return Promise.resolve("")
    })
  },
  'update.variable'(_, {id, data}) {
    return fetch(`${process.env.VUE_APP_API}/config/${id}`, {headers, method: 'PUT', body: JSON.stringify(data)}).then(rs => {
      if (!rs.ok) {
        return Promise.reject(rs.statusText)
      }
      return Promise.resolve(data)
    })
  },
}

export default createStore({
  state,
  getters,
  mutations,
  actions,
})
