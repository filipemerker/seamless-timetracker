const workercode = () => {
  setInterval(() => postMessage('tic'), 1000)
}

let code = workercode.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], { type: 'application/javascript' })
const workerScript = URL.createObjectURL(blob)

export default workerScript
