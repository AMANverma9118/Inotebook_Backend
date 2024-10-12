const express = require('express');
const router = express.Router();
const Note = require('../Schemas/Notes');
const fetchuser = require('../Middleware/Fetchuser')
const { body, validationResult } = require('express-validator');

//Route number 1 :It is used to get all the notes with the api /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route number 2 :It is used to add the notes with the api /api/notes/addnotes
router.post('/addnotes', fetchuser, [
    body('title', 'Enter Valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const Savenote = await note.save();

        res.json(Savenote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

//Route number 3 :It is used to update the notes with the api /api/notes/updatenotes
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        //Create a newNote Object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route number 4 :It is used to Delete the notes with the api /api/notes/deletenotes
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {

    try {
        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})
module.exports = router