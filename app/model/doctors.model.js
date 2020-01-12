module.exports = (sequelize, Sequelize) => {
  const Doctor = sequelize.define('doctors', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING },
    speciality: { type: Sequelize.STRING },
    availableTime: { type: Sequelize.STRING }
  });
  return Doctor;
};
