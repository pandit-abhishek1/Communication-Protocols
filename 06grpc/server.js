const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './chat.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

let messages = [];

function SendMessage(call, callback) {
  messages.push(call.request);
  callback(null, { status: 'Message received' });
}

function StreamMessages(call) {
  // Send all previous messages
  messages.forEach(msg => call.write(msg));
  // Simulate new messages every 5s
  const interval = setInterval(() => {
    const msg = { user: 'Server', text: 'Hello at ' + new Date().toLocaleTimeString() };
    messages.push(msg);
    call.write(msg);
  }, 5000);

  call.on('cancelled', () => {
    clearInterval(interval);
  });
}

const server = new grpc.Server();
server.addService(chatProto.ChatService.service, {
  SendMessage,
  StreamMessages
});
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('gRPC server running at http://0.0.0.0:50051');
});