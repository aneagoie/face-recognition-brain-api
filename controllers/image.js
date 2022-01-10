const clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '658e138d87b94277990f7175c613f45b'
});
const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('Unable to work with api'))
}


const handleImage = (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json("Unable to get count of entries"));
}

module.exports = {
    handleImage: handleImage,
    handleApiCall
}