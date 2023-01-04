const app = require('./app')
const port =  4050;

app.listen(port, () => {
    console.log(`Serever is up on port ${port}`);
})