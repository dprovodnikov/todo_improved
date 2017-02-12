import Task from '../models/task';

export function getCompleted(req, res, next) {

  Task.find({ completed: true, userId: req.session.userId })
    .then( (tasks) => {

      if(!tasks) {
        return next({
          status: 400,
          message: 'Tasks not found'
        });
      }

      return res.json(tasks);

    })
    .catch(next);
}

export function getOverdue(req, res, next) {

  let query = {
    completed: false,
    date: { $lt: new Date() },
    userId: req.session.userId,
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
    .catch(next);

}

export function getCurrent(req, res, next) {

  Task.find({ completed: false, userId: req.session.userId })
    .then( (tasks) => {

      if(!tasks) {
        return next({
          status: 400,
          message: 'Tasks not found'
        });
      }

      return res.json(tasks);

    })
    .catch(next);
}

export function create(req, res, next) {
  let taskData = req.body;

  taskData.userId = req.session.userId;

  Task.create(taskData)
    .then( (task) => {

      if(!task) {
        return next({
          status: 500,
          message: 'An error occured while saving the task'
        });
      }

      res.json(task);

    })
    .catch(next)
}

export function remove(req, res, next) {
  let { _id } = req.body;
  let { userId } = req.session;

  Task.remove({ _id, userId })
    .then( (affected) => {

      return res.json({ affected });
    })
    .catch(next)
}

export function complete(req, res, next) {
  let { userId } = req.session;
  let { _id } = req.body;

  console.log(req.user);

  Task.update({ _id, userId }, { completed: true })
    .then( (affected) => {

      return res.json({ affected });
    })
    .catch(next)
}





























