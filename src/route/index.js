// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Purchase {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    // this.id = Purchase.#list.length + 1
    this.id = ++Purchase.#count // Генеруємо унікальний  id для товару

    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newPurchase = new Purchase(...data)

    this.#list.push(newPurchase)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    // we filter Purchases to exclude the one that we compare id

    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    // we sort with Math.random() and mix the array

    const shuffeledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    // we return first 3 elements from mixed array
    return shuffeledList.slice(0, 3)
  }
}

Purchase.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming(X43v31) AMD Ryzen 5 3600 / `,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Purchase.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{ id: 2, text: 'Топ продажів' }],
  20000,
  10,
)

Purchase.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [{ id: 1, text: 'Готовий до відправки' }],
  40000,
  10,
)

class PurchaseCreate {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return PurchaseCreate.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * PurchaseCreate.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    // const amount = price * PurchaseCreate.#BONUS_FACTOR

    const amount = this.calcBonusAmount(price)

    const currentBalance =
      PurchaseCreate.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    PurchaseCreate.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++PurchaseCreate.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice

    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new PurchaseCreate(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return PurchaseCreate.#list.reverse()
    //  return PurchaseCreate.#list.reverse().map(({...}) => {...})
  }

  static getById = (id) => {
    return PurchaseCreate.#list.find(
      (item) => item.id === id,
    )
  }

  static updateById = (id, data) => {
    // const purchase = PurchaseCreate.#list.find(
    //   (item) => item.id === id,
    // )

    const purchase = PurchaseCreate.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname

      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}

// ================================================================
class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }
  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALES25', 0.75)
//======
// ================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі

    style: 'purchase-index',

    data: {
      list: Purchase.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
// router.get Створює нам один ентпоїнт

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // ↙️ cюди вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    data: {
      list: Purchase.getRandomList(id),
      product: Purchase.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)

  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Purchase.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількості товару нема в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount

  const totalPrice =
    productPrice + PurchaseCreate.DELIVERY_PRICE

  const bonus = PurchaseCreate.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: PurchaseCreate.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: PurchaseCreate.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })

  //here//
})
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Purchase.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
        link: `/purchase-list`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  // if (
  //   isNaN(totalPrice) ||
  //   isNaN(productPrice) ||
  //   isNaN(deliveryPrice) ||
  //   isNaN(amount) ||
  //   isNaN(bonus)
  // ) {
  //   return res.render('alert', {
  //     style: 'alert',

  //     data: {
  //       message: 'Помилка',
  //       info: 'Некоректні дані',
  //       link: `/purchase-list`,
  //     },
  //   })
  // }

  // перевіряємо чи заповнені всі обовʼязкові поля

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Заповніть обовʼязкові поля',
        info: 'Некоректні дані',
        link: `/purchase-product`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount =
      PurchaseCreate.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    PurchaseCreate.updateBonusBalance(
      email,
      totalPrice,
      bonus,
    )

    totalPrice -= bonus
  } else {
    PurchaseCreate.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = PurchaseCreate.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',

    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})

// ================================================================
// ========================
// ========================
router.get('/purchase-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = PurchaseCreate.getList()

  list.forEach((purchase) => {
    purchase.bonus = PurchaseCreate.calcBonusAmount(
      purchase.totalPrice,
    )
  })

  console.log(list)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',
    purchases: list,
  })
})

// ================================================================

// ================================================================
// ========================
router.get('/purchase-details', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  console.log('Requested purchase id:', id)

  const purchase = PurchaseCreate.getById(id)
  const bonus = PurchaseCreate.calcBonusAmount(
    purchase.totalPrice,
  )

  console.log('purchase:', purchase)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-details', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-details',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      comment: purchase.comment,
      delivery: purchase.delivery,
      product: purchase.product.title,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

//=====
router.get('/purchase-edit-form', function (req, res) {
  const id = Number(req.query)
  const purchase = PurchaseCreate.getById(id)

  if (!purchase) {
    res.render('alert', {
      style: 'alert',
      data: {
        info: 'Замовлення з таким ID не знайдено',
      },
    })
  } else {
    res.render('purchase-edit-form', {
      style: 'purchase-edit-form',
      data: {
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        phone: purchase.phone,
        email: purchase.email,
      },
    })
  }
})
// ================================================================
router.post('/purchase-edit-form', function (req, res) {
  const id = Number(req.query.id)
  let { firstname, lastname, phone, email } = req.body

  const purchase = PurchaseCreate.getById(id)

  if (purchase) {
    const newPurchase = PurchaseCreate.updateById(id, {
      firstname,
      lastname,
      phone,
      email,
      //delivery,
    })
    console.log(newPurchase)

    if (newPurchase) {
      res.render('alert', {
        // вказуємо назву папки контейнера, в якій знаходяться наші стилі
        style: 'alert',
        data: {
          message: 'Інформація про замовлення оновлена',
          link: `/purchase-list`,
          info: 'Успішна дія',
        },
      })
    } else {
      res.render('alert', {
        style: 'alert',
        data: {
          message:
            'Помилка при оновленні інформації про замовлення',
          link: `/purchase-list`,
        },
      })
    }
  } else {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка: Покупка не знайдена',
        link: `/purchase-list`,
      },
    })
  }
})
//================================================
// ================================================================
// ================================================================
class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = () => {
      this.date = new Date().toISOString()
    }
  }
  static getList = () => this.#list
  checkId = (id) => this.id === id
  static add = (product) => {
    this.#list.push(product)
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
    const { name, price } = data
    if (product) {
      if (name) {
        product.name = name
      } else if (price) {
        product.price = price
      }
      return true
    } else {
      return false
    }
  }
}
// ==============

router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)
  console.log(Product.getList())
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-alert',
    info: 'Товар успішно додано',
  })
  // ↑↑ сюди вводимо JSON дані
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
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
//================================================
router.get('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query
  const product = Product.getById(Number(id))
  // console.log(product)
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('product-edit', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})
// ↑↑ сюди вводимо JSON дані
// ================================================================
router.post('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id, name, price, description } = req.body
  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })
  console.log(id)
  console.log(product)
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Сталася помилка',
    })
  }
  // ↑↑ сюди вводимо JSON дані
})
// Підключаємо роутер до бек-енду

// ================================================================
// router.post('/user-create', function (req, res) {
//   // console.log(req.body)
//   const { email, login, password } = req.body

//   const user = new User(email, login, password)

//   User.add(user)

//   console.log(User.getList())

//   res.render('success-info', {
//     style: 'success-info',
//     info: 'User was created',
//   })
// })
// // ================================================================
// router.get('/user-delete', function (req, res) {
//   // console.log(req.body)
//   const { id } = req.query

//   User.deleteById(Number(id))
//   res.render('success-info', {
//     style: 'success-info',
//     info: 'User was deleted',
//   })
// })

// ================================================================
module.exports = router
