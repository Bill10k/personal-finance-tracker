import React, { useState } from 'react';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword'; // Make sure this file exists
import LoginForm from './Components/Login';

const App = () => {
  const [screen, setScreen] = useState('login'); // "login" or "forgot"

  return (
    <div
      className="grid w-full h-screen place-items-center bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/background.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',}}
    >
      {screen === 'login' && <LoginForm onForgot={() => setScreen('forgot')} />}
      {screen === 'forgot' && <ForgotPassword onBack={() => setScreen('login')} />}
    </div>
  );
};

export default App;


