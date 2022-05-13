const { Tweet } = require('../models')
const tweetServices = require('../services/tweets')

const tweetController = {
  getAll: async (req, res) => {
    try {
      const tweets = await tweetServices.getAll()
      res.json({
        status: 'success',
        data: {
          tweets
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  create: async (req, res, next) => {
    try {
      const userId = req.user.id || 1
      await Tweet.create({
        userId,
        description: req.body.description
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
