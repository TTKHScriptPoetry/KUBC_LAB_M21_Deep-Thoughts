import React from 'react';
import { useQuery } from '@apollo/client'; // useQuery hook that expect a parameter passed in
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';
import Auth from '../utils/auth';
 
const Home = () => {
  // -- Use useQuery hook to make query request
  // loading property: @apollo/client library provides a loading property to indicate that the request isn't done just yet
  // data property: data returned from the server stored in the destructured data property when request is finished
  const { loading, data } = useQuery(QUERY_THOUGHTS); // 2 built-in properties

  // -- Use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  // Optional Chaining
  // -- If data exists, store it in the thoughts constant we just created. 
  // -- If data is undefined, then save an empty array to the thoughts component.
  const thoughts = data?.thoughts || [];
  // console.log("------------------------");
  console.log(thoughts);

  const loggedIn = Auth.loggedIn(); // is the user logged-in?

  // pass down 2 props thoughts and title
  return (
    <main>
      <div className='flex-row justify-space-between'>
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
    
        {/* If the user isn't logged in, it'll span the full width of the row. 
        But if you the user is logged in, it'll only span eight columns */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          
          {loading ? (<div>Loading...</div>) : (<ThoughtList thoughts={thoughts} title="Some Feed for Thought(s) - Title" />)}
        </div>

        {loggedIn && userData ? (
        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={userData.me.username}
            friendCount={userData.me.friendCount}
            friends={userData.me.friends}
          />
        </div> ) : null}

      </div>
    </main>
  );
};

export default Home;
