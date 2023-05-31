import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuid } from 'uuid';

class Nakama {
    constructor() {
        this.client
        this.session
        this.socket // ep4
        this.matchID // ep4
    }

    async authenticate() {
        this.client = new Client("defaultkey", "localhost", "7350");
        this.client.ssl = false;

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
    }

    // async createMatch() { // ep4
    //     var match = await this.socket.createMatch();
    //     //this.matchID = matches.payload.matchIds[0]
    //     //await this.socket.joinMatch(this.matchID);
    //     console.log("Matched Created! MatchId: " + match.match_id);
    // }

    async makeMove(key_msg) { // ep4
        await this.socket.sendMatchState(this.matchID, 4, JSON.stringify(key_msg));
        console.log("Match data sent")
    }
}

export default new Nakama()