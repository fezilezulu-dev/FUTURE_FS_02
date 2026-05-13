const Lead = require("../models/Lead");

// GET
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
const createLead = async (req, res) => {
  try {
    const { name, email, source, status } = req.body;

    const lead = await Lead.create({
      name,
      email,
      source,
      status: status || "new",
    });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateLead = async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (IMPORTANT FIX)
const deleteLead = async (req, res) => {
  try {
    console.log("DELETE HIT:", req.params.id);

    const deleted = await Lead.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
};