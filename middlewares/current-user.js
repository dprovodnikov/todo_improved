import User from '../models/user';

export default function(req, res, next) {
  let { userId } = req.session;

  User.find({ _id: userId }, { password: 0 })
    .then( (user) => {

      if(!user) {
        return next({
          status: 400,
          message: 'User not found'
        });
      }

      req.user = user;

      next();

    })
    .catch(({ message }) => {
      next({
        status: 400,
        message
      });
    })

};