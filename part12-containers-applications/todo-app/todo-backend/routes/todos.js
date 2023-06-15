const express = require("express");
const { Todo } = require("../mongo/index");
const router = express.Router();
const { setAsync, getAsync } = require('../redis/index');

let todoCounter = 0;

async function updateTodoCounter() {
  //todoCounter = await getAsync('todoCounter') || 0;
  todoCounter = await Todo.countDocuments() || 0;
}

updateTodoCounter();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  await setAsync('todoCounter', todoCounter + 1);
  await updateTodoCounter();
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);
  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  await setAsync('todoCounter', todoCounter - 1);
  await updateTodoCounter();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const { text, done } = req.body;
  req.todo.text = text;
  req.todo.done = done;
  await req.todo.save();
  res.send(req.todo);
});

router.get('/statistics', async (req, res) => {
  res.json({ added_todos: todoCounter });
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
