const { AuthenticationError } = require("apollo-server-express");
const { GraphQLError } = require("graphql");
const { User, Book } = require("../models");
const bookSchema = require("../models/Book");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
  },

  Mutation: {
    addUser: async (parent, { username }) => {
      return User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }); // is email what we want? Copied from activity 26

      if (!user) {
        throw new GraphQLError("No profile with meail found", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new GraphQLError("Incorrect password", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async(),

    removeBook: async (parent, { bookId }, context) => {
      // to do add all dependencies
      if (context.user) {
        // return Book
      }
    },
  },
};

// login: Accepts an email and password as parameters; returns an Auth type.

// addUser: Accepts a username, email, and password as parameters; returns an Auth type.

// saveBook: Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type. (Look into creating what's known as an input type to handle all of these parameters!)

// removeBook: Accepts a book's bookId as a parameter; returns a User type.

module.exports = resolvers;
