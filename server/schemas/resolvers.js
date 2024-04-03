const { User } = require('../../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // Get the logged-in user
        me: async (_, __, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }

            return User.findById(context.user._id).populate('savedBooks');
        },
    },
    Mutation: {
        // Log in a user
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },

        // Create a user
        createUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            if (!user) {
                throw new Error('Something went wrong creating the user');
            }

            const token = signToken(user);

            return { token, user };
        },

        // Save a book
        saveBook: async (_, { bookData }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }

            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $push: { savedBooks: bookData } },
                { new: true, runValidators: true }
            ).populate('savedBooks');

            if (!updatedUser) {
                throw new Error('Could not save book');
            }

            return updatedUser;
        },

        // Delete a book
        deleteBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }

            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            ).populate('savedBooks');

            if (!updatedUser) {
                throw new Error('Could not delete book');
            }

            return updatedUser;
        },
    },
};

module.exports = resolvers;
