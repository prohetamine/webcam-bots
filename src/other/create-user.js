const name                = require('random-name')
    , { generateEmail }   = require('./../../custom_modules/temp-mail')
    , md5                 = require('md5')

const createNumber = () => {
    const numbers = [
      ...Array(10).fill(1).map((e, i) => i+''),
      ...Array(10).fill(1).map((e, i) => i+''+i),
      ...Array(10).fill(1).map((e, i) => i+''+i+''+i),
      ...Array(10).fill(1).map((e, i) => i+''+i+''+i+''+i),
      ...Array(30).fill(1).map((e, i) => (i+18)+''),
      ...Array(35).fill(1).map((e, i) => (i+1965)+'')
    ]

    return numbers[parseInt(Math.random()*(numbers.length - 1))]
}

const username = () => {
  const randInt = () => parseInt(Math.random() * 2)

  for (;;) {
    const username = name().split(' ').map(_word => {
      let word = _word

      if (randInt()) {
        if (randInt()) {
            word = word.slice(0, parseInt(Math.random() * (word.length - 4))+3)
        } else {
            word = word.slice(-(parseInt(Math.random() * (word.length - 4))+3))
        }
      }

      if (randInt()) {
        if (randInt()) {
            word = word.toLowerCase()
        } else {
            word = word.toUpperCase()
        }
      }

      if (randInt()) {
        if (randInt()) {
            word = word + createNumber()
        } else {
            word = createNumber() + word
        }
      }

      return word
    }).join('')

    if (
      username.length > 6 &&
      username.length < 10 &&
      username.match(/\d+/g) == null || (username.match(/\d+/g) && username.match(/\d+/g).length < 2)
    ) {
      return username
    }
  }
}

const email = async (username) => {
  const domain = await generateEmail()
  const randInt = parseInt(Math.random() * 100)

  return username.slice(0, 6).toLowerCase() + randInt + '@' + domain.match(/[^@]+$/)
}

const password = (username, email) => md5(username + email).slice(0, parseInt(Math.random() * 6)+10)

const month = () => {
    const option = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    return option[parseInt(Math.random() * (option.length - 1))]
}

const day = () => (parseInt(Math.random() * 27)+1)+''

const year = () => (parseInt(Math.random() * 35)+1965)+''

module.exports = async () => {
  const _username   = username()
      , _email      = await email(_username)
      , _password   = password(_username, _email)
      , _month      = month()
      , _day        = day()
      , _year       = year()

  return {
    username: _username,
    password: _password,
    email: _email,
    month: _month,
    day: _day,
    year: _year,
    gender: 'm'
  }
}
