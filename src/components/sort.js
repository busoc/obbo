const vmufields = {
  time: 'timestamp',
  start: 'last_timestamp',
  end: 'next_timestamp',
  record: 'record',
  source: 'source',
}
const hrdfields = {
  time: 'timestamp',
  start: 'last_timestamp',
  end: 'next_timestamp',
  channel: 'channel'
}
const repfields = {
  time: 'timestamp',
  start: 'startdate',
  end: 'enddate',
  status: 'status',
  priority: 'priority',
  automatic: 'automatic',
}

export {repfields, vmufields, hrdfields}
