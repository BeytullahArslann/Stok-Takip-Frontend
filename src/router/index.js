import Vue from 'vue'
import VueRouter from 'vue-router'
import { HTTP } from '@/main-source'
/* eslint-disable */
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        requiresAuth: false,
        layout: 'full',
      },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/Orders.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'Orders',
        breadcrumb: [
          {
            text: 'Orders',
            active: true,
          },
        ],
      },
    },
    {
      path: '/createOrder',
      name: 'createOrder',
      component: () => import('@/views/CreateOrder.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'Create Order',
        breadcrumb: [
          {
            text: 'Create Order',
            active: true,
          },
        ],
      },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/Products.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'Products',
        breadcrumb: [
          {
            text: 'Products',
            active: true,
          },
        ],
      },
    },
    {
      path: '/createProduct',
      name: 'createProduct',
      component: () => import('@/views/CreateProduct.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'Create Product',
        breadcrumb: [
          {
            text: 'Create Product',
            active: true,
          },
        ],
      },
    },
    {
      path: '/updateProduct/:id',
      name: 'updateProduct',
      component: () => import('@/views/UpdateProduct.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'Update Product',
        breadcrumb: [
          {
            text: 'Update Product',
            active: true,
          },
        ],
      },
    },
    {
      path: '/Users',
      name: 'users',
      component: () => import('@/views/Users.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'Users',
        breadcrumb: [
          {
            text: 'Users',
            active: true,
          },
        ],
      },
    },
    {
      requiresAuth: true,
      path: '/createUser',
      name: 'createUser',
      component: () => import('@/views/CreateUser.vue'),
      meta: {
        pageTitle: 'Create User',
        breadcrumb: [
          {
            text: 'Create User',
            active: true,
          },
        ],
      },
    },
    {
      requiresAuth: true,
      path: '/updateUser/:id',
      name: 'updateUser',
      component: () => import('@/views/UpdateUser.vue'),
      meta: {
        pageTitle: 'Update User',
        breadcrumb: [
          {
            text: 'Update User',
            active: true,
          },
        ],
      },
    },
    {
      requiresAuth: true,
      path: '/createWarehouse',
      name: 'createWarehouse',
      component: () => import('@/views/CreateWarehouse.vue'),
      meta: {
        pageTitle: 'Create Warehouse',
        breadcrumb: [
          {
            text: 'Create Warehouse',
            active: true,
          },
        ],
      },
    },
    {
      requiresAuth: true,
      path: '/updateWarehouse/:id',
      name: 'updateWarehouse',
      component: () => import('@/views/UpdateWarehouse.vue'),
      meta: {
        pageTitle: 'Update Warehouse',
        breadcrumb: [
          {
            text: 'Update Warehouse',
            active: true,
          },
        ],
      },
    },
    {
      requiresAuth: true,
      path: '/warehouseDetails/:id',
      name: 'warehouseDetails',
      component: () => import('@/views/WarehouseDetails.vue'),
      meta: {
        pageTitle: 'Warehouse Details',
        breadcrumb: [
          {
            text: 'Warehouse Details',
            active: true,
          },
        ],
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
});

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (!localStorage.getItem("loggedIn") && to.path != '/login') {
    next({
      path: '/login',
    });
  } else if (!localStorage.getItem("loggedIn") && to.path == '/login') {
    next();
  }
  else {
    let user = typeof (JSON.parse(localStorage.getItem("userData"))) != "undefined" ? JSON.parse(localStorage.getItem("userData")) : { email: '', password: '' }
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      HTTP.get("User/login?Email=" + user.email + "&password=" + user.password).then((result) => {
        if (result.data[0]) {
          localStorage.setItem("userData", JSON.stringify(result.data[0]))
          localStorage.setItem("loggedIn", true)
        }
        else {
          next({
            path: '/login',
          });
        }
      }).catch((err) => {
      });
    }
  }
  let roleId = JSON.parse(localStorage.getItem("userData")).roleId
  let id = JSON.parse(localStorage.getItem("userData")).userId
  if (roleId != 1 && to.path == '/Users') {
    next({
      path: '/',
    });
  }
  if (roleId != 1 && to.path == '/updateUser') {
    next({
      path: '/',
    });
  }
  if (roleId != 1 && (to.name == 'updateUser' && to.path != '/updateUser/' + id)) {
    next({
      path: '/',
    });
  }
  if (roleId != 1 && (to.path == '/createProduct' || to.name == 'updateProduct')) {
    next({
      path: '/',
    });
  }
  if (roleId != 1 && to.name == 'updateProduct') {
    next({
      path: '/',
    });
  }

  next();
});

export default router
