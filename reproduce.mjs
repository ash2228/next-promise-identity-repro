// promise-identity-repro.mjs
class FakeController {
  constructor() {
    this.aborted = false
  }
  abort() {
    this.aborted = true
  }
}

function submitRecord() {
  const controller = new FakeController()
  const res = Promise.resolve('ok')
  res._controller = controller
  return res
}

// Mirrors Telemetry.record()'s chain exactly
const prom = submitRecord()
  .then((value) => ({ isFulfilled: true, value }))
  .catch((reason) => ({ isFulfilled: false, reason }))
  .then((res) => res)

prom._controller = prom._controller // the no-op line from storage.ts

prom.then((res) => {
  console.log('prom._controller:', prom._controller) // undefined — bug reproduced
})




