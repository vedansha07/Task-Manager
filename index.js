const express= require('express');
const app= express();
const path= require('path');
const fs= require('fs');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))

app.get('/', function(req, res) {
    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error("Error reading directory:", err);
            return res.send("Error loading tasks");
        }
        res.render("index", { files: files });
    });
});

app.get('/file/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            console.error("Error reading file:", err);
            return res.send("Error loading file");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function(req, res) {
    const filepath = `./files/${req.params.filename}`;
    fs.readFile(filepath, "utf-8", function(err, data) {
        if (err) {
            console.error("Error reading file for editing:", err);
            return res.send("File read error");
        }
        res.render("edit", { filename: req.params.filename, filedata: data });
    });
});

app.post('/edit', function(req, res) {
    const oldPath = `./files/${req.body.previous}`;
    const newName = req.body.new || req.body.previous;
    const newPath = `./files/${newName}`;

    fs.writeFile(newPath, req.body.content, function(err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.send("Error updating file");
        }

        if (newName !== req.body.previous) {
            fs.unlink(oldPath, function(err) {
                if (err) console.error("Error deleting old file:", err);
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    });
});

app.post('/create', function(req, res) {
    const filename = `./files/${req.body.title.split(' ').join('')}.txt`;
    fs.writeFile(filename, req.body.details, function(err) {
        if (err) {
            console.error("Error creating file:", err);
            return res.send("Error creating task");
        }
        res.redirect("/");
    });
});

app.post('/delete', function(req, res) {
    const filepath = `./files/${req.body.filename}`;
    fs.unlink(filepath, function(err) {
        if (err) {
            console.error("Error deleting file:", err);
        }
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


 node_modules/
.env
.DS_Store
files/*
!files/.gitkeep