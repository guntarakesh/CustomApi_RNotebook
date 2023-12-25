const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser')
const Notes = require('../models/Note')
const { body, validationResult } = require('express-validator');

// Route-1 to get all the notes Using GET : "/api/notes/fetchallnotes" , Login Required 
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error Ocurred");
    }
})
// Route- to add the new notes Using POST : "/api/notes/addnote" , Login Required 
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title that that must contain min 3 characters').isLength({ min: 3 }),
    body('description', 'enter a desciption of minimum length 5').isLength({ min: 5 }),
], async (req, res) => {
    
    // if there are any errors in the validation return errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error Ocurred");
    }
})

// Route-3 to update an  existing note using : PUT : "/api/notes/updatenote" , Login Required 

router.put('/updatenote/:id', fetchuser , async (req,res)=>{
      try {
      const {title,description,tag} = req.body ;
      const updatenote = {};
      if(title) { updatenote.title = title };
      if(description) { updatenote.description = description };
      if(tag) { updatenote.tag = tag };

      var note = await Notes.findById(req.params.id);
      if(!note) { return  res.status(404).send("Not Found") }

      if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findByIdAndUpdate(req.params.id,{$set:updatenote},{new:true})
      res.json({note});
      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error Ocurred");
    }
})

// Route-4 Delete an Existing note using DELETE : "/api/auth/notes/deletenote" , Login Required

router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
   try {
    var note = await Notes.findById(req.params.id);

    // if note not found
    if(!note) { return  res.status(404).send("Not Found") }

   // if user trying to delete and the user related to the note are not same then return error
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ "Sucess":"Note has been Deleted" });
   } catch (error) {
    console.error(error.message);
    res.status(500).send("some error Ocurred");
}
})

module.exports = router; 