const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user.routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.send('El servidor está vivo. Probá entrar a /api/user/registro');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
