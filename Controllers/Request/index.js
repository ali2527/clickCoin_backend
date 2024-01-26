//Models
const Request = require("../../Models/Request")

//Helpers
const { ApiResponse } = require("../../Helpers/index");

//libraries
const dayjs = require("dayjs");


//create Request
exports.addRequest = async (req, res) => {
  const { subject,link,query } = req.body;
  try {


   const request = new Request({subject,link,query});

    await request.save();


    return res.json(
        ApiResponse(
          { request },       
          "Request Created Successfully",
          true
        )
      );
  } catch (error) {
    return res.json(ApiResponse({}, error.message,false));
  }
};


//get all requests with pagination
exports.getAllRequests = async (req, res) => {
  const { page = 1, limit = 10, status, from, to, keyword } = req.query;
  try {
    let finalAggregate = [];

    if (keyword) {
      finalAggregate.push({
        $match: {
          $or: [
            {
              subject: {
                $regex: ".*" + keyword.toLowerCase() + ".*",
                $options: "i",
              },
            },
            {
              query: {
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
        ? Request.aggregate(finalAggregate).sort({ createdAt: 1 })
        : Request.aggregate([]);

        Request.aggregatePaginate(myAggregate, { page, limit }, (err, requests) => {
      if (err) {
        return res.json(
          ApiResponse(
            {},
            errorHandler(err) ? errorHandler(err) : err.message,
            false
          )
        );
      }
      if (!requests ){
        return res.json(ApiResponse({}, "No requests found", false));
      }

      return res.json(ApiResponse(requests));
    }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};



//get Request by id
exports.getRequestById = async (req, res) => {
  try {
      const request = await Request.findById(req.params.id);
      if (!request) {
      return res.json(ApiResponse({}, "No requests found", false));
      }
      return res.json(ApiResponse(request));
  } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
  }
  }


exports.updateRequest = async (req, res) => {
  try {
    let request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!request) {
      return res.json(ApiResponse({}, "No request found", false));
    }
    return res.json(ApiResponse(request, "Request updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};
