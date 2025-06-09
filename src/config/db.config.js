let mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Portfolio_Tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

