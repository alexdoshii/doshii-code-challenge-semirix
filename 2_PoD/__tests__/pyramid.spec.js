const pyramid = require('../pyramid')

test('should return all user data', () => {
  return pyramid.buildUser()
    .then(user => {
      expect(user).toBeDefined()
      expect(user.posts).toBeDefined()
      expect(user.albums).toBeDefined()
      expect(user.todos).toBeDefined()
    })
    .catch(err => {
      throw new Error(err);
    })
})
