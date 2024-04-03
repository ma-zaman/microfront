import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'

import SignIn from './components/Signin'
import SignUp from './components/Signup'

const generateClassName = createGenerateClassName({
  productionPrefix: 'au'
})

export default ({ history, onSignIn }) => {
  return <div>
    <StylesProvider generateClassName={generateClassName}>
      <Router history={history}>
        <Switch>
          <Route exact path="/auth/signIn">
            <SignIn onSignIn={onSignIn} />
          </Route>
          <Route exact path="/auth/signUp">
            <SignUp onSignIn={onSignIn} />
          </Route>
        </Switch>
      </Router>
    </StylesProvider>
  </div>
}