import {Duration, DateTime} from 'luxon'

const IsoFormat = "yyyy-LL-dd'T'HH:mm:ss"
const RFC3339 = "yyyy-LL-dd'T'HH:mm:ss'Z'"
const DoyFormat = 'yyyy.ooo.HH.mm.ss'
const MaxDays = 15
const MaxMessage = "You're about to retrieve a lot of data! this operation is time consuming. Do you want to continue?"

const Periods = [
  Duration.fromISO("PT1H"),
  Duration.fromISO("PT3H"),
  Duration.fromISO("PT6H"),
  Duration.fromISO("PT12H"),
  Duration.fromISO("P1D"),
  Duration.fromISO("P3D"),
  Duration.fromISO("P7D"),
  Duration.fromISO("P10D"),
  Duration.fromISO("P15D"),
]

function formatTime(str) {
  let when = DateTime.fromISO(str).toUTC()
  return when.toFormat(DoyFormat)
}

export {MaxDays, MaxMessage, IsoFormat, RFC3339, DoyFormat, Periods, formatTime}
