import assert from 'assert'
import React, {Component} from 'react'
import debug from 'debug'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {withRouter} from 'react-router-dom'
import auth from './index'

const dbg = debug('lib:react-redux-auth:authenticated-route')

const container = class extends Component {
  // should never be called, but react complains
  render() {
    return <div />
  }

  componentDidMount() {
    const {history, match, login} = this.props
    dbg('history=%o, match=%o', history, match)
    const {token} = match.params
    assert(token, 'token required')
    login({history, token})
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
