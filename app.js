const express = require('express');
const app = express();
const imageRoutes = require('./api/routes/masking');
app.use('/masking', imageRoutes);
app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports = app;