const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/flightController');
const validate = require("../../middlewares/validateInput");
const authenticateUser = require("../../middlewares/authenticateUser");
const checkAdmin = require("../../middlewares/checkAdmin");
const {updateFlightSchema, createFlightSchema, getFlightsSchema, getFlightDetailsSchema} = require("../../validations/flightValidation");

router.put('/update', authenticateUser, checkAdmin, validate(updateFlightSchema, "body"), flightController.handleUpdate);
router.post('/create', authenticateUser, checkAdmin, validate(createFlightSchema, "body"), flightController.handleCreate);
router.get('/list', validate(getFlightsSchema, "query"), flightController.handleGetFlights);
router.get('/:flightId/passengers', authenticateUser, checkAdmin, validate(getFlightDetailsSchema, "params"), flightController.handleFlightDetails);
router.get('/ping', flightController.handlePing);

module.exports = router;