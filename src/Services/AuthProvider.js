import React, { Component, createContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {loading} from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export const AuthContext = createContext();

export class AuthProvider extends Component {
  state = {
    currentUser: null,
    loading: true,
  };

  componentDidMount() {
    const auth = getAuth();

    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      this.setState({ currentUser: user, loading: false });
    });
    console.log(" AuthProvider componentDidMount");
    console.log(this.state.currentUser);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { children } = this.props;
    const { currentUser, loading } = this.state;

    if (loading) {
      return
        <div>
            <h1>Loading...</h1>
            <CircularProgress />
        </div>;
   
    }

    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
}
