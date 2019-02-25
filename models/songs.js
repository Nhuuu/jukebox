'use strict';
module.exports = (sequelize, DataTypes) => {
  const songs = sequelize.define('songs', {
    artist: DataTypes.STRING,
    title: DataTypes.STRING,
    partyId: DataTypes.INTEGER
  }, {});
  songs.associate = function(models) {
    // associations can be defined here
  };
  return songs;
};