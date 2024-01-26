const mongoose = require("mongoose");
const { createHmac } = require('node:crypto');
const mongoosePaginate = require('mongoose-paginate');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const { token } = require("morgan");
const { v4: uuidv4 } = require('uuid');
const {generateRandom6DigitID} = require("../Helpers")


const userCampaignSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaign",
  },
  addRevenue: {
    type: Number,
    default:0,
  },
  appRevenue: {
    type: Number,
    default:0,
  },
  campaignLink: {
    type: String,
    required: true,
  },
});

const userBankSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
  },
  accountType: {
    type: String, // Checking, Savings, etc.
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  routingNumber: {
    type: String,
    required: true,
  },
});



const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      minlength: 3,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 3,
      required: true,
    },
    email: {
      type: String,
      minlength: 3,
      required: true,
      unique: true,
      dropDups: true,
    },
    tag:{
      type:String,
      required: false,
    },
    phone:{
      type: String,
      required: false,
    },
    bio:{
      type: String,
      required: false,
    },
    info:{
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    image: {
      type: String,
    },
    hashed_password: {
      type: String,
    },
    salt: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    campaigns: [userCampaignSchema],
    bankDetails:{userBankSchema},
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

  userSchema.methods = {
    encryptPassword: function (password) {
      if (!password) return "";

         try {
        
        return crypto
          .createHmac("sha1", this.salt)
          .update(password)
          .digest("hex");
      } catch (err) {
        console.log(err.message);
        return "";
      }
    },
    authenticate: function (plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },
  };

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("user", userSchema);
