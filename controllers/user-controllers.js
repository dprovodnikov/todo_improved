import User from '../models/user';

export function signIn(req, res, next) {
  let { username, password } = req.body;


  User.findOne({ username: username })
    .then( (user) => {

      if(!user) {
        return next({
          status: 400,
          message: 'User not found'
        });
      }

      if(user.checkPassword(password)) {
        req.session.userId = user._id;
        res.json(user);
      } else {
        next({
          status: 400,
          message: 'Bad credentials'
        });
      }

    })
    .catch( (err) => next(err));
}

export function signUp(req, res, next) {
  let credentials = req.body;

  User.create(credentials)
    .then( (user) => {
      return res.json(user);
    })
    .catch(({ message }) => {
      next({
        status: 400,
        message: message,
      })
    });
}