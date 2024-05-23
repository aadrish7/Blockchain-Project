

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth");
const fileRouter = require("./routers/fileupload");
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const app = express();
const Individual = require("./models/individual")
app.use(express.json());
app.use(cors());
mongoose
  .connect(
    `mongodb+srv://new:new@blockchain.glqgkn6.mongodb.net/?retryWrites=true&w=majority&appName=Blockchain`
  )
  .then(() => {
    console.log("\x1b[34m%s\x1b[0m", "DB connected");
    app.listen(3001, () =>
      console.log("\x1b[33m%s\x1b[0m", "Listening at port 3001")
    );
  })
  .catch((err) => {
    console.error("\x1b[31m%s\x1b[0m", err);
  });

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
  
  const upload = multer({storage})
  
  app.post('/upload', upload.single('file'), (req, res) => {
    console.log("req.body",req.body)
    console.log("req.file",req.file)
  })

  app.get("/files", (req, res) => {
    fs.readdir("./uploads", (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ files });
    });
  });

  app.get("/files/:fileName", (req, res) => {

    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName);
    console.log("filePath",filePath) 
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  });
  app.get('/api/individuals/:username', async (req, res) => {
    try {
      const username = req.params.username;
      console.log("username", username)
      const individual = await Individual.findOne({ username: username });
      console.log(individual)
      if (!individual) {
        return res.status(404).send({ message: 'Individual not found' });
      }
      res.json(individual);
    } catch (error) {
      res.status(500).send({ message: 'Server error', error: error.message });
    }
  });
app.use("/auth", authRouter)

