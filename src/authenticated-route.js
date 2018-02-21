import React, {Component} from 'react'
import debug from 'debug'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {withRouter} from 'react-router-dom'
import _ from 'lodash'
import auth from '.'

const dbg = debug('lib:react-redux-auth:authenticated-route')

const container = class extends Component {
  // should never be called, but react complains
  render() {
    return <div />
  }

  componentDidMount() {
    const {match} = this.props
    dbg('match=%o', match)
    const {token} = match.params
    if (!token) {
      dbg('unable to obtain token in match=%o', match)
      throw new Error('token required')
    }
    const emitter = _.get(window, 'opener.emitter')
    if (!emitter) {
      dbg('unable to obtain emitter from window.opener=%o', window.opener)
      throw new Error('emitter required')
    }
    dbg('calling emit')
    emitter.emit('login', token)
    dbg('calling window.close')
    window.close()
  }
}

export default withRouter(
  connect(
    state => {
      dbg('connect: state=%o', state)
      return {}
    },
    dispatch => {
      dbg('connect: actions=%o', auth.actions)
      return bindActionCreators(auth.actions, dispatch)
    }
  )(container)
)
