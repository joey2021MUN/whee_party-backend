const mysql = require("mysql2");
const { Sequelize, DataTypes } = require("sequelize");

const host = "localhost";
const user = "root";
const password = "suoye143140#YY";
const database = "whee_party";

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "mysql",
});

/*
反面教材：
const sequelize = new Sequelize(
    `mysql://${user}:${password}@${host}:3306/${database}`);
*/

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

const CONFIG = {
  freezeTableName: true,
  timestamps: false,
};

// ORM

const Note = sequelize.define(
  "note",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    party_theme: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pizzas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drinks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tablecloth_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  CONFIG
);

const Order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    order_time_slot: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  CONFIG
);

const PackageInfo = sequelize.define(
  "package_info",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  CONFIG
);

const PartySchedule = sequelize.define(
  "party_schedules",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    party_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time_slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  CONFIG
);

const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  CONFIG
);

const TimeSlot = sequelize.define(
  "time_slot",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  CONFIG
);

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  CONFIG
);

function closeConnection() {
  sequelize.close();
}

module.exports = {
  PackageInfo,
  Note,
  Order,
  Payment,
  PartySchedule,
  TimeSlot,
  User,
  closeConnection,
};
