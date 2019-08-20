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

const {actionssdk} = require('actions-on-google');
const functions = require('firebase-functions');

const app = actionssdk({debug: true});

app.intent('actions.intent.MAIN', (conv) => {
  const savedColor = conv.user.storage.favoriteColor;
  if (savedColor) {
    conv.ask(`Hey there! I remember your favorite color is ${savedColor}`);
    conv.ask('Can you give me another color to remember?');
  } else {
    conv.ask(`Hey there! What's your favorite color?`);
  }
});

// [START asdk_js_guest_check]
app.intent('actions.intent.TEXT', (conv, input) => {
  if (conv.user.verification === 'VERIFIED') {
    conv.user.storage.favoriteColor = input;
    conv.close(`Alright, I'll remember that you like ${input}. See you!`);
  } else {
    conv.close(`${input} is my favorite too! I can't save that right now ` +
      `but you can tell me again next time!`);
  }
});
// [END asdk_js_guest_check]

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
