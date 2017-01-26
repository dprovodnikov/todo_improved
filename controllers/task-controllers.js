import Task from '../models/task';

export function getCompleted(req, res, next) {

  Task.find({ completed: true })
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

  let query = {
    completed: false,
    date: { $lt: new Date() }
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

  Task.find({ completed: false })
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