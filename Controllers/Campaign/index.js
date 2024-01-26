//Models
const Campaign = require("../../Models/Campaign")

//Helpers
const { ApiResponse } = require("../../Helpers/index");

//libraries
const dayjs = require("dayjs");


//create Campaign
exports.addCampaign = async (req, res) => {
  const { title,description,info,price } = req.body;
  try {

    let existingCampaign = await Campaign.findOne({title})

    if(existingCampaign){
        return res
        .json(ApiResponse({},  "Campaign with this title Already Exists",false));
    }


   const campaign = new Campaign({
    title,description,info,price,
    image:req.files.image.length > 0 ? req.files.image[0].filename : "",
    avatar:req.files.video.length > 0 ? req.files.video[0].filename : ""
    });

    await campaign.save();


    return res.json(
        ApiResponse(
          { campaign },       
          "Campaign Created Successfully",
          true
        )
      );
  } catch (error) {
    return res.json(ApiResponse({}, error.message,false));
  }
};


//get all campaigns with pagination
exports.getAllCampaigns = async (req, res) => {
  const { page = 1, limit = 10, status, from, to, keyword } = req.query;
  try {
    let finalAggregate = [];

    if (keyword) {
      finalAggregate.push({
        $match: {
          $or: [
            {
              title: {
                $regex: ".*" + keyword.toLowerCase() + ".*",
                $options: "i",
              },
            },
            {
              description: {
                $regex: ".*" + keyword.toLowerCase() + ".*",
                $options: "i",
              },
            },
            {
              info: {
                $regex: ".*" + keyword.toLowerCase() + ".*",
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (status) {
      finalAggregate.push({
        $match: {
          status: req.query.status,
        },
      });
    }

    if (from) {
      finalAggregate.push({
        $match: {
          createdAt: {
            $gte: moment(from).startOf("day").toDate(),
            $lte: moment(new Date()).endOf("day").toDate(),
          },
        },
      });
    }

    if (to) {
      finalAggregate.push({
        $match: {
          createdAt: {
            $lte: moment(to).endOf("day").toDate(),
          },
        },
      });
    }


    const myAggregate =

      finalAggregate.length > 0
        ? Campaign.aggregate(finalAggregate).sort({ createdAt: 1 })
        : Campaign.aggregate([]);

        Campaign.aggregatePaginate(myAggregate, { page, limit }, (err, campaigns) => {
      if (err) {
        return res.json(
          ApiResponse(
            {},
            errorHandler(err) ? errorHandler(err) : err.message,
            false
          )
        );
      }
      if (!campaigns ){
        return res.json(ApiResponse({}, "No campaigns found", false));
      }

      return res.json(ApiResponse(campaigns));
    }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};



//get Campaign by id
exports.getCampaignById = async (req, res) => {
  try {
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) {
      return res.json(ApiResponse({}, "No campaigns found", false));
      }
      return res.json(ApiResponse(campaign));
  } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
  }
  }

  //toggleStatus
exports.toggleStatus = async (req, res) => {
  try {
    
    let campaign = await Campaign.findById(req.params.id);



      campaign.status = campaign.status == "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await campaign.save();


      const title ="Campaign Status Changed"
      const content = `A campaign has been ${campaign.status !== "ACTIVE" ? "deactivated" : "activated"}. Name : ${campaign.title}`
      sendNotificationToAdmin(title,content)   

      

      return res.json(ApiResponse(campaign, "Campaign Status Changed"));

  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};


exports.updateCampaign = async (req, res) => {
  try {
    let currentCampaign = await Campaign.findById(req.params.id);

      if (req.files.image) {
        
        if (currentCampaign.image) {
          const filePath = `./Uploads/${currentCampaign.image}`;
          
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File '${filePath}' deleted.`);
          } else {
            console.log(`File '${filePath}' does not exist.`);
          }
        }
      }

      if (req.files.video) {
        
        
        if (currentCampaign.avatar) {
          const filePath2 = `./Uploads/${currentCampaign.avatar}`;
          
          if (fs.existsSync(filePath2)) {
            fs.unlinkSync(filePath2);
            console.log(`File '${filePath2}' deleted.`);
          } else {
            console.log(`File '${filePath2}' does not exist.`);
          }
        }
      }
      let data = {...req.body,image:req.files.image.length > 0 ? req.files.image[0].filename : currentCampaign.image,avatar:req.files.video.length > 0 ? req.files.video[0].filename : currentCampaign.avatar}


    let campaign = await Campaign.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!campaign) {
      return res.json(ApiResponse({}, "No campaign found", false));
    }
    return res.json(ApiResponse(campaign, "Campaign updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};
