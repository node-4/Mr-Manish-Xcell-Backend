const HubCity = require("../models/hubCities.model");
const createCity = async (req, res) => {
    try {
        const city = await HubCity.create(req.body);
        return res.status(201).json({ status: 1, message: "city added", data: city });
    } catch (err) {
        return res.status(400).json({ status: 0, message: err.message });
    }
};
const getCities = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.city) {
            queryObj.city = new RegExp(req.query.city, "i");
        }
        const city = await HubCity.find(queryObj);
        if (!city || city.length === 0) {
            return res.status(200).json({ status: 0, message: "City not found" });
        }
        return res.status(200).json({ status: 1, data: city });
    } catch (err) {
        return res.status(500).json({ status: 0, message: err.message });
    }
};
const getCityById = async (req, res) => {
    try {
        const city = await HubCity.findById(req.params.id);
        if (!city) {
            return res.status(200).json({ status: 0, message: "City not found" });
        }
        return res.status(200).json({ status: 1, data: city });
    } catch (err) {
        return res.status(404).json({ status: 0, message: err.message });
    }
};
const updateCity = async (req, res) => {
    try {
        const city = await HubCity.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!city) {
            return res.status(200).json({ status: 0, message: "City not found" });
        }
        return res.status(200).json({ status: 1, data: city });
    } catch (err) {
        return res.status(404).json({ status: 0, status: 0, message: err.message });
    }
};
const deleteCity = async (req, res) => {
    try {
        const city = await HubCity.findByIdAndDelete(req.params.id);
        if (!city)
            return res.status(404).json({ status: 0, message: "City not found" });
        return res.status(200).json({ message: "City deleted successfully" });
    } catch (err) {
        return res.status(404).json({ status: 0, message: err.message });
    }
};
module.exports = { createCity, getCities, getCityById, updateCity, deleteCity, };