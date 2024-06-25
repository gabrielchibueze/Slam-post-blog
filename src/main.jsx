import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import FeedContextProvider from './components/feedContextProvider/feedContextProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <FeedContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </FeedContextProvider>
)
