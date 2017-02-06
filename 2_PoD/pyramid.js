'use strict'

const request = require('request')
const baseUrl = 'https://jsonplaceholder.typicode.com'

module.exports = {
  buildUser: function() {
    return new Promise(resolve => {
      this.getUser((err, user) => {
        if (err) throw new Error(err)
        this.getPosts((err, posts) => {
          if (err) throw new Error(err)
          user.posts = posts
          this.getAlbums((err, albums) => {
            if (err) throw new Error(err)
            user.albums = albums
            this.getTodos((err, todos) => {
              if (err) throw new Error(err)
              user.todos = todos
              resolve(user)
            })
          })
        })
      })
    })
  },

  getUser: function(cb) {
    request({
      url: `${baseUrl}/users/1`,
      method: 'get',
      json: true
    }, function (err, response, user) {
      if (err) cb(err)
      cb(null, user)
    })
  },

  getPosts: function(cb) {
    request({
      url: `${baseUrl}/posts?userId=1`,
      method: 'get',
      json: true
    }, function (err, response, posts) {
      if (err) cb(err)
      cb(null, posts)
    })
  },

  getAlbums: function(cb) {
    request({
      url: `${baseUrl}/albums?userId=1`,
      method: 'get',
      json: true
    }, function (err, response, albums) {
      if (err) cb(err)
      cb(null, albums)
    })
  },

  getTodos: function(cb) {
    request({
      url: `${baseUrl}/todos?userId=1`,
      method: 'get',
      json: true
    }, function (err, response, todos) {
      if (err) cb(err)
      cb(null, todos)
    })
  }
}
