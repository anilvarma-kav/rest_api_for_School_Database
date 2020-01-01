var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, err) => {
    res.json({
        'msg': 'User Created'
    });
});

module.exports = router;
