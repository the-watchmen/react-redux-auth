import assert from 'assert'
import _ from 'lodash'
import debug from 'debug'
import getAuthRedux from './get-auth-redux'
import getAuthAuth0 from './get-auth-auth0'

export AuthContainer from './auth-container'
export IfAuthorizedContainer from './if-authorized-container'

const dbg = debug('lib:auth')

const auth = {}

export function configure(config) {
  dbg('configure: config=%o', config)
  assert(config, 'config required')
  const {postAuthLocation, impl} = config
  const picked = _.pick(config, ['rules', 'notAuthorizedLocation', 'onNotAuthorized'])
  if (!impl.provider === 'auth0') {
    throw new TypeError('unhandled provider')
  }

  Object.assign(auth, {
    ...getAuthRedux({
      postAuthLocation,
      impl: getAuthAuth0(impl.options)
    }),
    ...picked
  })
}

export default auth
