/***@@@ BEGIN LICENSE @@@***/
/*───────────────────────────────────────────────────────────────────────────*\
│  Copyright (C) 2013 eBay Software Foundation                                │
│                                                                             │
│hh ,'""`.                                                                    │
│  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
│  |(@)(@)|  you may not use this file except in compliance with the License. │
│  )  __  (  You may obtain a copy of the License at                          │
│ /,'))((`.\                                                                  │
│(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
│ `\ `)(' /'                                                                  │
│                                                                             │
│   Unless required by applicable law or agreed to in writing, software       │
│   distributed under the License is distributed on an "AS IS" BASIS,         │
│   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
│   See the License for the specific language governing permissions and       │
│   limitations under the License.                                            │
\*───────────────────────────────────────────────────────────────────────────*/
/***@@@ END LICENSE @@@***/
'use strict';

var fs = require('fs'),
    bl = require('bl'),
    ParseStream = require('./lib/parseStream');
var once = require('once');


module.exports = {

    createParseStream: function (entityHandler) {
        return new ParseStream(entityHandler);
    },


    parse: function (file, entityHandler, callback) {
        var readStream, parseStream;
        callback = once(callback);

        // Create file read stream and deal with errors
        readStream = fs.createReadStream(file);
        readStream.on('error', callback);

        // Create parse stream, handle data events and errors
        parseStream = this.createParseStream(entityHandler);

        // Start processing
        readStream.pipe(parseStream).pipe(bl(function (err, result) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result.toString('utf8'));
            }
        }));
    }

};
