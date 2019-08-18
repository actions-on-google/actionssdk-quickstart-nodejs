// Copyright 2019, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START asdk_js_exit]
const {actionssdk} = require('actions-on-google');
const functions = require('firebase-functions');

const app = actionssdk({debug: true});

app.intent('actions.intent.MAIN', (conv) => {
  conv.ask(`Hi! Try saying 'exit' or 'cancel'`);
});

app.intent('actions.intent.TEXT', (conv, input) => {
  conv.ask(`You said ${input}`);
  conv.ask(`Try saying 'exit' or 'cancel'`);
});

app.intent('actions.intent.CANCEL', (conv) => {
  conv.close(`Okay, talk to you next time!`);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// [END asdk_js_exit]

