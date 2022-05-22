import React, { useState } from 'react';

import { useMutation } from '@apollo/client'; //useMutation Hook 
import { ADD_THOUGHT } from '../../utils/mutations';

import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  // The error variable will initially be undefined but can change depending on if the mutation failed.
  // const [addThought, { error }] = useMutation(ADD_THOUGHT);  

  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      // could potentially not exist yet, so wrap in a try/catch
      try {
        //  to update the thoughts array on the QUERY_ME cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }, //very complicated
        });
      } catch (e) {
        console.warn("First thought insertion by user!")
      }

      // read what's currently in the QUERY_THOUGHTS cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] } // addThought represents the new thought, get prepended to the front of the array
      });
    }
  });

  //==================================================
  const handleChange = event => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  //==================================================
  const handleFormSubmit = async event => {
    event.preventDefault();
    try {
      // add thought to database
      await addThought({
        variables: { thoughtText }
      });

      // clear form value
      setText('');
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280  || error ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form className="flex-row justify-center justify-space-between-md align-stretch"  onSubmit={handleFormSubmit}>
      <textarea
        placeholder="Here's a new thought..."
        value={thoughtText}
        className="form-input col-12 col-md-9"
        onChange={handleChange}
      ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;