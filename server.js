const express = require('express');
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/pizza-hunt' , {
useFindAndModify: false,
useNewUrlParser: true,
useUnifiedTopology: true
});

// This command logs mongo queries when they're executed
mongoose.set('debug',true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
