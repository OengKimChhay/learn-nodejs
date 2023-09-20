const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const { v4: uuidv4 } = require("uuid");

const UserModelSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email field is required."],
    },
    password: {
      type: String,
      required: [true, "Password Field is required."],
    },
  },
  {
    timestamps: true,
  },
  {
    collection: "userCollection",
  }
);

UserModelSchema.plugin(mongooseDelete, { indexFields: "all" });

module.exports = mongoose.model("UserModel", UserModelSchema);
