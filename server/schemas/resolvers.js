const { AuthenticationError } = require("apollo-server-express");
const { GraphQLError } = require("graphql");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  me: async (parent, args, context) => {
    if (context.user) {
      return User.findById(context.user._id)
        .select("-__v -password")
        .populate("savedBooks");
    }
    throw new GraphQLError("You need to be logged in!", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }); // is email what we want? Copied from activity 26

      if (!user) {
        throw new GraphQLError("No profile with email found", {
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

    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        ).populate("savedBooks");
        return updateUser;
      }
      throw new GraphQLError("You need to be logged in before saving books", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    },

    removeBook: async (parent, args, context) => {
      // to do add all dependencies
      if (context.user) {
        const updateUser = await Usre.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        return updateUser;
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    },
  },
};

module.exports = resolvers;
