import mongoose from 'mongoose';

const uri = 'mongodb://localhost/bamboo';

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((db) => console.log('mongoDB is connected'))
  .catch((err) => console.log(err));
