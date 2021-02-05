interface Query {
  url: string
  resolve: (arg: any) => void
  reject: (reason: any) => void
}

let queue: Query[] = []
let interval: number = null

export function qfetch(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    queue.push({
      url,
      resolve,
      reject,
    })
  })
}

function doIteration() {
  if (queue.length == 0) {
    return
  }
  const item = queue.splice(0, 1)[0]
  try {
    fetch(item.url).then(item.resolve, item.reject)
  } catch (e) {
    item.reject(e)
  }
}

export function start(delay = 400) {
  stop()
  // @ts-ignore
  interval = setInterval(doIteration, delay)
}

export function stop() {
  if (interval != null) {
    clearInterval(interval)
    interval = null
  }
}
