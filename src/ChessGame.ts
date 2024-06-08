
import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./const";
import { Game } from "./Game";

interface message_data {
  type:string;
  move?:{
    from:string;
    to:string;
  },


}

export class ChessGame {
  private games: Game[];
  private pendingUser: (WebSocket | null) = null ;
  private users : WebSocket[];

  constructor (){
    this.games=[];
    this.users=[];
  }

  addUser(socket:WebSocket){
    this.users.push(socket);
    this.handleAddUser(socket);
  }


  removeUser(socket:WebSocket){
    this.users.filter(users=>users!==socket);
    //Stop the game because user left?

  }

  handleAddUser(socket:WebSocket){
    socket.on("message",(data)=>{
      const message : message_data = JSON.parse(data.toString());
      if(message.type == INIT_GAME){
        if(this.pendingUser){
          const game = new Game(this.pendingUser,socket);
          this.games.push(game);
          this.pendingUser=null;
        } 
        else{
          this.pendingUser=socket;
        }

      }

      
    if(message.type==MOVE){
      interface movePlayed{
        from:string;
        to:string;
      }
      const game = this.games.find(game=> game.player1 === socket || game.player2==socket);
      
        if(game && message.move){
          
          game.makeMove(socket,message.move );
        }
    }
    })


  }

}