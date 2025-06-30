const crypto = require("crypto");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "sasha",
  password: "losos",
  database: "spotify",
});


db.connect((err) => {
  if (err) console.error("Connection error:", err);
  else console.log("The database is connected!");
});

app.post('/register', (req, res) => {
    const { fullname, username, email, password,birthdate }=req.body;
    const hashedPassword = crypto.createHash("ripemd160").update(password).digest("hex");

    db.query("SELECT id FROM user WHERE username = ? OR email = ?", [username, email], (err, result) => {
        if (err){ return res.status(500).json({ error: err })} ;
        if(result.length > 0){
            return res.status(409).send("User already exists")};

        db.query("INSERT INTO user (fullname, username, email, password, birthdate) VALUES (?, ?, ?, ?, ?)", [fullname, username, email, hashedPassword, birthdate], (err, result) => {
            if (err) {
                console.error('Error adding user:', err);
                res.status(500).send('Server error');
                } else {
                    res.status(201).send('User registered successfully');
                                         
            }
            const userId = result.insertId;
            db.query("INSERT INTO playlist (id_user, name) Values(?,?)", [userId, "My playlist"], (err, result)=>{
                if (err) {
                    console.error('Error adding playlist:', err);
                    res.status(500).send('Server error');
                }
            })
        })
        
    })
})
app.post('/login', (req, res)=>{
    const { email, password}=req.body;
    const hashedPassword = crypto.createHash("ripemd160").update(password).digest("hex");
    db.query("SELECT password, id FROM user WHERE email = ? OR username = ?", [email, email], (err, result)=>{
        if(err){ return res.status(500).json({ error: err })}
        if (result[0].password === hashedPassword) {
          const userId = result[0].id;
            res.cookie("userId", userId, {
              maxAge: 24 * 60 * 60 * 1000,
              httpOnly: false,
              secure: true,
              sameSite: "None"
            });
            return res.status(201).send('User registered successfully');
          } else {
            return res.status(409).send("User already exists");
          }
    })     
});
app.post('/user', (req, res) => {
  const {userId} = req.body;
  db.query("SELECT user.*, playlist.id AS 'playlistId', playlist.name AS 'playlistName' FROM user JOIN playlist ON user.id = playlist.id_user WHERE user.id = ?", [userId], (err, result) => {
    if(err){ return res.status(500).json({ error: err })}
    if (result.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден', id: userId });
    }
    else{ 
      return res.json(result[0])};
  })  

})
app.post('/following', (req, res) => {
  const {userId} = req.body;
  db.query("SELECT * FROM following WHERE id_user = ?", [userId], (err, result) => {
    if(err){ return res.status(500).json({ error: err })}
    if (result.length === 0) {
      return res.status(404).json({ error: 'User was not found', id: userId });
    }
    else{ 
      return res.json(result)};
  })  

})
app.post('/follow', (req, res) => {
  const {userId, artistId} = req.body;
  if(userId ===null || artistId === null) return res.status(400).json({ message: "Any Artist to adding!" })
    db.query("SELECT COUNT(*) FROM following WHERE id_user = ? AND artist_id = ?", [userId, artistId], (err, result) => {
      if(err){ return res.status(500).json({ error: err })}
      if (result[0]["COUNT(*)"] > 0) {
        db.query("DELETE FROM following WHERE id_user = ? AND artist_id = ?", [userId, artistId],(err, result=>{
          if(err){ return res.status(500).json({ error: err })}
          else{
            return res.json("You unfollowed the artist")
          }
        }))
      }
      if(result[0]["COUNT(*)"] === 0){
        db.query("INSERT INTO following (id_user, artist_id) VALUES (?, ?)", [userId, artistId], (err, result) => {
          if(err){ return res.status(500).json({ error: err })}
          else{
            return res.json("You followed the artist")
          }
        })
      }          
    })
}
  )
app.post('/changes', (req, res) => {
  const userId = req.body.userId;
  const changes = req.body.changes;
  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ message: "Any Changes!" });
  }
  if (changes.password) {
    changes.password = crypto.createHash("ripemd160").update(changes.password).digest("hex");
  }
  const fildes = Object.keys(changes).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(changes);
  values.push(userId);
  const sql = `UPDATE user SET ${fildes} WHERE id = ?`;
  db.query(sql, values, (err, result) => {
  if(err){
    return res.status(500).json({ message: "Error during update" });
  }
  res.json({ message: "User updated", changes: result.affectedRows });
}
)
})
app.get('/albums', (req, res) => {
  db.query("SELECT *  FROM albums ORDER BY popularity DESC LIMIT 15", (err, result) => {
    if(err){ return res.status(500).json({ error: err })}
    res.json(result);    
  })
})
app.post('/addTrack', (req, res) => {
  const{playlistId, trackId} = req.body;
  if(trackId ===null || playlistId === null) return res.status(400).json({ message: "Any Tracks to adding!" })
    db.query("SELECT COUNT(*) FROM playlist_track WHERE id_playlist = ? AND id_track = ?", [playlistId, trackId], (err, result) => {
      if(err){ return res.status(500).json({ error: err })}
      if (result[0]["COUNT(*)"] > 0) {
        db.query("DELETE FROM playlist_track WHERE id_playlist = ? AND id_track = ?", [playlistId,trackId],(err, result=>{
          if(err){ return res.status(500).json({ error: err })}
          else{
            return res.json("Track deleted")
          }
        }))
      }
      if(result[0]["COUNT(*)"] === 0){
        db.query("INSERT INTO playlist_track (id_playlist, id_track) VALUES (?, ?)", [playlistId, trackId], (err, result) => {
          if(err){ return res.status(500).json({ error: err })}
          else{
            return res.json("Track added")
          }
        })
      }          
    })
})
app.post('/playlist', (req, res) => {
  const{playlistId} = req.body
  db.query("SELECT * FROM playlist_track WHERE id_playlist = ?", [playlistId], (err, result) => {
    if(err)return res.status(500).json({ error: err })
    res.json(result);    
  })
})    
app.listen(3000, () => {
  console.log("API is running on port 3000");
})