import assert from 'assert'
import _ from 'lodash'
import debug from 'debug'
import getAuthRedux from './get-auth-redux'

export {default as AuthContainer} from './auth-container'
export {default as IfAuthorizedContainer} from './if-authorized-container'
export {default as AuthenticatedRoute} from './authenticated-route'

const dbg = debug('lib:auth')

const auth = {}

export function configure(config) {
  dbg('configure: config=%o', config)
  assert(config, 'config required')
  const {postAuthLocation, impl, onFailure, onLogin, onLogout, parseScopeHook} = config
  const picked = _.pick(config, ['rules', 'notAuthorizedLocation'])

  Object.assign(auth, {
    ...getAuthRedux({
      postAuthLocation,
      impl,
      onLogin,
      onFailure,
      onLogout,
      parseScopeHook
    }),
    ...picked
  })
}

export default auth
