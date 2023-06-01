import { Client } from "https://cdn.skypack.dev/@heroiclabs/nakama-js";
import { v4 as uuid } from "https://cdn.skypack.dev/@lukeed/uuid";

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

    async findMatch() { // ep4 or create!
        const rpcid = "find_match";
        const matches = await this.client.rpc(this.session, rpcid, {});

        this.matchID = matches.payload.matchIds[0]
        await this.socket.joinMatch(this.matchID);
        console.log("Matched Joined! MatchId: " + this.matchID);
        toastr.success("Connected!");
        this.match_connected = true;
    }

    async makeMove(key_msg, callback) { // ep4
        if (this.match_connected == false) {
            toastr.error("Connect first!");
        } else {
            callback(key_msg);
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
            callback(json.key);
            //document.dispatchEvent(new KeyboardEvent("keyup", { key: json }))
          }
        };
      }
}

export default new Nakama()
