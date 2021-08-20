const pity5star = {
  set(pity) {
    localStorage.setItem('pity5star', pity)
    return pity
  },
  get() {
    let pity = parseInt(localStorage.getItem('pity5star'));
    if (pity > 90) return 0;
    return pity || 0;
  }
}

const pity4star = {
  set(pity) {
    localStorage.setItem('pity4star', pity)
    return pity
  },
  get() {
    let pity = parseInt(localStorage.getItem('pity4star'));
    if (pity > 11) return 0;
    return pity || 0;
  }
}

export { pity4star, pity5star };