'use strict';
module.exports = (sequelize, DataTypes) => {
  const song = sequelize.define('song', {
    artist: DataTypes.STRING,
    title: DataTypes.STRING,
    partyId: DataTypes.INTEGER
  }, {});
  song.associate = function(models) {
    models.song.belongsTo(models.party)
  };
  return song;
};