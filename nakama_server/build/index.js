"use strict";
// Copyright 2020 The Nakama Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var rpcIdFindMatch = 'find_match';
function InitModule(ctx, logger, nk, initializer) {
    initializer.registerRpc(rpcIdFindMatch, rpcFindMatch);
    initializer.registerMatch(moduleName, {
        matchInit: matchInit,
        matchJoinAttempt: matchJoinAttempt,
        matchJoin: matchJoin,
        matchLeave: matchLeave,
        matchLoop: matchLoop,
        matchTerminate: matchTerminate,
        matchSignal: matchSignal,
    });
    logger.info('JavaScript logic loaded.');
}
// Copyright 2020 The Nakama Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var rpcFindMatch = function (ctx, logger, nk, payload) {
    if (!ctx.userId) {
        throw Error('No user ID in context');
    }
    var matches;
    try {
        //const query = `+label.open:1`;
        matches = nk.matchList(10, true, null, null, 1);
    }
    catch (error) {
        logger.error('Error listing matches: %v', error);
        throw error;
    }
    var matchIds = [];
    if (matches.length > 0) {
        // There are one or more ongoing matches the user could join.
        matchIds = matches.map(function (m) { return m.matchId; });
    }
    else {
        // No available matches found, create a new one.
        try {
            matchIds.push(nk.matchCreate(moduleName));
            logger.info("Created new Match");
        }
        catch (error) {
            logger.error('Error creating match: %v', error);
            throw error;
        }
    }
    var res = { matchIds: matchIds };
    return JSON.stringify(res);
};
var moduleName = "wordle_js";
var matchInit = function (ctx, logger, nk, params) {
    return {
        state: { presences: {}, emptyTicks: 0 },
        tickRate: 20,
        label: ''
    };
};
var matchJoin = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (p) {
        state.presences[p.sessionId] = p;
    });
    return {
        state: state
    };
};
var matchLeave = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (p) {
        delete (state.presences[p.sessionId]);
    });
    return {
        state: state
    };
};
var matchLoop = function (ctx, logger, nk, dispatcher, tick, state, messages) {
    // // If we have no presences in the match according to the match state, increment the empty ticks count
    // if (state.presences.length === 0) {
    //   state.emptyTicks++;
    // }
    // // If the match has been empty for more than 100 ticks, end the match by returning null
    // if (state.emptyTicks > 100) {
    //   return null;
    // }
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];
        dispatcher.broadcastMessage(4, message.data);
    }
    return {
        state: state
    };
};
var matchJoinAttempt = function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    logger.debug('%q attempted to join Lobby match', ctx.userId);
    return {
        state: state,
        accept: true
    };
};
// const matchJoin = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]) : { state: nkruntime.MatchState } | null {
// 	presences.forEach(function (presence) {
//         logger.debug('!!!!!!!!!!\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n!!!!!!!!!!!!!!!!!!!!');
//         logger.debug('%q j!!!!!!!!!!\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n!!!!!!!!!!!!!!!!!!!!', presence.username.length);
//         logger.debug('%q j!!!!!!!!!!\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n!!!!!!!!!!!!!!!!!!!!', presence.sessionId.length);
//         logger.debug('%q j!!!!!!!!!!\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n!!!!!!!!!!!!!!!!!!!!', presence.userId.length);
// 	  state.presences[presence.userId] = presence;
// 	  logger.debug('%q joined Lobby match', presence.userId);
// 	});
// 	return {
// 	  state
// 	};
//   }
// let matchLeave = function(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]) {
//     return {state};
// }
// let matchLoop = function(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, messages: nkruntime.MatchMessage[]) {
//     //logger.debug('Lobby match loop executed');
// 	return {
// 	  state
// 	};
// }
var matchTerminate = function (ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    return { state: state };
};
var matchSignal = function (ctx, logger, nk, dispatcher, tick, state) {
    return { state: state };
};
