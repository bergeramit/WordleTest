const moduleName = "wordle_js";

const matchInit = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, params: {[key: string]: string}): {state: nkruntime.MatchState, tickRate: number, label: string} {
    return {
      state: { presences: {}, emptyTicks: 0 },
      tickRate: 20, // 1 tick per second = 1 MatchLoop func invocations per second
      label: ''
    };
  };
  
  const matchJoin = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]) : { state: nkruntime.MatchState } | null {
    presences.forEach(function (p) { 
      state.presences[p.sessionId] = p;
    });
  
    return {
      state
    };
  }
  
  const matchLeave = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]) : { state: nkruntime.MatchState } | null {
    presences.forEach(function (p) {
      delete(state.presences[p.sessionId]);
    });
  
    return {
      state
    };
  }
  
  const matchLoop = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, messages: nkruntime.MatchMessage[]) : { state: nkruntime.MatchState} | null {
    // // If we have no presences in the match according to the match state, increment the empty ticks count
    // if (state.presences.length === 0) {
    //   state.emptyTicks++;
    // }
  
    // // If the match has been empty for more than 100 ticks, end the match by returning null
    // if (state.emptyTicks > 100) {
    //   return null;
    // }

    for (const message of messages) {
        dispatcher.broadcastMessage(4, message.data);
    }
  
    return {
      state
    };
  }

  const matchJoinAttempt = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presence: nkruntime.Presence, metadata: {[key: string]: any }) : {state: nkruntime.MatchState, accept: boolean, rejectMessage?: string | undefined } | null {
	logger.debug('%q attempted to join Lobby match', ctx.userId);
  
	return {
	  state,
	  accept: true
	};
  }

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

let matchTerminate = function(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, graceSeconds: number) {
    return { state };
}

let matchSignal = function(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState) {
    return { state };
}