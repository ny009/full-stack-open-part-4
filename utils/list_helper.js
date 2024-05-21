const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (accumulator, element) => {
    return accumulator + element.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const checkIfBlogListEmpty = blogs => {
  if (!blogs || blogs.length === 0) {
    return false
  }
  return true
}

const favoriteBlog = blogs => {
  if (!checkIfBlogListEmpty(blogs)) return {}
  const max_blog = blogs.reduce((max_blog, blog) => max_blog.likes < blog.likes ? blog : max_blog, blogs[0])
  return ['title', 'author', 'likes'].reduce((acc, prop) => ({...acc, [prop]: max_blog[prop]}), {})
}

const mostBlogs = blogs => {
  if (!checkIfBlogListEmpty(blogs)) return {}

  const authors = {}
  let op_author = {author: '', blogs: 0}
  blogs.forEach(blog => {
      authors[blog.author] = (authors[blog.author] || 0) + 1
      if (authors[blog.author] > op_author.blogs) {
        op_author = { author: blog.author, blogs: authors[blog.author] }
    }
  })
  return op_author
}

const mostLikes = blogs => {
  if (!checkIfBlogListEmpty(blogs)) return {}

  const authors = {}
  let op_author = {author: '', likes: 0}
  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes
    if (authors[blog.author] > op_author.likes) {
      op_author = { author: blog.author, likes: authors[blog.author] }
    }
  })
  return op_author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}