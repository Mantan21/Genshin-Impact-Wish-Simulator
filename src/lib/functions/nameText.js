const getName = (name) => name.replace(/-/g, ' ').replace(new RegExp("_"), "'");

const getSlug = (name) => name.replace(/ /g, '-').replace(new RegExp("'"), "_");

export { getName, getSlug };