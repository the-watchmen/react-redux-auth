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
  const {postAuthLocation, impl, onFailure} = config
  const picked = _.pick(config, ['rules', 'notAuthorizedLocation', 'onFailure'])

  Object.assign(auth, {
    ...getAuthRedux({
      postAuthLocation,
      impl,
      onFailure
    }),
    ...picked
  })
}

export default auth
