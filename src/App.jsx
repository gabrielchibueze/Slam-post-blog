import './App.css'
// import ErrorBoundary from './components/error/error'
import MainLayout from './components/outlet/mainLayout'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AllFeedsPage from './components/feeds/all-feed.jsx/all-feed'
import LoginPage from './components/pages/Accounts/login'
import SignupPage from './components/pages/Accounts/signup'
import RecentFeeds from './components/pages/recent-feed-page/recent-feed'
import SingleFeedsPage from './components/feeds/single-feed-page/single-feed'
import { useEffect, useState } from 'react'
function App() {
  const [state, setState] = useState({
    isAuthenticated: false,
    token: null,
    sessionId: null,
    user: null
  })

  useEffect(() => {
    const localStorageToken = localStorage.getItem("slamUserToken")
    if (localStorageToken) {
      const localStorageUsername = localStorage.getItem("slamUsername")
      const localStorageUserId = localStorage.getItem("slamUserId")
      setState(prevState => {
        return {
          ...prevState,
          isAuthenticated: true,
          user: {
            ...prevState.user, _id: localStorageUserId, username: localStorageUsername
          },
          token: localStorageToken
        }
      })
    }
  }, []);

  const comfirmSubmitLogin = async (resData) => {
    setState(prevState => {
      return { ...prevState, isAuthenticated: true, user: resData.user, token: resData.token }
    })
  }

  if (state.token && state.user._id) {
    localStorage.setItem("slamUserToken", state.token);
    localStorage.setItem("slamUserId", state.user._id);
    localStorage.setItem("slamUsername", state.user.username);

    setTimeout(() => {
      localStorage.removeItem("slamUserToken");
      localStorage.removeItem("slamUsername");
      localStorage.removeItem("slamUserId")
    }, 36000000)
  }

  return (<div className='root-app'>

    <Router>
      <Routes>
        <Route path="/" element={<MainLayout props={{ user: state.user, isAuthenticated: state.isAuthenticated, token: state.token }} />}>
          <Route index element={<AllFeedsPage props={{ user: state.user, isAuthenticated: state.isAuthenticated, token: state.token }} />}></Route>
          <Route path='/feeds/:id' element={<SingleFeedsPage props={{ user: state.user, isAuthenticated: state.isAuthenticated, token: state.token }} />} />
          <Route path='/recent-feeds' element={<RecentFeeds props={{ user: state.user, isAuthenticated: state.isAuthenticated, token: state.token }} />} />
          <Route path='/login' element={<LoginPage props={{ authenticated: state.isAuthenticated, comfirmSubmitLogin: comfirmSubmitLogin }} />} />
          <Route path='/signup' element={<SignupPage />} />
        </Route>
      </Routes>
    </Router>
  </div>

  )
}

export default App
