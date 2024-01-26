const mongoose = require("mongoose");
const { createHmac } = require('node:crypto');
const mongoosePaginate = require('mongoose-paginate');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;



const campaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    info: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required:true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE",
    },
    image: {
      type: String,
    },
    avatar: {
      type: String,
    },
    Links: [
      {     
          type: String,
          required: true,
      },
    ],
    promotors: [
      {     
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

campaignSchema.plugin(mongoosePaginate);
campaignSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("campaign", campaignSchema);
