const Hapi = require('@hapi/hapi');
const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');

const init = async () => {
  
  await connectDB();

  
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });


  server.route(categoryRoutes);

 
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
