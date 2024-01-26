const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      default: "",
    },
    link: {
      type: String,
      required: false,
      default: "",
    },
    query: {
        type: String,
        required: false,
        default: "",
      },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
        type: String,
        enum: ["APPROVED", "PENDING"],
        default: "PENDING",
      },
  },
  { timestamps: true }
);

requestSchema.plugin(mongoosePaginate);
requestSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("request", requestSchema);
