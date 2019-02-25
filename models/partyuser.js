'use strict';
module.exports = (sequelize, DataTypes) => {
  const partyUser = sequelize.define('partyUser', {
    partyId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  partyUser.associate = function(models) {
    // associations can be defined here
  };
  return partyUser;
};