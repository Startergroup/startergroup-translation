import store from '../../store'

export async function checkAuth (to, from, next) {
  const timer = store.state.auth.timer
  const user = store.state.auth.user

  if (to.matched.some(record => record.meta.protected)) {
    if (timer) {
      clearInterval(timer)
    }

    if (user.isGuest) {
      return next()
    }

    if (store.getters['auth/isLogged']) {
      const newTimer = setInterval(() => {
        store.dispatch('auth/updateActivity')
      }, 10000)

      store.commit('auth/setTimer', newTimer)
      return next()
    }

    return next('/auth')
  }

  clearInterval(timer)

  return next()
}
