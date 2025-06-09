let mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://faisals:1eHnAJrelnOCQnV7@cluster0.jhrpgyy.mongodb.net/Portfolio_Tracker?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true ,
  ssl: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

