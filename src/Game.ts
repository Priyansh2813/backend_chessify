import { WebSocket } from "ws";
import {Chess} from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./const";


export class Game {

  public player1:WebSocket;
  public player2:WebSocket;
  private board:Chess;
  private startTime = new Date();
  private moves : string[];
  

  constructor(player1:WebSocket,player2:WebSocket){
    this.player1 = player1;
    this.player2=player2;
    this.board = new Chess();
    this.moves=[];

    this.player1.send(JSON.stringify({
      type:INIT_GAME,
      payload:{
        color:"white"
      }
    }));
    this.player2.send(JSON.stringify({
      type:INIT_GAME,
      payload:{
        color:"black"
      }
    }))
     
  }

  makeMove(socket:WebSocket,move:{
    from:string;
    to:string
  }){
    //is it player turn
    if(socket==this.player1 && this.board.moves.length%2!=0){
      
      return;
    }
    if(socket==this.player2 && this.board.moves.length%2==0){
      
      return;
    }





    //is it a valid move
    try{
        this.board.move(move);
    }
    catch(error){
      console.log("Invalid Move");
      return;
    }

    if(this.board.isGameOver()){
      this.player1.send(JSON.stringify({
        type:GAME_OVER,
        payload:{
          winner: this.board.turn() === "w" ? "black":"white",

        }
      }))
    }
    //is it stalemate
    //is it checkmate

    // if game is not over let the other player know the moves

    if(this.board.moves.length%2===0){
      this.player2.send(JSON.stringify({
        type:MOVE,
        payload:move
      }))
    }
    else{
      this.player1.send(JSON.stringify({
        type:MOVE,
        payload:move
      }))
    }

  }


}