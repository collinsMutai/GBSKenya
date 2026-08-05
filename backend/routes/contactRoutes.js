const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");

const router = express.Router();

const { sendContact } = require("../controllers/contactController");

router.post(
  "/",
  [
    body("name").trim().escape().notEmpty(),

    body("email").isEmail().normalizeEmail(),

    body("type").isIn(["General inquiry", "Volunteer", "Partnership", "Media"]),

    body("message").trim().escape().isLength({
      min: 10,
      max: 3000,
    }),
  ],

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    next();
  },

  sendContact,
);

module.exports = router;
