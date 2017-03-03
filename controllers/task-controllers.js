import Task from '../models/task';
import Folder from '../models/folder';

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
  const { text, priority, date, folder } = req.body;
  const { userId } = req.session;

  if (!folder || !folder.id) {
    return next({
      status: 400,
      message: 'Invalid folder'
    })
  }

  Folder.findOne({ _id: folder.id, userId })
    .then(folder => {
      if (!folder || !folder._id) {
        throw {
          status: 400,
          message: 'Folder not found'
        }
      }

      const { _id:folderId } = folder;

      return Task.create({ text, priority, date, folderId, userId });
    })
    .then(task => {

      if(!task) {
        return next({
          status: 500,
          message: 'An error occured while saving the task'
        });
      }

      res.json({ task });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next({ status: 400, message: 'Invalid identificator' });
      } else {
        next(err);
      }
    })
}

export function remove(req, res, next) {
  const { _id } = req.body;
  const { userId } = req.session;

  if (!_id) {
    return next({
      status: 400,
      message: 'Invalid identificator'
    })
  }

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





























