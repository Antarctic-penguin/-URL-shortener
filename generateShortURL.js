function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function generateShortURL() {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  const collection = lowerCaseLetters + upperCaseLetters + numbers
  let ShortURL = ''
  for (let i = 0; i < 5; i++) {
    ShortURL += sample(collection)
  }
  return ShortURL
}
module.exports = generateShortURL