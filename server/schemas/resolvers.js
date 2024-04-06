const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        // Get the logged-in user
        me: async (_, __, context) => {
            if (!context.user) {
                throw AuthenticationError('Not logged in');
            }

            return User.findById(context.user._id).populate('savedBooks');
        },
    },
    Mutation: {
        // Log in a user
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },

        // Create a user
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            if (!user) {
                throw Error('Something went wrong creating the user');
            }

            const token = signToken(user);

            return { token, user };
        },

        // Save a book
        saveBook: async (_, { input }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } }
                );
            }
        },

        //  Remove a book from Saved Books list
        removeBook: async (_, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } }
                );
            }
            throw AuthenticationError;
        },
    },
};

module.exports = resolvers;
