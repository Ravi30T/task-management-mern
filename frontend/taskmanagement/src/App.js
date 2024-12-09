import {Switch, Route} from 'react-router-dom'
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const App = () =>  {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Register} />
      <ProtectedRoute exact path="/" component={Home} />
    </Switch>
  )
}

export default App;
