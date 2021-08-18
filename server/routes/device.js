const express = require("express");
const { check, validationResult } = require("express-validator");
const DeviceModel = require("../model/device");
const router = express.Router();


// @access Public
// @route api/device
// @desc returns all devices
router.get("/", async (req, res) => {
  try {
    const devices = await DeviceModel.find({});
    res.status(200).json({ devices });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    check("device").not().isEmpty().withMessage("device is required"),
    check("os").not().isEmpty().withMessage("os is required"),
    check("manufacturer")
      .not()
      .isEmpty()
      .withMessage("manufacturer is required"),
    check("lastCheckedOutBy")
      .not()
      .isEmpty()
      .withMessage("lastCheckedOutBy is required"),
    check("isCheckedOut")
      .not()
      .isEmpty()
      .withMessage("isCheckedOut is required"),
  ],
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      createDevice(req, res);
    }
  }
);

// @access Public
// @route
// @desc Update a device details by id
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  await DeviceModel.findByIdAndUpdate(id, req.body, function (error, docs) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.send("Device successfully updated!");
    }
  });
});

// @access Public
// @route api/device
// @desc delete a device by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await DeviceModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Device has been deleted successfully" });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ message: error.message });
  }
});

const createDevice = async(req,res) => {
  var deviceModel = new DeviceModel();
  deviceModel.device = req.body.device;
  deviceModel.os = req.body.os;
  deviceModel.manufacturer = req.body.manufacturer;
  deviceModel.lastCheckedOutDate = new Date();
  deviceModel.lastCheckedOutBy = req.body.lastCheckedOutBy;
  deviceModel.isCheckedOut = req.body.isCheckedOut;
  deviceModel.save(function (err) {
    console.log(err);
    if (err) res.send(err);
    res.send("Device successfully added!");
  });
}
module.exports = router;
