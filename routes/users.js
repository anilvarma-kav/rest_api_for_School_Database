var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.json({
        'user': 'Authenticated User',
    })
});

router.post('/', (req, res) => {
    res.json({
        'user': 'User Created',
    });
});
module.exports = router;
