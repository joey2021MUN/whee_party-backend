const { Sequelize } = require("sequelize");

const HOST = "localhost";
const USER = "root";
const PASSWORD = "suoye143140#YY";
const DATABASE = "whee_party";

// sequelize -- ORM  Prevent SQL injection attacks and ensure data security
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

const config = {
  freezeTableName: true,
  timestamps: false,
};

function closeConnection() {
  sequelize.close();
}

module.exports = {
  sequelize,
  config,
  closeConnection,
};
