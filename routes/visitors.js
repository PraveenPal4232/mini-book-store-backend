const router = require("express").Router();
let Visitor = require("../models/visitor.model");

router.route("/").get((req, res) => {
  Visitor.find()
    .then((visitors) => res.json(visitors))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const company = req.body.company;
  const designation = req.body.designation;
  const reason = req.body.reason;
  const meeting = req.body.meeting;
  const vehicle = req.body.vehicle;
  const vehicleNumber = req.body.vehicleNumber;
  const phone = req.body.phone;
  const remark = req.body.remark;
  const timeIn = Date.parse(req.body.timeIn);
  const timeOut = Date.parse(req.body.timeOut);

  const newVisitor = new Visitor({
    name,
    email,
    company,
    designation,
    reason,
    meeting,
    vehicle,
    vehicleNumber,
    phone,
    remark,
    timeIn,
    timeOut
  });

  newVisitor
    .save()
    .then(() => res.json("Visitor Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Visitor.findById(req.params.id)
    .then((visitor) => res.json(visitor))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Visitor.findByIdAndDelete(req.params.id)
    .then(() => res.json("Visitor Deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Visitor.findById(req.params.id)
    .then((visitor) => {
      visitor.username = req.body.username;
      visitor.description = req.body.description;
      visitor.duration = Number(req.body.duration);
      visitor.date = Date.parse(req.body.date);

      visitor
        .save()
        .then(() => res.json("Visitor Updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
