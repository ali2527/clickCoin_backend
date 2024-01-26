const socketIO = require("socket.io");
const User = require("../Models/User")

let io; // Declare io as a global variable

function initializeWebSocket(server) {
  io = socketIO(server, {
    pingTimeout: 60000,
    cors: true,
    origin: ["*"],
  });

  io.on(
    "connection",
    (socket) => {
      console.log("Connected to socket.io");
  
      socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("User Joined Room:", userData._id);
        socket.emit("connected");
      });

      socket.on("setupAdmin", (userData) => {
        socket.join("admin");
        console.log("Admin Joined Room");
        socket.emit("connected");
      });
  
      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });
      // socket.on("typing", (room) => socket.in(room).emit("typing"));
      // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
      socket.on("new message", async (newMessageRecieved) => {
        var chat = newMessageRecieved.chatId;
  
     
          newMessageRecieved.sender = await User.findById(
            newMessageRecieved.sender
          );
          newMessageRecieved.reciever = await User.findById(
            newMessageRecieved.reciever
          );
      
  
        console.log(newMessageRecieved);
  
        if (!newMessageRecieved.reciever){
          return console.log("newMessageRecieved.reciever not defined");
        }
  
        socket.in(newMessageRecieved.reciever._id.toString()).emit("message", newMessageRecieved);
      });
  
      //   // socket.off("setup", () => {
      //   //   socket.leave(userData._id);
      //   // });
  
      socket.on("disconnect", () => {
        console.log("User Disconnected");
      });
    },
    []
  );
  
}

module.exports = {
  initializeWebSocket,
  getIO: () => io, // Export a function to get the io instance
};