'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const data = []
    const usedPair = []
    const howManyFollowshipData = 30
    while (data.length < howManyFollowshipData) {
      const followerId = users[Math.floor(Math.random() * (users.length - 1)) + 1].id
      const followingId = users[Math.floor(Math.random() * (users.length - 1)) + 1].id
      if (followerId === followingId) continue
      const exist = usedPair.find(array => array[0] === followerId && array[1] === followingId)
      if (exist) continue
      data.push({
        follower_id: followerId,
        following_id: followingId,
        created_at: new Date(),
        updated_at: new Date()
      })
      usedPair.push([followerId, followingId])
    }
    await queryInterface.bulkInsert('Followships', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
