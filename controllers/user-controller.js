const createToken = require('../function/token')

const userController = {
  login: async (req, res) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'user') return res.status(403).json({ status: 'error', message: '非使用者' })
      const token = await createToken(userData)
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userController
