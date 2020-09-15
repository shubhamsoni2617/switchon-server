const { model, Schema } = require("mongoose");
const departments = require("../constants");

const notificationSchema = new Schema({
  requestor: {
    type: String,
    trim: true,
    required: "Requestor name is required!",
  },

  formId: {
    type: Schema.Types.ObjectId,
    required: "Requestor Id is required!",
    ref: "Form",
  },

  approverName: {
    type: String,
    trim: true,
    required: "Approver name is required!",
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

const notification = model("Notification", notificationSchema);

module.exports = notification;
