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
  static update = (id, { name, price, description }) => {
    if (name) {
      this.name = name
    }
    if (price) {
      this.price = price
    }
    if (description) {
      this.description = description
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

  const updatedProductList = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list: updatedProductList,
        isEmpty: updatedProductList.length === 0,
      },
    },
  })
  console.log(Product.getList())
  res.render('product-alert', {
    style: 'product-alert',
    info: 'Product was successfully added',
  })
})
//================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))
  res.render('product-alert', {
    style: 'product-alert',
    info: 'Product was deleted',
  })
  // const isDeleted = Product.deleteById(Number(id))

  // if (isDeleted) {
  //   res.render('product-alert', {
  //     style: 'product-alert',
  //     info: 'Product was deleted',
  //   })
  // } else {
  //   res.render('product-alert', {
  //     style: 'product-alert',
  //     info: 'Failed to delete product',
  //   })
  // }
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
        list: list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
//================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product: product,
    })
  } else {
    res.render('product-edit', {
      style: 'product-edit',
      info: 'Product not found',
    })
  }
})
//================================================
router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body
  //
  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  console.log(id)
  console.log(product)
  if (product) {
    res.render('product-alert', {
      style: 'product-alert',
      info: 'Information about product was updated',
    })
  } else {
    res.render('product-alert', {
      style: 'product-alert',
      info: 'Error occured',
    })
  }
})
// Підключаємо роутер до бек-енду
module.exports = router
