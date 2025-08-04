import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './Components/ThemeContext';
import { ProfileProvider } from './Components/ProfileContext';
import { TransactionProvider } from './Components/TransactionContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProfileProvider>
          <TransactionProvider>
            <App />
          </TransactionProvider>
        </ProfileProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
