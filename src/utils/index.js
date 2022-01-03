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

export const getTimer = (counter, { extraSpace } = {}) => {
  const zeroPad = value => `0${value}`.slice(-2)
  const minutes = zeroPad(parseMs(counter).minutes)
  const seconds = zeroPad(parseMs(counter).seconds)
  const separator = extraSpace ? ' : ' : ':'

  return minutes + separator + seconds
}

export const getToday = () => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)

  return date.getTime()
}

export const removeProdConsole = () => {
  function noop() {}

  if (process.env.NODE_ENV !== 'development') {
    console.log = noop
    console.warn = noop
    console.error = noop
  }
}

export const id = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    // eslint-disable-next-line no-mixed-operators
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}
