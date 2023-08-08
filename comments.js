// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

// Create express app
const app = express();

// Allow cross origin requests
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// Create comments array
const commentsByPostId = {};

// Create route to get comments for a post
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Create route to post a comment
app.post('/posts/:id/comments', (req, res) => {
  // Generate random id
  const commentId = randomBytes(4).toString('hex');
  // Get request body
  const { content } = req.body;
  // Get post id
  const postId = req.params.id;
  // Get comments for post
  const comments = commentsByPostId[postId] || [];
  // Create new comment
  const comment = { id: commentId, content, status: 'pending' };
  // Add comment to comments array
  comments.push(comment);
  // Add comments back to commentsByPostId
  commentsByPostId[postId] = comments;
  // Send back comment
  res.status(201).send(comments);
});

// Create route to handle events
app.post('/events', (req, res) => {
  // Get event type
  const { type } = req.body;
  // If event type is comment moderated
  if (type === 'CommentModerated') {
    // Get event data
    const { data } = req.body;
    // Get comment id
    const { id, postId, status, content } = data;
    // Get comments for post
    const comments = commentsByPostId[postId];
    // Find comment
    const comment = comments.find((comment) => comment.id === id);
    // Update comment status
    comment.status = status;
    // Send event to event bus
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        postId,
        status,
        content,
      },
    });
  }
  // Send back response
  res.send({});
});

// Start server
app.listen(400