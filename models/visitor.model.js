const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    designation: { type: String, required: true },
    reason: { type: String, required: true },
    meeting: { type: String, required: true },
    vehicle: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    phone: { type: String, required: true },
    remark: { type: String, required: true },
    timeIn: { type: Date, required: true },
    timeOut: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;
