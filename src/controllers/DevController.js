const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

// index, show, store, update, destroy

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });
    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );
      const { name = login, avatar_url, bio } = apiResponse.data;
      const techsArray = parseStringAsArray(techs);
      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        name,
        github_username,
        bio,
        avatar_url,
        techs: techsArray,
        location
      });
      
// filtrar as conexões q estão há no maximo 10km de distancia
    // e que o novo dev tenha pelo menos uma das tecnologias filtradas
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );
      sendMessage(sendSocketMessageTo, "new-dev", dev);
    }

    

    return res.json(dev)
  },

  async update(req, res) {
    const { github_username, name, bio, techs, latitude, longitude } = req.body;
    const dev = await Dev.findOneAndUpdate(
      { github_username },
      {
        name,
        techs,
        bio,
        latitude,
        longitude
      }
    );

    res.json(dev);
  },

  async destroy(req, res) {
    const { github_username } = req.body;
    await Dev.findOneAndDelete({ github_username });
    const devs = await Dev.find();
    res.json(devs);
  }
};