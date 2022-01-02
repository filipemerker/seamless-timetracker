export const toMilliseconds = object =>
  Object.entries(object).reduce((ms, [key, value]) => {
    const converters = {
      days: value => value * 864e5,
      hours: value => value * 36e5,
      minutes: value => value * 6e4,
      seconds: value => value * 1e3,
      milliseconds: value => value,
      microseconds: value => value / 1e3,
      nanoseconds: value => value / 1e6
    }

    if (typeof value !== 'number') {
      throw new TypeError(
        `Expected a \`number\` for key \`${key}\`, got \`${value}\` (${typeof value})`
      )
    }

    if (!converters[key]) {
      throw new Error('Unsupported time key')
    }

    return ms + converters[key](value)
  }, 0)

export const parseMs = ms => {
  if (typeof ms !== 'number') {
    throw new TypeError('Expected a number')
  }

  const roundTowardsZero = ms > 0 ? Math.floor : Math.ceil

  return {
    days: roundTowardsZero(ms / 86400000),
    hours: roundTowardsZero(ms / 3600000) % 24,
    minutes: roundTowardsZero(ms / 60000) % 60,
    seconds: roundTowardsZero(ms / 1000) % 60,
    milliseconds: roundTowardsZero(ms) % 1000,
    microseconds: roundTowardsZero(ms * 1000) % 1000,
    nanoseconds: roundTowardsZero(ms * 1e6) % 1000
  }
}

export const timeFormatter = milli => {
  const { days, hours, minutes } = parseMs(parseInt(milli, 10))
  let timeString = ''

  if (days) {
    timeString += `${days}d `
  }
  if (hours) {
    timeString += `${hours}h `
  }
  if (minutes) {
    timeString += `${minutes}m `
  }

  return timeString
}

export const timeParser = humanTime => {
  const timeEntry = humanTime.trim().split(' ')
  const timeFrames = ['d', 'h', 'm']
  const timeObject = {}

  timeFrames.map(
    frame =>
      (timeObject[frame] =
        timeEntry.find(t => t.includes(frame)) || `0${frame}`)
  )

  for (let index in timeObject) {
    const digits = timeObject[index].match(/\d+/) || [0]
    timeObject[index] = parseInt(digits[0], 10)
  }

  return toMilliseconds({
    days: timeObject.d,
    hours: timeObject.h,
    minutes: timeObject.m
  })
}

export const id = () =>
  Math.random()
    .toString(36)
    .substr(2, 13)

export const getTimer = (counter, { extraSpace } = {}) => {
  const zeroPad = value => `0${value}`.slice(-2)
  const minutes = zeroPad(parseMs(counter).minutes)
  const seconds = zeroPad(parseMs(counter).seconds)
  const separator = extraSpace ? ' : ' : ':'

  return minutes + separator + seconds
}
