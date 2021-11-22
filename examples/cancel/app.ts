import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios
  .get('/cancel/get', {
    cancelToken: source.token
  })
  .then(() => {
    console.log('我成功了')
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled', e.message)
    }
  })

setTimeout(() => {
  source.cancel('Operation canceled by the user.')

  setTimeout(() => {
    axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
      if (axios.isCancel(e)) {
        console.log(e.message + 'hey!')
      }
    })
  }, 100)
}, 100)

let cancel: Canceler

axios
  .get('/cancel/get', {
    cancelToken: new CancelToken(c => {
      cancel = c
    })
  })
  .then(() => {
    console.log('successfully~')
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled')
    }
  })

setTimeout(() => {
  console.log('success or cancel ?')
  cancel()
}, 500)
