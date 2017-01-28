import Folder from '../models/folder';

export function getAll(req, res, next) {
  let { userId } = req.session;

  Folder.find({ userId })
    .then(folders => {

      if(!folders) {
        return next({
          status: 400,
          message: 'Folders not found',
        })
      }

      res.json(folders)

    })
    .catch(({message}) => {
      next({
        status: 500,
        message
      })
    })
}

export function create(req, res, next) {

  let credentials = req.body;
  let { userId } = req.session;

  credentials.userId = userId;

  Folder.create(credentials)
    .then( (folder) => {

      if(!folder) {
        return next({
          status: 400,
          message: 'Bad credentials'
        })
      }

      res.json(folder);

    })
    .catch(({ message }) => {
      next({
        status: 500,
        message
      })
    });

}

export function remove(req, res, next) {

  let { userId } = req.session;
  let { _id } = req.body;

  Folder.remove({ userId, _id })
    .then(affected => {

      return res.json({ affected });
    })
    .catch(({message}) => {
      next({
        status: 500,
        message
      })
    })

}

export function update(req, res, next) {
  res.json('update')
}