var fbApi = require('./fbApi');
let counter = 0;
fbApi.connect('get', "establishments/6/comments", (err, data) => {
  if(err) return console.error("fireblast get error", err);
  console.log("fireblast get success", "establishments/6/comments", data);
});

fbApi.connect('set', "establishments/6/comments/0", "{id=14, text=Fourten}", (err, data) => {
  if(err) return console.error("fireblast set error", err);
  console.log("fireblast set success", "establishments/6/comments/0", "{id=14, text=Fourten}");
});

fbApi.connect('update', "establishments/6/comments", '{"0": {"id":14, "text":"Fourteeen"}}', (err, data) => {
  if(err) return console.error("fireblast update error", err);
  console.log("fireblast update success", "establishments/6/comments", '{"0": {"id":14, "text":"Fourteeen"}}');
});

fbApi.connect('increment', "like-counter/count", (err, data) => {
  if(err) return console.error("fireblast increment error", err);
  console.log("fireblast increment success", "like-counter/count", data);
});

fbApi.connect('increment', "like-counter/count", (err, data) => {
  if(err) return console.error("fireblast increment error", err);
  console.log("fireblast increment success", "like-counter/count", data);
});

fbApi.connect('decrement', "like-counter/count", (err, data) => {
  if(err) return console.error("fireblast decrement error", err);
  console.log("fireblast decrement success", "like-counter/count", data);
});

fbApi.connect('onChildAdded', "establishments/6/comments", (err, data) => {
  if(err) return console.error("fireblast onChildAdded error", err);
  console.log("fireblast onChildAdded success" + counter++, data);
  if(counter > 2) {
    fbApi.connect('offChildAdded', "establishments/6/comments");
  }
});
