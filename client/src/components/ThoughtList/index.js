import React from 'react';
import { Link } from 'react-router-dom';

// will receive two props
const ThoughtList = ({ thoughts, title }) => {

  // if (!thoughts.length) {
  //   return <h3>No Thoughts Yet</h3>;
  // }

  //  key prop (in div) serves with mapped data in React: helps React internally track which data needs to be re-rendered if something changes.
  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map(thought => (
          <div key={thought._id} className="card mb-3">
           
            {/* establish link to user's profile such that profile/username: */}
            <p className="card-header">
              <Link to={`/profile/${thought.username}`} style={{ fontWeight: 700 }} className="text-light" >{thought.username}</Link>{' '}thought on {thought.createdAt}
            </p>

            <div className="card-body">
              {/* Make entire thoughtText hyperlinkable to href="/thought/_id" so that we can focus on an individual thought content and its reactions later*/}
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                  Reactions: {thought.reactionCount} || Click to{' '}
                  {thought.reactionCount ? 'see' : 'start'} the discussion!
                </p>
              </Link>
            </div>

          </div>
        ))}
    </div>
  );
};

export default ThoughtList;