const express = require("express")
const { addRequest,getAllRequests,getRequestById,updateRequest} = require("../../Controllers/Request")
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")

router.post("/addRequest",authenticatedRoute,addRequest);
router.get("/getAllRequests",authenticatedRoute,getAllRequests);
router.get("/getRequestById/:id",authenticatedRoute,getRequestById);
router.post("/updateRequest/:id",authenticatedRoute,updateRequest);

module.exports = router