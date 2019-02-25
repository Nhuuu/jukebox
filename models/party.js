'use strict';
module.exports = (sequelize, DataTypes) => {
  const party = sequelize.define('party', {
    token: DataTypes.STRING
  }, {});
  party.associate = function(models) {
    models.party.belongsToMany(models.user, { through: 'partyUser' })
    models.party.hasMany(models.song)
  };
  return party;
};