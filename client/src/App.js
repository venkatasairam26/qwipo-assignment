import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';
import AddressForm from './pages/AddressForm';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/customer-list" component={CustomerListPage} />
          <Route exact path="/customer-detail/:id" component={CustomerDetailPage} />
          <Route exact path="/customer-form" component={CustomerFormPage} />
          <Route exact path="/customers/:id/address" component={AddressForm} />
          <Redirect from="*" to="/customer-list" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
