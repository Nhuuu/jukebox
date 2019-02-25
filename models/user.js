'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Hey, give me a valid email address!',
        }
      }
    },
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 16],
          msg: 'Your new password should be between 8 and 16 characters in length.'
        }
      }
    },
    admin: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: ((pendingUser) => {
        if(pendingUser) {
          var hash = bcrypt.hashSync(pendingUser.password, 12);
          pendingUser.password = hash;
        }
      })
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.belongsToMany(models.party, { through: 'partyUser' })
  };
  user.prototype.validPassword = function(typedPassword){
    // compareSync forces it to wait, compare typed with this user's pw
    return bcrypt.compareSync(typedPassword, this.password);
  };
  return user;
};







