const jwt = require("jwt-then");
const realTimeUpdate = (server) => {
  const io = require("socket.io")(server);

  io.use(async (socket, next) => {
    try {
      const { query } = socket.handshake;
      const { department, username, approverId } = query;

      if (query.username) {
        let sendStatusTo = "2";
        if (department[department.length - 1] === "2") {
          sendStatusTo = "1";
        }
        return io
          .to(sendStatusTo)
          .emit("newUser", { department, username, approverId });
      }
      const { token } = query;
      const payload = await jwt.verify(token, process.env.SECRET);
      socket.userId = payload.id;
      socket.department = payload.department;
      next();
    } catch (err) {
      console.log(err);
    }
  });

  io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);
    socket.join(socket.userId);
    if (socket.department === "Department 1") {
      socket.join("1");
    } else {
      socket.join("2");
    }

    socket.on("disconnect", () => {
      if (socket.department === "Department 1") {
        socket.leave("Department 1");
      } else {
        socket.leave("Department 2");
      }
      console.log("Disconnected: " + socket.userId);
    });

    socket.on("formSubmit", ({ response }) => {
      try {
        io.to(
          response.approvalDepartment[response.approvalDepartment.length - 1]
        ).emit("approvalDepartment", response);
        socket.broadcast.emit("notification", {
          ...response,
          formId: response._id,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("stateUpdate", ({ response }) => {
      try {
        io.to(response.payload.requestorId).emit(
          "stateUpdated",
          response.payload
        );
        socket.broadcast.emit("notification", {
          ...response.payload,
          formId: response.payload._id,
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};

module.exports = realTimeUpdate;
