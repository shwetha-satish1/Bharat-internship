// script.js
$(document).ready(function () {
    getPosts();

    $('#postForm').on('submit', function (e) {
        e.preventDefault();

        let title = $('#title').val();
        let content = $('#content').val();

        $.ajax({
            url: '/addPost',
            method: 'POST',
            data: { title, content },
            success: function (response) {
                getPosts();
                $('#title').val('');
                $('#content').val('');
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
});

function getPosts() {
    $.ajax({
        url: '/getPosts',
        method: 'GET',
        success: function (response) {
            let postsHTML = '';
            response.forEach(function (post) {
                postsHTML += `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <hr>
                `;
            });
            $('#posts').html(postsHTML);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/blogdb', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getPosts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/addPost', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedPost = await newPost.save();
        res.send(savedPost);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});