'use strict';
module.exports = (sequelize, DataTypes) => {
  const playlist = sequelize.define('playlist', {
    token: DataTypes.STRING,
    partyName: DataTypes.TEXT
  }, {});
  playlist.associate = function(models) {
    models.playlist.belongsToMany(models.user, { through: 'playlistUser' })
    models.playlist.hasMany(models.song)
  };
  return playlist;
};