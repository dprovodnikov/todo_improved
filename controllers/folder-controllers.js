import Folder from '../models/folder';

export function getAll(req, res, next) {
  const { userId } = req.session;

  Folder.find({ userId })
    .then(folders => {

      if(!folders) {
        return next({
          status: 400,
          message: 'Folders not found',
        })
      }

      res.json({ folders })

    })
    .catch(({message}) => {
      next({
        status: 500,
        message
      })
    })
}

export function create(req, res, next) {
  const credentials = req.body;

  credentials.userId = req.session.userId;

  Folder.create(credentials)
    .then(folder => {

      if(!folder) {
        return next({
          status: 400,
          message: 'Bad credentials'
        })
      }

      res.json({ folder });
    })
    .catch(next)
}

export function remove(req, res, next) {
  const { userId } = req.session;
  const { _id } = req.body;

  Folder.remove({ userId, _id })
    .then(affected => {
      return res.json({ affected });
    })
    .catch(next);
}

export function update(req, res, next) {
  const { userId } = req.session;
  const credentials = req.body;

  Folder.update(credentials)
    .then(folder => {
      return res.json({ folder })
    })
    .catch(next);
}