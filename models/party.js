'use strict';
module.exports = (sequelize, DataTypes) => {
  const party = sequelize.define('party', {
    token: DataTypes.STRING
  }, {});
  party.associate = function(models) {
    // associations can be defined here
  };
  return party;
};