
const { Router } = require("express"); 
const router = Router();
const Todo = require("../models/todo"); 
const { isLoggedIn } = require("./middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *       - username
 *       - task
 *       - completed
 *       - canView
 *       properties:
 *         id: 
 *           type: string
 *           description: get id of the user
 *         username:
 *           type: string
 *           description: the name that username use to login the app
 *         task:
 *           type: string
 *           description: add task
 *         completed: 
 *           type: boolean
 *           description: status of the task
 *         canView:
 *           type: string
 *           description: who can see this task
 *         canChange:
 *           type: string
 *           discription: who can change this task      
 */

/**
 * @swagger
 * /send-to-do:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: show all tasks that were created by the user
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */


/**
 * @swagger
 * /create-to-do:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: add task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 *     responses:
 *       200: 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /update-to-do:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: update task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 *     responses:
 *       200: 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /delete-to-do:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: delete task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 *     responses:
 *       200: 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /to-do-share:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: show all users that allowed to see the task
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

/**
 * @swagger
 * /to-do-change:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: task is updated by someone else
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 *     responses:
 *       200: 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

router.get("/send-to-do", isLoggedIn, async (req, res) => {
  const { username } = req.user; 
  res.json(
    await Todo.find({ username }).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

router.post("/create-to-do",isLoggedIn, async (req, res) => {
  const { username } = req.user; 
  req.body.username = username; 
  res.json(
    await Todo.create(req.body).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

router.put("/update-to-do", isLoggedIn, async (req, res) => {
  const { username } = req.user; 
  req.body.username = username; 
  const { _id } = req.body;
  res.json(
    await Todo.findByIdAndUpdate(_id, req.body).catch(
      (error) => res.status(400).json({ error })
    )
  );
});

router.delete("/delete-to-do", isLoggedIn, async (req, res) => {
  const { _id } = req.body;
  res.json(
    await Todo.findByIdAndDelete(_id).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

router.get("/to-do-share", isLoggedIn,async (req, res) => {
  const { username } = req.user; 
  res.json(
    await (await Todo.find({canView: username}).catch((error) =>
      res.status(400).json({ error })
    )
  ));

})

router.put("/to-do-change", isLoggedIn, async (req, res)=>{
  const { username } = req.user; 
  const { _id } = req.body;
  res.json(
    await Todo.findByIdAndUpdate({canChange: username , _id}, req.body, {new: true}).catch((error) =>
    res.status(400).json({ error })
  )
  )
})

module.exports = router