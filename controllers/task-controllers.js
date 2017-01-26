import Task from '../models/task';

export function getCompleted(req, res, next) {
  let { _id } = req.user;

  Task.find({ completed: true, userId: _id })
    .then( (tasks) => {

      if(!tasks) {
        return next({
          status: 400,
          message: 'Tasks not found'
        });
      }

      return res.json(tasks);

    })
    .catch( ({ message }) => {
      return next({
        status: 400,
        message: message
      });
    });

}

export function getOverdue(req, res, next) {
  let { _id } = req.user;

  let query = {
    completed: false,
    date: { $lt: new Date() },
    userId: _id;
  };

  Task.find(query)
    .then( (tasks) => {

      if(!tasks) {
        return next({
          status: 400,
          message: 'Tasks not found'
        });
      }

      return res.json(tasks);

    })
    .catch( ({ message }) => {
      return next({
        status: 400,
        message: message
      });
    });

}

export function getCurrent(req, res, next) {
  let { _id } = req.user;

  Task.find({ completed: false, userId: _id })
    .then( (tasks) => {

      if(!tasks) {
        return next({
          status: 400,
          message: 'Tasks not found'
        });
      }

      return res.json(tasks);

    })
    .catch( ({ message }) => {
      return next({
        status: 400,
        message: message
      });
    });

}