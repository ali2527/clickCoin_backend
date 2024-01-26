const express = require("express")
const { addCampaign,getAllCampaigns,getCampaignById,toggleStatus,updateCampaign} = require("../../Controllers/Campaign")
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {uploadMultiple} = require("../../Middlewares/upload")

router.post("/addCampaign",authenticatedRoute,uploadMultiple,addCampaign);
router.get("/getAllCampaigns",authenticatedRoute,getAllCampaigns);
router.get("/getCampaignById/:id",authenticatedRoute,getCampaignById);
router.get("/toggleStatus/:id",authenticatedRoute,toggleStatus);
router.post("/updateCampaign/:id",authenticatedRoute,uploadMultiple,updateCampaign);

module.exports = router