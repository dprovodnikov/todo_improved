import Task from '../models/task';

export function getCompleted(req, res, next) {
  const { userId } = res.session;

  Task.find({ completed: true, userId })
    .then(tasks => {

      if(!tasks) {
        return next({
          status: 400,
          message: 'Tasks not found'
        });
      }

      return res.json({ tasks });
    })
    .catch(next);
}

export function getOverdue(req, res, next) {
  const { userId } = req.session;

  const query = {
    completed: false,
    date: { $lt: new Date() },
    userId,
  };

  Task.find(query)
    .then(tasks => {

      if(!tasks) {
        return next({
          status: 400,
          message: 'Tasks not found'
        });
      }

      return res.json({ tasks });

    })
    .catch(next);

}

export function getCurrent(req, res, next) {
  const { userId } = res.session;

  Task.find({ completed: false, userId })
    .then(tasks => {

      if(!tasks) {
        return next({
          status: 400,
          message: 'Tasks not found'
        });
      }

      return res.json({ tasks });

    })
    .catch(next);
}

export function create(req, res, next) {
  const credentials = req.body;

  credentials.userId = req.session.userId;

  Task.create(credentials)
    .then(task => {

      if(!task) {
        return next({
          status: 500,
          message: 'An error occured while saving the task'
        });
      }

      res.json({ task });
    })
    .catch(next)
}

export function remove(req, res, next) {
  const { _id } = req.body;
  const { userId } = req.session;

  Task.remove({ _id, userId })
    .then(affected => {
      return res.json({ affected });
    })
    .catch(next)
}

export function complete(req, res, next) {
  const { userId } = req.session;
  const { _id } = req.body;

  Task.update({ _id, userId }, { completed: true })
    .then(affected => {
      return res.json({ affected });
    })
    .catch(next)
}





























