const express = require("express");
const router = express.Router();

const {
  subscribe,
  confirmUnsubscribe,
  unsubscribe,
} = require("../controllers/newsletterController");


// Subscribe to newsletter
router.post(
  "/subscribe",
  subscribe
);


// Show unsubscribe confirmation page
router.get(
  "/unsubscribe/:token",
  confirmUnsubscribe
);


// Confirm and remove subscriber
router.post(
  "/unsubscribe/:token",
  unsubscribe
);


module.exports = router;