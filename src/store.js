import $ from 'jquery'
import _ from 'lodash'
import {createStore} from 'vuex'

const defaultLimit = 50

const autobrm = {
  cmdline: "N/A",
  pid: "N/A",
  state: "N/A",
  vmrss: "N/A",
  vmsize: "N/A",
}

const state = {
  status: {
    autobrm
  },
  requests: [],
  vmugaps: [],
  hrdgaps: [],
  config:  [],
  set: {},
}

const getters = {
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
  },
  autobrm(state) {
    return state.status.autobrm
  },
  objects(state) {
    return state.set.data
  },
  pages(state) {
    if (!state.set) {
      return 0
    }
    let c = (state.set.total / defaultLimit) + 1
    return parseInt(c)
  }
}

function orderArray(arr, field, order) {
  if (!order) {
    order = "desc"
  }
  return field ? _.orderBy(arr, field, order) : arr
}

const mutations = {
  'sort.data'(state, {field, order}) {
    state.set.data = orderArray(state.set.data, field, order)
  },
  'sort.vmu.gaps'(state, {field, order}) {
    state.vmugaps = orderArray(state.vmugaps, field, order)
  },
  'sort.hrd.gaps'(state, {field, order}) {
    state.hrdgaps = orderArray(state.hrdgaps, field, order)
  },
  'update.status'(state, status) {
    state.status = status
  },
  'update.set'(state, set) {
    state.set = Object.assign({}, set)
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

function buildURL(endpoint, q) {
  let url = `${process.env.VUE_APP_API}/${endpoint}/`
  if (q) {
    url = `${url}?${$.param(q)}`
  }
  return url
}

const actions = {
  'fetch.status'({commit}) {
    return fetchData(buildURL("status"), commit, "status")
  },
  'fetch.config'({commit}) {
    return fetchData(buildURL("config"), commit, "config")
  },
  'fetch.requests'({commit}, q) {
    q = Object.assign(q, {limit: defaultLimit})
    return fetchData(buildURL("requests", q), commit, "set")
  },
  'fetch.vmu.gaps'({commit}, q) {
    q = Object.assign(q, {limit: defaultLimit})
    return fetchData(buildURL("archives/vmu/gaps", q), commit, "vmu.gaps")
  },
  'fetch.hrd.gaps'({commit}, q) {
    q = Object.assign(q, {limit: defaultLimit})
    return fetchData(buildURL("archives/hrd/gaps", q), commit, "hrd.gaps")
  },
  'fetch.requests.status'() {
    return fetchBasic(buildURL("requests/status"))
  },
  'fetch.requests.stats'() {
    return fetchBasic(buildURL("stats/requests")).then(list => {
      return Promise.resolve(_.groupBy(list, 'status'))
    })
  },
  'fetch.items.stats'() {
    return fetchBasic(buildURL("stats/items")).then(list => {
      return Promise.resolve(_.groupBy(list, 'label'))
    })
  },
  'fetch.vmu.records'() {
    return fetchBasic(buildURL("archives/vmu/records"))
  },
  'fetch.vmu.sources'() {
    return fetchBasic(buildURL("archives/vmu/sources"))
  },
  'fetch.hrd.channels'() {
    return fetchBasic(buildURL("archives/vmu/sources"))
  },
  'register.request'(_, data) {
    return fetch(buildURL("requests"), {headers, method: 'POST', body: JSON.stringify(data)}).then(rs => {
      if (!rs.ok) {
        return Promise.reject(rs.statusText)
      }
      return Promise.resolve(data)
    })
  },
  'cancel.request'(_, {id, comment}) {
    return fetch(`${buildURL("requests")}${id}`, {headers, method: 'POST', body: JSON.stringify({comment})}).then(rs => {
      if (!rs.ok) {
        return Promise.reject(rs.statusText)
      }
      return Promise.resolve("")
    })
  },
  'update.variable'(_, {id, data}) {
    return fetch(`${buildURL("config")}${id}`, {headers, method: 'PUT', body: JSON.stringify(data)}).then(rs => {
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
