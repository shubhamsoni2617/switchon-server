const Form = require("../models/form");
const Notification = require("../models/notification");

exports.postform = async (req, res) => {
  const { message, department, approverId, approverName } = req.body;

  if (department === req.payload.department)
    throw "You cannot assign to same department";

  const payload = {
    requestor: req.payload.username,
    requestorId: req.payload.id,
    approvalDepartment: department,
    approverId,
    approverName,
    state: "pending",
    message,
  };
  const form = new Form(payload);

  const formData = await form.save();

  const notification = new Notification({ ...payload, formId: formData.id });

  await notification.save();

  res.json({
    message: "Form Submitted successfully",
    formData,
  });
};

exports.updateForm = async (req, res) => {
  const { payload } = req.body;
  if (!["approved", "rejected"].includes(payload.state))
    throw "Not a valid state";
  const formData = await Form.findByIdAndUpdate(payload._id, {
    state: payload.state,
  });

  const notification = new Notification({ ...payload, formId: formData.id });

  await notification.save();

  res.json({
    message: "Your response has been saved successfully",
  });
};
