const { Thought, User } = require('../../models');
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../../utils/auth');

// const resolvers = {
//   Query: {
//     helloWorld: () => {
//       return 'Hello world! I am here at the gate.';
//     }
//   }
// };

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');
    
        return userData;
      }
      throw new AuthenticationError('Not logged in - me says');
    },
// ------------------ snapshot method name starts---------------------------------
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('thoughts')
        .populate('friends');
    },
    oneuser: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },


// ------------------ snapshot method name ends ---------------------------------
//------------------- Start my own method names -----------------------------

    // get all users
    getAllUsers: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },

    // get a user by username
    getUserByUserName: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },

    // get all thoughts by username or no username
    getAllThoughtsByUsernameOptionBlank: async (parent, {username}) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 }); // descending order
    },

    getThoughtById: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },

//------------------- End of my own method names -----------------------------
    
  }, // End of Query

  Mutation: {
    // (1)
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user); // new
      return { token, user };
    },

     // (2)
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
     
      if (!user) {
        throw new AuthenticationError('Incorrect credentials - fron login');
      }
    
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials - fron login');
      }
      const token = signToken(user);  // new
      return { token, user };
    }, // end of login

    // ------------------------ end of token related resolvers -------------------------

     // (3) 
     // Only logged-in users should be able to use this mutation, thus check on context.user
    addThought: async (parent, args, context) => {
      if (context.user) {
        const thought = await Thought.create({ ...args, username: context.user.username });
    
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
    
        return thought;
      }
    
      throw new AuthenticationError('You need to be logged in!  - From addThought');
    },
    
    // (4)
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );
    
        return updatedThought;
      }
    
      throw new AuthenticationError('You need to be logged in!  - From addReaction');
    },
    // (5)
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } }, // $addToSet to prevent duplicate entries as a user can't be friends with the same person twice
          { new: true }
        ).populate('friends');
    
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in! - From addFriend');
    }


  } // end of Mutation object
};

module.exports = resolvers;