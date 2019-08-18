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

// [START asdk_js_reprompt]
const {actionssdk} = require('actions-on-google');
const functions = require('firebase-functions');

const app = actionssdk({debug: true});

app.intent('actions.intent.MAIN', (conv) => {
  conv.ask(`Hi! Try this sample on a speaker device, ` +
    `and stay silent when the mic is open. If trying ` +
    `on the Actions console simulator, click the no-input ` +
    `button next to the text input field.`);
});

app.intent('actions.intent.TEXT', (conv, input) => {
  conv.ask(`You said ${input}`);
  conv.ask(`Try this sample on a speaker device, ` +
    `and stay silent when the mic is open. If trying ` +
    `on the Actions console simulator, click the no-input ` +
    `button next to the text input field.`);
});

app.intent('actions.intent.NO_INPUT', (conv) => {
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
    conv.ask(`What was that?`);
  } else if (repromptCount === 1) {
    conv.ask(`Sorry I didn't catch that. Could you repeat yourself?`);
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
    conv.close(`Okay let's try this again later.`);
  }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// [END asdk_js_reprompt]

