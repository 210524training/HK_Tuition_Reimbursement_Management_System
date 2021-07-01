import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import User from './models/user';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  let [currentUser, setCurrentUser] = useState<User | undefined>()
  return (
    <div className="App">
      <Router>
        <AppRoutes currentUser={currentUser} setCurrentUser={setCurrentUser} />
      </Router>
    </div>
  );
}

export default App;
