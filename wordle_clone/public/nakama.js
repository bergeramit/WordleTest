import { Client } from "https://cdn.skypack.dev/@heroiclabs/nakama-js";
import { v4 as uuid } from "https://cdn.skypack.dev/@lukeed/uuid";

let connectedOpponents;

class Nakama {
    constructor() {
        this.client
        this.session
        this.socket // ep4
        this.matchID // ep4
        this.match_connected
    }

    async authenticate() {
        this.client = new Client("defaultkey", "64.226.100.123", "7350");
        this.client.ssl = false;
        this.match_connected = false;

        let deviceId = uuid();
        // let deviceId = localStorage.getItem("deviceId");
        // if (!deviceId) {
        //     deviceId = uuid();
        //     localStorage.setItem("deviceId", deviceId);
        // }

        this.session = await this.client.authenticateDevice(deviceId, true);
        localStorage.setItem("user_id", this.session.user_id);
        console.log("user id:"+this.session.user_id);

        // ep4
        const trace = false;
        this.socket = this.client.createSocket(this.useSSL, trace);
        await this.socket.connect(this.session);
        console.log("Authenticated!");

    }

    async findMatch(match_guess_target_callback) { // ep4 or create!
        const rpcid = "find_match";
        const matches = await this.client.rpc(this.session, rpcid, {});

        this.matchID = matches.payload.matchIds[0]
        await this.socket.joinMatch(this.matchID);
        console.log("Matched Joined! MatchId: " + this.matchID);
        toastr.success("Connected!");
        this.match_connected = true;
        match_guess_target_callback(this.matchID);
    }

    async makeMove(key_msg, callback) { // ep4
        if (this.match_connected == false) {
            toastr.error("Connect first!");
        } else {
            callback(key_msg, true);
            await this.socket.sendMatchState(this.matchID, 1, JSON.stringify({"key": key_msg, "user_id": this.session.user_id}));
            console.log("Match data sent");
        }
    }

    createSocket(callback) {
        this.socket.onmatchdata = (result) => {
          //console.log("Results: "+result.data);
          const json_string = new TextDecoder().decode(result.data)
          //console.log("json_string: "+json_string);
          const json = json_string ? JSON.parse(json_string): ""
          console.log("Got key: "+json.key);
          if (json.user_id != this.session.user_id) {
            callback(json.key, false);
            //document.dispatchEvent(new KeyboardEvent("keyup", { key: json }))
          }
        };
      }

    createPresenceNotification() {
        this.socket.onmatchpresence = (presences) => {
          // Remove all users who left.
          connectedOpponents = connectedOpponents.filter(function(co) {
            var stillConnectedOpponent = true;
        
            presences.leaves.forEach((leftOpponent) => {
              if (leftOpponent.user_id == co.user_id) {
                stillConnectedOpponent = false;
              }
            });
        
            return stillConnectedOpponent;
          });
        
          // Add all users who joined.
          connectedOpponents = connectedOpponents.concat(presences.joins);
          toastr.success("Joined match!");
        };
    }
}

export default new Nakama()
