const axios = require('axios');
const userModel = require('../database/models/user');
const { authenticate, generateToken } = require('../auth/authenticate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
  
};

async function register(req, res) {
	try {
		
		r = await userModel.addUser({username:req.body.username,password:req.body.password})
		if(!r) throw "db error";
		res.status(200).json({"message":"success"});
	}
	catch(e) {
		res.status(200).json({"message":"failure"});
}
}

async function login (req, res) {
  try {
    console.log('here campitn');
    r = await userModel.findUserByName(req.body.username);
    console.log(r);
		//authenticated
		 if (r && bcrypt.compareSync(req.body.password, r.password)) {
       console.log('auth complete');
      const token = generateToken(r);
      console.log('i got a token'); 
			res.status(200).json({
				message: `Welcome ${r.username}!, have a token...`,
				token });
		} 
		else {
			//not authenticated
			throw "invalid credentials";
		}
	}
	catch(e) {
		res.status(200).json({"message": e});
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
