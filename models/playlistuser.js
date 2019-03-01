'use strict';
module.exports = (sequelize, DataTypes) => {
  const playlistUser = sequelize.define('playlistUser', {
    playlistId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  playlistUser.associate = function(models) {
    // associations can be defined here
  };
  return playlistUser;
};