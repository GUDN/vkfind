interface Query {
  url: string
  resolve: (arg: any) => void
  reject: (reason: any) => void
}

let current: Query = null
let queue: Query[] = []
let interval: number = null
let currentElem: HTMLScriptElement = null
const head = document.getElementsByTagName('head')[0]

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
  if (queue.length == 0 || current != null) {
    return
  }
  current = queue.splice(0, 1)[0]
  currentElem = document.createElement('script')
  currentElem.src = current.url + '&callback=window.callbackFunc'
  head.appendChild(currentElem)
}

// @ts-ignore
window.callbackFunc = (resp: any) => {
  if (current == null) {
    return
  }
  current.resolve(resp)
  current = null
  head.removeChild(currentElem)
  currentElem = null
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
