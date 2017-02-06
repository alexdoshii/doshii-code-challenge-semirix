const athletes = require('../athletes')

test('should return the correct number of gold medals', () => {
  return athletes.parseFile()
    .then(result => expect(result).toBe(655))
    .catch(err => {
      throw new Error(err);
    })
})

test('should use memory efficiently', () => {
  let heapUsageBefore = process.memoryUsage().heapUsed
  return athletes.parseFile()
    .then(result => {
      let heapUsage = ((process.memoryUsage().heapUsed - heapUsageBefore) / heapUsageBefore) * 100
      console.log('Memory usage has increased by', `${heapUsage.toFixed(2)}%`)
      expect(heapUsage).toBeLessThan(5)
    })
    .catch(err => {
      throw new Error(err);
    })
})
