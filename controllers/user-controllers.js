import User from '../models/user';
import bcrypt from 'bcrypt-as-promised';

export function signIn(req, res, next) {
  let { username, password } = req.body;

  let user;

  User.findOne({ username })
    .then(_user => {

      if(!_user) {
        next({
          status: 400,
          message: 'User not found'
        });
      } else {
        user = _user;
        return _user.checkPassword(password)
      }
    })
    .then(() => {
      if (user) {
        req.session.userId = user._id;
        res.json({ user });
      }
    })
    .catch(err => {
      if (err instanceof bcrypt.MISMATCH_ERROR) {
        next({
          status: 400,
          message: 'Invalid password'
        });
      } else {
        next(err);
      }
    });
}

export function signUp(req, res, next) {
  let credentials = req.body;

  User.create(credentials)
    .then(user => {
      return res.json(user);
    })
    .catch(({ message }) => {
      next({
        status: 400,
        message
      })
    });
}