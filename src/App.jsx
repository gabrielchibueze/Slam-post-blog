/* eslint-disable no-unused-vars */
import './App.css';
import MainLayout from './components/outlet/mainLayout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllFeedsPage from './components/feeds/all-feed.jsx/all-feed';
import LoginPage from './components/pages/Accounts/login';
import SignupPage from './components/pages/Accounts/signup';
import RecentFeeds from './components/feeds/recent-feed-page/recent-feed';
import SingleFeedsPage from './components/feeds/single-feed-page/single-feed';
import { useContext, useEffect } from 'react';
import { FeedContext } from './components/feedContextProvider/feedContextProvider';
import ErrorBoundary from './components/error/error';
import PageNotFound from './components/pages/page-not-found/page-not-found';
import User from './components/pages/user-profile/user';
import UserSlams from './components/pages/user-profile/user-slams';
import UserLikedSlams from './components/pages/user-profile/user-trending-slams';
import UserSavedSlams from './components/pages/user-profile/user-favorite-slams';
import UserFavorites from './components/pages/user-profile/user-favorite-slams';
import UserTrending from './components/pages/user-profile/user-trending-slams';


function App() {
  const {
    state,
    setState,
    handleFetchUser,
    catchError
  } = useContext(FeedContext);

  useEffect(() => {
    handleFetchUser()
  }, [state])

  useEffect(() => {
    if (state.token && state.user._id) {
      localStorage.setItem("slamUserToken", state.token);
      localStorage.setItem("slamUserId", state.user._id);
      localStorage.setItem("slamUsername", state.user.username);
      localStorage.setItem("slamUserStatus", state.user.status);
    }
  }, [state.token]);

  const token = localStorage.getItem("slamUserToken")
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.removeItem("slamUserToken");
      localStorage.removeItem("slamUsername");
      localStorage.removeItem("slamUserId");
      localStorage.removeItem("slamUserStatus");
      setState((prevState) => ({
        ...prevState,
        isAuthenticated: false,
        userStatus: "",
        user: {
          ...prevState.user,
          _id: null,
          username: null,
          status: null,
        },
        token: null,
      }));
    }, 1800000);

    return () => clearTimeout(timeout);
  }, [])


  useEffect(() => {
    const localStorageToken = localStorage.getItem("slamUserToken");
    if (localStorageToken) {
      const localStorageUsername = localStorage.getItem("slamUsername");
      const localStorageUserId = localStorage.getItem("slamUserId");
      const localStorageUserStatus = localStorage.getItem("slamUserStatus");
      setState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
        userStatus: localStorageUserStatus === undefined ? "" : localStorageUserStatus,
        user: {
          ...prevState.user,
          _id: localStorageUserId,
          username: localStorageUsername,
          status: localStorageUserStatus
        },
        token: localStorageToken,
      }));
    }
  }, [state.statusInput, state.userStatus, state.token]);

  const confirmSubmitLogin = async (resData) => {
    setState((prevState) => {
      return {
        ...prevState,
        isAuthenticated: true,
        user: resData.user,
        token: resData.token,
        active: true,
      }
    });
  };


  // useEffect(() => {
  //   fetch('https://slampost-8dd6d1d06367.herokuapp.com/slam/csrf-token')
  //     .then(response => response.json())
  //     .then(data => {
  //       setState(prevState => {
  //         return {
  //           ...prevState, csrfToken: data.csrfToken
  //         }
  //       })
  //     }
  //     ).catch(catchError);
  // }, []);

  return (
    <div className="root-app">
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout
                  user={state.user}
                  isAuthenticated={state.isAuthenticated}
                  token={state.token}
                />
              }
            >
              <Route
                index
                element={
                  <AllFeedsPage
                    user={state.user}
                    isAuthenticated={state.isAuthenticated}
                    token={state.token}
                  />
                }
              />
              <Route
                path="/feeds/:id"
                element={
                  <SingleFeedsPage
                    user={state.user}
                    isAuthenticated={state.isAuthenticated}
                    token={state.token}
                  />
                }
              />
              <Route
                path="/recent-feeds"
                element={
                  <RecentFeeds
                    user={state.user}
                    isAuthenticated={state.isAuthenticated}
                    token={state.token}
                  />
                }
              />
              <Route
                path="/login"
                element={
                  <LoginPage
                    authenticated={state.isAuthenticated}
                    confirmSubmitLogin={confirmSubmitLogin}
                  />
                }
              />
              <Route path="/signup" element={<SignupPage />} />
              <Route path='/user/:id' element={<User />}>
                <Route index element={<UserSlams />} />
                <Route path='favorites' element={<UserFavorites />} />
                <Route path='trending' element={<UserTrending />} />
              </Route>
              <Route path='*' element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>

      </ErrorBoundary>
    </div>
  );
}

export default App;
