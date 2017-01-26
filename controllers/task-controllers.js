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
    .catch( ({ message }) => {
      return next({
        status: 400,
        message: message
      });
    });

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
    .catch( ({ message }) => {
      return next({
        status: 400,
        message: message
      });
    });
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
    .catch(({ message }) => {
      next({
        status: 400,
        message
      });
    })
}

export function remove(req, res, next) {
  let { _id } = req.body;

  Task.findOne({ _id })
    .then( (task) => {

      if(!task) {
        return next({
          status: 400,
          message: 'Task not found'
        });
      }

      return task;
    })
    .then( (task) => {

      task.remove((err) => {
        
        if(err) {
          return next({
            message: err.message
          });
        }

        res.end();
      })

    })
    .catch(({ message }) => {
      next({
        status: 500,
        message
      });
    })
}
