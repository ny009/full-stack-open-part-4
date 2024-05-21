const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// CONSTANTS
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const listWithMultipleBlogs = [
  {
    title: "Nehal is author",
    author: "Nehal",
    url: "nasd",
    likes: 2,
    id: "6644055621b8dd57418d6f85"
  },
  {
    title: "Nehal is author 2",
    author: "Nehal",
    url: "nasd",
    likes: 2,
    id: "66441160b8c0c860514a2e54"
  },
  {
    title: "Nehal is author 3",
    author: "Nehal",
    url: "nasd",
    likes: 2,
    id: "66441263f3bee6085f227a2d"
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 12,
    id: "664beea35af8771e4cbbe46d"
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]
const listWithMultipleMaxLikes = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 12,
    id: "664beea35af8771e4cbbe46d"
  },
  {
    title: "People also like Nehal's books",
    author: "Nehal",
    url: "N/A",
    likes: 12,
    id: "664beec05af8771e4cbbe46f"
  }
]
// TESTS
describe('Dummy' , () => {
  test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('Total Likes', () => {
  test('when list of blogs is empty, we expect the result to be 0', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the sum of likes of all blogs', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 23)
  })
})

describe('Favourite Blog', () => {
  test('when list of blogs is empty, we expect the result to be {}', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, {})
  })

  test('When there is a list of blogs with one maximum', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    expected_result = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    assert.deepStrictEqual(result, expected_result)
  })

  test('When there is a list of blogs with more than one maximum', () => {
    const result = listHelper.favoriteBlog(listWithMultipleMaxLikes)
    assert.strictEqual(result.likes, 12)
  })
})

describe('Author with Most Blogs', () => {
  test('List with multiple authors and blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    const expected_result = {author: 'Nehal', blogs: 3}
    assert.deepStrictEqual(result, expected_result)
  })

  test('Blog with one author', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    const expected_result = {author: 'Edsger W. Dijkstra', blogs: 1 }
    assert.deepStrictEqual(result, expected_result)
  })
})

describe('Most Liked Author', () => {
  test('List with multiple authors and blogs', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    const expected_result = {author: "Edsger W. Dijkstra", likes: 17}
    assert.deepStrictEqual(result, expected_result)
  })

  test('Blog with one author', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    const expected_result = {author: 'Edsger W. Dijkstra', likes: 5 }
    assert.deepStrictEqual(result, expected_result)
  })
})