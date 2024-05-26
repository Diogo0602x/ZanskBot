import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
