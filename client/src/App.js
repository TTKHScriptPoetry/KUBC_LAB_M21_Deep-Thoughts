import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, } from '@apollo/client';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({uri: '/graphql',});

// -- Use the setContext() function to retrieve the token from localStorage 
// and set the HTTP request headers of every request to include the token
// -- Because we're not using the first parameter, but we still need to access 
// the second one, we can use an underscore _ to serve as a placeholder for the first parameter.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token_in_deepthotapp');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// -- Create and instruct the Apollo instance to retrieve this token every time we make a GraphQL request.
// by combining the authLink and httpLink objects so that every request can retrieve the token and sets 
// the request headers before making the request to the API
const client = new ApolloClient({
  // link: httpLink,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route   
                path="/" 
                element={<Home />} 
              />
              <Route  
                path="/login" 
                element={<Login />} 
              />
              <Route  
                path="/signup" 
                element={<Signup />} 
              />
              <Route  
                path="/thought/:id" 
                element={<SingleThought />} 
              />
              <Route  
                path="/profile" 
                element={<Profile />} 
              />
              <Route  
                path="/profile/:username" 
                element={<Profile />} 
              />
              <Route 
                path="*" 
                element={<NoMatch />} 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
