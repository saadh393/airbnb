'use strict';

const {
  Model, Validator
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
      )
      Booking.belongsTo(
        models.User,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
      )
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, 
    // In the init options object:
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'Bookings'  // Add this line
    
  });
  return Booking;
};
