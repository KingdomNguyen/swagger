require("dotenv").config(); 
const { Router } = require("express"); 
const User = require("../models/user"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const router = Router();

const { SECRET = "secret" } = process.env;


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: 
 *       - username
 *       - password
 *       properties:
 *         username:
 *           type: string
 *           discription: name of the user
 *         password:
 *           type: string
 *           discription: enter the password
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: enter the username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     produces:
 *     - application/json  
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: enter the username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     produces:
 *     - application/json  
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

router.post("/signup", async (req, res) => {
    try {
  
      req.body.password = await bcrypt.hash(req.body.password, 10);
   
      const user = await User.create(req.body);
  
      res.json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
  
  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          const token = await jwt.sign({ username: user.username }, SECRET);
          res.json({ token });
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
  module.exports = router