const device = require("./device.js");

module.exports = (server) => {
  server.get("/api", (req, res) => {
    res
      .status(200)
      .send({
        message:
          "Welcome to the fullstack code challenge api end-point",
      });
  });
  server.use("/api/device", device);
};
