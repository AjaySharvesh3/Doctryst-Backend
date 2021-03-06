const db = require('../config/db.config.js');
const config = require('../config/config.js');
const User = db.user;
const Role = db.role;
const Doctor = db.doctor;
const Patient = db.patient;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
	// Save User to Database
	User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
		Role.findAll({
			where: {
				name: {
					[Op.or]: req.body.roles
				}
			}
		}).then(roles => {
			user.setRoles(roles).then(() => {
				res.send({ message: 'Registered successfully!' });
			});
		}).catch(err => {
			res.status(500).send({ reason: err.message });
		});
	}).catch(err => {
		res.status(500).send({ reason: err.message });
	})
};

exports.signin = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({ reason: 'User Not Found.' });
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid Password!' });
		}

		var token = jwt.sign({ id: user.id }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});

		var authorities = [];
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				authorities.push('ROLE_' + roles[i].name.toUpperCase());
			}
			res.status(200).send({
				auth: true,
				accessToken: token,
				username: user.username,
				authorities: authorities
			});
		})
	}).catch(err => {
		res.status(500).send({ reason: err.message });
	});
};

exports.userContent = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> User Contents!',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access User Page',
			'error': err
		});
	})
};

exports.adminBoard = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> Admin Contents',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Admin Board',
			'error': err
		});
	})
}

exports.staffBoard = (req, res) => {
  User.findOne({
    where: { id: req.userId },
    attributes: ['name', 'username', 'email'],
    include: [{
      model: Role,
      attributes: ['id', 'name'],
      through: {
        attributes: ['userId', 'roleId'],
      }
    }]
  }).then(user => {
    res.status(200).send({
      'description': '>>> Staff Contents',
      'user': user
    });
  }).catch(err => {
    res.status(500).send({
      'description': 'Can not access Staff Board',
      'error': err
    });
  })
};

exports.managementBoard = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> Doctor Board',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Doctor Board',
			'error': err
		});
	})
};

exports.postAllDoctors = (req, res) => {
  Doctor.create(req.body)
    .then(doctor => {
      res.json(doctor);
    })
    .catch(err => {
      message: `Some error occurred, ${err}`;
    })
};

exports.getAllDoctors = (req, res) => {
  Doctor.findAll()
    .then((doctor) => {
      res.json(doctor);
    })
    .catch(err => {
      message: `Some error occurred, ${err}`;
    });
};

exports.postAllPatients = (req, res) => {
  Patient.create(req.body)
    .then((patient) => {
      res.json(patient);
    })
    .catch(err => {
      message: `Some error occurred, ${err}`;
    });
};

exports.getAllPatients = (req, res) => {
  Patient.findAll()
    .then((patient) => {
      res.json(patient);
    })
    .catch(err => {
      message: `Some error occurred, ${err}`;
    });
};
