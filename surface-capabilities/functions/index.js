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

const {
  actionssdk,
  NewSurface,
  Suggestions,
  BasicCard,
} = require('actions-on-google');
const functions = require('firebase-functions');

const app = actionssdk({debug: true});

app.intent('actions.intent.MAIN', (conv) => {
  conv.ask(`Hi! I can help you understand surface capabilities.`);
  conv.ask(`What would you like to try?`);
  conv.ask(new Suggestions([
    'Current capabilities',
    'Transfer surface',
  ]));
});

app.intent('actions.intent.TEXT', (conv, input) => {
  const query = input.toLowerCase();
  if (query === 'current capabilities') {
    return currentCapabilities(conv);
  } else if (query === 'transfer surface') {
    return transfer(conv);
  } else {
    conv.ask(`I didn't get that.`);
    conv.ask(`What would you like to try?`);
    conv.ask(new Suggestions([
      'Current capabilities',
      'Transfer surface',
    ]));
    return;
  }
});

const currentCapabilities = (conv) => {
  // [START asdk_js_has_capability]
  const hasScreen =
    conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    // OR conv.screen;
  const hasAudio =
    conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
  const hasMediaPlayback =
    conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO');
  const hasWebBrowser =
    conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
  // Interactive Canvas must be enabled in your project to see this
  const hasInteractiveCanvas =
    conv.surface.capabilities.has('actions.capability.INTERACTIVE_CANVAS');
  // [END asdk_js_has_capability]

  conv.ask('Looks like your current device ' +
    (hasScreen ? 'has' : 'does not have') + ' the screen output capability, ' +
    (hasAudio ? 'has' : 'does not have') + ' the audio output capability, ' +
    (hasMediaPlayback ? 'has' : 'does not have') + ' the media capability, ' +
    (hasWebBrowser ? 'has' : 'does not have') + ' the browser capability, ' +
    (hasInteractiveCanvas ? 'has' : 'does not have') +
      ' the interactive canvas capability, ');
  conv.ask('What else would you like to try?');
  conv.ask(new Suggestions([
    'Transfer surface',
    'Current capabilities',
  ]));
};

const transfer = (conv) => {
  // [START asdk_js_screen_available]
  const screenAvailable =
    conv.available.surfaces.capabilities.has(
      'actions.capability.SCREEN_OUTPUT');
  // [END asdk_js_screen_available]

  // [START asdk_js_transfer_reason]
  if (conv.screen) {
    conv.ask(`You're already on a screen device.`);
    conv.ask('What else would you like to try?');
    conv.ask(new Suggestions([
      'Transfer surface',
      'Current capabilities',
    ]));
    return;
  } else if (screenAvailable) {
    const context =
      `Let's move you to a screen device for cards and other visual responses`;
    const notification = 'Try your Action here!';
    const capabilities = ['actions.capability.SCREEN_OUTPUT'];
    return conv.ask(new NewSurface({context, notification, capabilities}));
  } else {
    conv.ask('It looks like there is no screen device ' +
      'associated with this user.');
    conv.ask('What else would you like to try?');
    conv.ask(new Suggestions([
      'Transfer surface',
      'Current capabilities',
    ]));
  };
  // [END asdk_js_transfer_reason]
};

// [START asdk_js_transfer_accepted]
app.intent('actions.intent.NEW_SURFACE', (conv) => {
  if (conv.arguments.get('NEW_SURFACE').status === 'OK') {
    conv.ask('Welcome to a screen device!');
    conv.ask(new BasicCard({
      title: `You're on a screen device!`,
      text: `Screen devices support basic cards and other visual responses!`,
    }));
  } else {
    conv.ask(`Ok, no problem.`);
  }
  conv.ask('What else would you like to try?');
  conv.ask(new Suggestions([
    'Transfer surface',
    'Current capabilities',
  ]));
});
// [END asdk_js_transfer_accepted]

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
