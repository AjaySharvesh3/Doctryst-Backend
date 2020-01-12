module.exports = (sequelize, Sequelize) => {
  const Patients = sequelize.define('patients', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    gender: { type: Sequelize.BOOLEAN },
    dob: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING }
  });
  return Patients;
};
