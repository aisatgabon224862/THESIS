import express from "express";
import Detection from "../models/Detection.js";

const router = express.Router();

// GET ALL LOGS
// DETECTION SUMMARY FOR PIE CHART

router.get("/summary", async (req, res) => {
  try {
    const summary = await Detection.aggregate([
      {
        $group: {
          _id: "$item",
          value: {
            $count: {},
          },
        },
      },

      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// WEEKLY INCIDENTS FOR BAR CHART

router.get("/weekly", async (req, res) => {
  try {
    const weekly = await Detection.aggregate([
      {
        $group: {
          _id: {
            $dayOfWeek: "$createdAt",
          },

          incidents: {
            $count: {},
          },
        },
      },

      {
        $project: {
          _id: 0,

          day: "$_id",

          incidents: 1,
        },
      },
    ]);

    res.json(weekly);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.put("/:id/status", async (req, res) => {
  try {
    const updated = await Detection.findByIdAndUpdate(
      req.params.id,

      {
        status: req.body.status,
      },

      {
        new: true,
      },
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// REPORT SUMMARY

router.get("/report-summary", async (req, res) => {
  try {
    const totalDetections = await Detection.countDocuments();

    const confiscated = await Detection.countDocuments({
      status: "Confiscated",
    });

    const resolved = await Detection.countDocuments({
      status: "Resolved",
    });

    const latest = await Detection.find()
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.json({
      totalDetections,

      confiscated,

      resolved,

      latest,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const data = await Detection.find().sort({
      createdAt: -1,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DASHBOARD CARDS

router.get("/stats", async (req, res) => {
  try {
    const totalIncidents = await Detection.countDocuments();

    const confiscatedItems = await Detection.countDocuments({
      status: "Confiscated",
    });

    const resolvedCases = await Detection.countDocuments({
      status: "Resolved",
    });

    res.json({
      totalIncidents,

      confiscatedItems,

      resolvedCases,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// PIE CHART

router.get("/summary", async (req, res) => {
  try {
    const summary = await Detection.aggregate([
      {
        $group: {
          _id: "$item",

          value: {
            $count: {},
          },
        },
      },

      {
        $project: {
          _id: 0,

          name: "$_id",

          value: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json(error);
  }
});

// WEEKLY GRAPH

router.get("/weekly", async (req, res) => {
  try {
    const weekly = await Detection.aggregate([
      {
        $group: {
          _id: {
            $dayOfWeek: "$createdAt",
          },

          incidents: {
            $count: {},
          },
        },
      },

      {
        $project: {
          _id: 0,

          day: "$_id",

          incidents: 1,
        },
      },
    ]);

    res.json(weekly);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
