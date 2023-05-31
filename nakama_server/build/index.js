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
    if (!payload) {
        throw Error('Expects payload.');
    }
    var request = {};
    try {
        request = JSON.parse(payload);
    }
    catch (error) {
        logger.error('Error parsing json message: %q', error);
        throw error;
    }
    var matches;
    try {
        var query = "+label.open:1 +label.fast:0";
        matches = nk.matchList(10, true, null, null, 1, query);
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
            matchIds.push(nk.matchCreate("Daniel"));
        }
        catch (error) {
            logger.error('Error creating match: %v', error);
            throw error;
        }
    }
    var res = { matchIds: matchIds };
    return JSON.stringify(res);
};
