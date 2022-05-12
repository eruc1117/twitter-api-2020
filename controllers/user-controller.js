const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  login: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '10d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不符，請重新輸入')
    try {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) throw new Error('此Email已被註冊！')
          return bcrypt.hash(req.body.password, 10)
        })
        .then(hash => User.create({
          name: req.body.name,
          account: req.body.account,
          email: req.body.email,
          password: hash
        }))
        .then(user => {
          res.json({ status: 'success', user })
        })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    try {
      const id = req.params.id
      User.findByPk(id, {
        include: [
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
        .then(user => {
          if (!user) throw new Error('User Error!')
          user = user.toJSON()
          res.json({
            status: 'sucess',
            ...user,
            followingsCount: user.Followings.length,
            followersCount: user.Followers.length
          })
        })
    } catch (err) {
      next(err)
    }
  },
  getUserTweet: (req, res, next) => {
    try {
      const userId = req.params.id
      Tweet.findAll({
        where: { userId },
        include: User,
        nest: true,
        raw: true
      })
        .then(tweet => {
          res.json(tweet)
        })
    } catch (err) {
      next(err)
    }
  },
  userRepliedTweets: (req, res, next) => {
    try {
      const userId = req.params.id
      Reply.findAll({
        where: { userId },
        include: [Tweet, User],
        raw: true,
        nest: true
      })
        .then(reply => {
          const repeatDataId = []
          const newData = []
          // eslint-disable-next-line array-callback-return
          reply.map(reply => {
            if (!repeatDataId.includes(reply.tweetId)) {
              repeatDataId.push(reply.tweetId)
              newData.push(reply)
            } else {
              return false
            }
          })
          res.json(newData)
        })
    } catch (err) {
      next(err)
    }
  },
  userLikes: (req, res, next) => {
    try {
      const userId = req.params.id
      Like.findAll({
        where: { userId },
        include: [User, Tweet],
        raw: true,
        nest: true
      })
        .then(tweet => {
          const repeatDataId = []
          const newData = []
          // eslint-disable-next-line array-callback-return
          tweet.map(tweet => {
            if (!repeatDataId.includes(tweet.tweetId)) {
              repeatDataId.push(tweet.tweetId)
              newData.push(tweet)
            }
          })
          res.json(newData)
        })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
