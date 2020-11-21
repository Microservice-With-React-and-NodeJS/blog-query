const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

//this will ask for all the events that was created when query is down
const handleEvent = (type, data) => {
  //watch for different events
  if (type == "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }
  if (type == "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  console.log(posts);

  //commentupdated event: after receving this event,
  //find appropriate comment in memory
  //update the status according to the commentupdated event
  // so , watch for CommentUpdated event type:
  if (type === "CommentUpdated") {
    //pullout the updated informations from data
    const { id, content, postId, status } = data;
    //find the appropriate post
    const post = posts[postId];
    //find the appropriate comment
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });
    //update the comment status
    comment.status = status;
    //commentUpdated only knows that something is updated but doesnt knw what! so every properties of this data needs to be assigned to this comment
    comment.content = content;
  }
};

//we need 2 rout handlers. one for event-bus events, one for getting post
app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  const res = await axios.get("http://event-bus-srv:4005/events");
  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data);
  }
});
