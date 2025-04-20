const express= require('express');
const app= express();
const path= require('path');
const fs= require('fs');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))

 app.get('/',function(req,res){
    fs.readdir(`./files`,function(err,files)
    {
        res.render("index",{files: files});
    })
 });

 app.get('/file/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8" , function(err,filedata){
        res.render('show',{filename: req.params.filename, filedata: filedata})
    })
 });

 app.get('/edit/:filename', function(req, res){
    const filepath = `./files/${req.params.filename}`;
    fs.readFile(filepath, "utf-8", function(err, data){
        if (err) {
            console.error(err);
            return res.send("File read error");
        }
        res.render("edit", { filename: req.params.filename, filedata: data });
    });
});


app.post('/edit', function(req, res){
    const oldPath = `./files/${req.body.previous}`;
    const newName = req.body.new || req.body.previous;
    const newPath = `./files/${newName}`;

    // First write the updated content to the file (rename if needed)
    fs.writeFile(newPath, req.body.content, function(err){
        if (err) {
            console.error(err);
            return res.send("Error updating file");
        }

        // If the filename changed, delete the old file
        if (newName !== req.body.previous) {
            fs.unlink(oldPath, function(err) {
                if (err) console.error("Error deleting old file after rename:", err);
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    });
});


 app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        res.redirect("/")
    })
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

 app.listen(3000)


 