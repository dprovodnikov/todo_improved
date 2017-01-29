import Event from '../models/event';

export function get(req, res, next) {

  let { userId } = req.session;

  Event.find({ userId })
    .then(events => {

      if(!events) {
        return next({
          status: 400,
          message: 'Events not found'
        });
      }

      res.json(events);

    })
    .catch(({message}) => {
      next({
        status: 500,
        message
      });
    })
}

export function create(req, res, next) {

  let { userId } = req.ression;
  let credentials = req.body;

  credentials.userId = userId;

  Event.create(credentials)
    .then(event => {

      if(!event) {
        return next({
          status: 400,
          message: 'Bad credentials'
        });
      }

      res.json(event);
    })
    .catch(({message}) => {
      next({
        status: 500,
        message
      })
    })

}

export function remove(req, res, next) {

  let { userId } = req.session;
  let { _id } = req.body

  Event.remove({ userId, _id })
    .then(affected => {

      res.json({ affected });
    })
    .catch(({message}) => {
      next({
        status: 500,
        message
      });
    })

}

export function update(req, res, next) {}
