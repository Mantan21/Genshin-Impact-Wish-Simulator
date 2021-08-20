const pity5star = {
  set(banner, pity) {
    localStorage.setItem(`${banner}5sPity`, pity)
    return pity
  },
  get(banner) {
    let pity = parseInt(localStorage.getItem(`${banner}5sPity`));
    if (pity > 90) return 0;
    return pity || 0;
  }
}

const pity4star = {
  set (banner, pity) {
    localStorage.setItem(`${banner}4sPity`, pity)
    return pity
  },
  get(banner) {
    let pity = parseInt(localStorage.getItem(`${banner}4sPity`));
    if (pity > 11) return 0;
    return pity || 0;
  }
}

const beginnerRoll = {
  set (pity) {
    localStorage.setItem('beginnerRoll', pity)
    return pity
  },
  get() {
    let pity = parseInt(localStorage.getItem('beginnerRoll'));
    if (pity > 20) return 20;
    return pity || 0;
  }
}

const beginnerGuaranteed = {
  set (opt) {
    localStorage.setItem('beginnerGuaranteed', opt)
    return opt
  },
  get() {
    let isGuaranteed = localStorage.getItem('beginnerGuaranteed');
    return isGuaranteed;
  }
}

const nextGuaranteed = {
  set (opt) {
    localStorage.setItem('nextGuaranteed', opt)
    return opt
  },
  get() {
    const isGuaranteed = localStorage.getItem('nextGuaranteed');
    return isGuaranteed;
  }
}

const nextWeaponGuaranteed = {
  set (opt) {
    localStorage.setItem('nextWeaponGuaranteed', opt)
    return opt
  },
  get() {
    const isGuaranteed = localStorage.getItem('nextWeaponGuaranteed');
    return isGuaranteed;
  }
}

export { pity4star, pity5star, beginnerRoll, beginnerGuaranteed, nextGuaranteed, nextWeaponGuaranteed };