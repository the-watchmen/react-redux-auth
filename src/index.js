import assert from 'assert'
import _ from 'lodash'
import debug from 'debug'
import getAuthRedux from './get-auth-redux'

export AuthContainer from './auth-container'
export IfAuthorizedContainer from './if-authorized-container'

const dbg = debug('lib:auth')

const auth = {}

export function configure(config) {
  dbg('configure: config=%o', config)
  assert(config, 'config required')
  const {postAuthLocation, impl, onFailure, onLogin, onLogout} = config
  const picked = _.pick(config, ['rules', 'notAuthorizedLocation'])

  Object.assign(auth, {
    ...getAuthRedux({
      postAuthLocation,
      impl,
      onLogin,
      onFailure,
      onLogout
    }),
    ...picked
  })
}

export default auth
