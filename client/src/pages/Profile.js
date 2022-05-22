import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

import { useQuery,  } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';

import { useMutation } from '@apollo/client'; //useMutation Hook 
import { ADD_FRIEND } from '../utils/mutations';

// const Profile = () => { // works also
const Profile = (props) => {
  // -- This hook prepares a JavaScript function that wraps around the mutation code ADD_FRIEND 
  // and returns this Javascipt function addFriend aka addUser mutation function
  const [addFriend] = useMutation(ADD_FRIEND);  // no {error} ?
  const { username: userParam } = useParams();   // console.log(userParam); // test only
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  // const user = data?.user || {}; // -- previously
  const user = data?.me || data?.user || {};

  //  -- Navigate to personal profile page if username is the logged-in user's username
  // if logged-in and if the username stored in the JSON Web Token is the same as the userParam value.
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // What happens if you navigate to /profile and you aren't logged in? 
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  // go to other users' profile and hit Add Friend, the user data will be the friend's data you wanna add 
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { friendId: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* if userParam doesn't exist, we'll get a message saying "Viewing your profile." // make sense only if line 25 Navigate takes effect */}
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
       
        {userParam && (
        <button className="btn ml-auto" onClick={handleClick}>
          Add Friend
        </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>

      </div>

      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
