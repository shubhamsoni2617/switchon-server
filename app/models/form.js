const { model, Schema } = require("mongoose");
const departments = require("../constants");

const formSchema = new Schema({
  requestor: {
    type: String,
    trim: true,
    required: "Requestor name is required!",
  },
  requestorId: {
    type: Schema.Types.ObjectId,
    required: "Requestor Id is required!",
    ref: "User",
  },
  approverId: {
    type: Schema.Types.ObjectId,
    required: "Approver Id is required!",
    ref: "User",
  },
  approverName: {
    type: String,
    trim: true,
    required: "Approver name is required!",
  },
  approvalDepartment: {
    type: String,
    required: "Approval Department is required!",
    enum: departments,
  },
  state: {
    type: String,
    required: "State of the form request is required!",
    enum: ["pending", "rejected", "approved"],
  },
  message: {
    type: String,
    trim: "true",
    required: "Message is required!",
  },
});

const form = model("Form", formSchema);

module.exports = form;
