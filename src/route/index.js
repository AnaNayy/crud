// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    return this.#list
  }
  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  // static updateById = (id, {email}) => {
  //   const user = this.getById(id);

  //   if (user) {
  //     // Object.assign(user, {email});
  //     if (email) {
  //       user.email = email
  //     } return true;
  //   } else {return false}
  // }
  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі

    style: 'index',

    // data: {
    //   userList: User.getList();
    // }
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// ================================================================
router.post('/user-create', function (req, res) {
  // console.log(req.body)
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'User was created',
  })
})
// ================================================================
router.get('/user-delete', function (req, res) {
  // console.log(req.body)
  const { id } = req.query

  User.deleteById(Number(id))

  // if (user) {
  //   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!")
  // }
  res.render('success-info', {
    style: 'success-info',
    info: 'User was deleted',
  })
})

// ================================================================
router.post('/user-update', function (req, res) {
  // console.log(req.body)
  const { email, password, id } = req.body
  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  // console.log(email, password, id)
  // let result = false;
  // if()

  //  const result = User.updateById(Number(id), {email})

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? "User's email was updated"
      : 'Error occured',
  })
})
// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 90000) + 10000
  }

  // verifyPassword = (password) => this.password === password

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => {
    return this.#list
  }
  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }
}

// ==============
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі

    style: 'product-create',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())
  res.render('product-alert', {
    style: 'product-alert',
    info: 'Product was successfully added',
  })
})
//================================================
router.get('/product-delete', function (req, res) {
  // console.log(req.body)
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('product-alert', {
    style: 'product-alert',
    info: 'Product was deleted',
  })
})
// ==============

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі

    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
    cards: [
      {
        title: 'Stylish dress',
        description:
          'Elegant dress made of natural material. Suitable for special occasions',
        price: '$1200',
        id: 123,
      },
      {
        title: 'Sports shoes',
        description:
          'Comfortable sports shoes. Perfect for running and hiking',
        price: '$2200',
        id: 1234,
      },
      {
        title: 'Sunglasses',
        description:
          'Fashionable sunglasses. High-tech lenses protect your eyes',
        price: '$700',
        id: 12345,
      },
      {
        title: 'Male watch',
        description: 'Elegant male watch with leather band',
        price: '$800',
        id: 123456,
      },
      {
        title: 'Female backpack',
        description:
          'Cute female backpack with large inner compartment',
        price: '$1200',
        id: 1234567,
      },
      {
        title: 'Umbrella',
        description:
          'Compact umbrella with automatic opening system',
        price: '$99',
        id: 12345678,
      },
      {
        title: 'Stylish winter sweater',
        description:
          'Wool winter sweater. Suitable for really cold weather',
        price: '$700',
        id: 123456789,
      },
      {
        title: 'Fitness watch',
        description:
          'Fitness watch for tracking health and body condition',
        price: '$150',
        id: 1234567890,
      },
      {
        title: 'Comfortable chair',
        description:
          'Comfortable chair made of natural wood. Great for home decor',
        price: '$1000',
        id: 223,
      },
    ],
  })
  // ↑↑ сюди вводимо JSON дані
})
//================================================
router.get('/product-edit', function (req, res) {
  // console.log(req.body)
  const { name, price, description } = req.body
  const { id } = req.query

  let result = false

  const product = Product.getById(Number(id))

  if (product) {
    Product.update(product, { name })
    result = true
  }
  if (product) {
    Product.update(product, { price })
    result = true
  }
  if (product) {
    Product.update(product, { description })
    result = true
  }

  res.render('product-edit', {
    style: 'product-edit',
    info: result,
  })
})
//================================================
router.post('/product-edit', function (req, res) {
  // console.log(req.body)
  const { name, price, description } = req.body
  let result = false
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (product) {
    Product.update(product, { name })
    result = true
  }
  if (product) {
    Product.update(product, { price })
    result = true
  }
  if (product) {
    Product.update(product, { description })
    result = true
  }

  res.render('product-alert', {
    style: 'product-alert',
    info: result
      ? 'Product name was updated'
      : 'Error occured',
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
