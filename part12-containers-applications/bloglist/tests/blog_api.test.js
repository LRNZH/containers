const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('../utils/test_helper')

describe('when there is initially some notes saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  }, 100000)

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(contents).toContain(
      'Macbeth'
    )
  }, 100000)

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body
    contents.forEach((post) => {
      expect(post.id).toBeDefined()
      expect(post._id).toBeUndefined()
    })
  }), 100000
})

describe('updating a blog post', () => {
  test('updates with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog  = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 1)
  }, 100000)

  test('fails with status code 400 if data is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = { ...blogToUpdate, likes: 'invalid likes value' }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes)
  }, 100000)

  test('fails with status code 404 if blog post is not found', async () => {
    const validNonExistingId = await helper.nonExistingId()
    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send({ title: 'new title', url: 'new url', likes: 0 })
      .expect(404)
  }, 100000)

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = 'invalid id'
    await api
      .put(`/api/blogs/${invalidId}`)
      .send({ title: 'new title', url: 'new url', likes: 0 })
      .expect(400)
  }, 100000)
})


afterAll(async () => {
  await mongoose.connection.close()
})