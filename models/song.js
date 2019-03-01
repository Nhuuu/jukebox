'use strict';
module.exports = (sequelize, DataTypes) => {
  const song = sequelize.define('song', {
    artist: DataTypes.STRING,
    title: DataTypes.STRING,
    playlistId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    spotifyId: DataTypes.STRING
  }, {});
  song.associate = function(models) {
    models.song.belongsTo(models.playlist)
  };
  return song;
};