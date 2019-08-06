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
  SimpleResponse,
  BasicCard,
  Button,
  Image,
  BrowseCarousel,
  BrowseCarouselItem,
  Suggestions,
  LinkOutSuggestion,
  MediaObject,
  Table,
  List,
  Carousel,
} = require('actions-on-google');
const functions = require('firebase-functions');

const app = actionssdk({debug: true});

app.intent('actions.intent.MAIN', (conv) => {
  conv.ask(`Hi! I can show you different types of responses.`);
  conv.ask(`Which would you like to see?`);
  conv.ask(new Suggestions([
    'Basic Card',
    'List',
    'Carousel',
    'Media Response',
    'Suggestion Chips',
    'Browsing Carousel',
    'Simple Response',
    'SSML',
  ]));
});

app.intent('actions.intent.TEXT', (conv, input) => {
  const query = input.toLowerCase();
  if (query === 'basic card') {
    return basicCard(conv);
  } else if (query === 'list') {
    return list(conv);
  } else if (query === 'simple response') {
    return simpleResponse(conv);
  } else if (query === 'browsing carousel') {
    return browsingCarousel(conv);
  } else if (query === 'ssml') {
    return ssml(conv);
  } else if (query === 'carousel') {
    return carousel(conv);
  } else if (query === 'advanced table') {
    return advancedTable(conv);
  } else if (query === 'simple table') {
    return simpleTable(conv);
  } else if (query === 'media response') {
    return mediaResponse(conv);
  } else if (query === 'suggestion chips') {
    return suggestionChips(conv);
  } else {
    conv.ask(`You didn't name a supported response!`);
    conv.ask(`Which one would you like to see?`);
    return;
  }
});

const simpleResponse = (conv) => {
  // [START asdk_js_simple_response]
  conv.ask(new SimpleResponse({
    speech: `Here's an example of a simple response. ` +
      `Which type of response would you like to see next?`,
    text: `Here's a simple response. ` +
      `Which response would you like to see next?`,
  }));
  // [END asdk_js_simple_response]
};

const ssml = (conv) => {
  // [START asdk_js_ssml_demo]
  conv.ask(`<speak>` +
    `Here are <say-as interpet-as="characters">SSML</say-as> examples.` +
    `Here is a buzzing fly ` +
    `<audio src="https://actions.google.com/sounds/v1/animals/buzzing_fly.ogg"></audio>` +
    `and here's a short pause <break time="800ms"/>` +
    `</speak>`);
  conv.ask('Which response would you like to see next?');
  // [END asdk_js_ssml_demo]
};

const basicCard = (conv) => {
  // [START asdk_js_basic_card]
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask(`Here's an example of a basic card.`);
  conv.ask(new BasicCard({
    text: `This is a basic card.  Text in a basic card can include "quotes" and
    most other unicode characters including emoji 📱.  Basic cards also support
    some markdown formatting like *emphasis* or _italics_, **strong** or
    __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other
    things like line  \nbreaks`, // Note the two spaces before '\n' required for
                                 // a line break to be rendered in the card.
    subtitle: 'This is a subtitle',
    title: 'Title: this is a title',
    buttons: new Button({
      title: 'This is a button',
      url: 'https://assistant.google.com/',
    }),
    image: new Image({
      url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
      alt: 'Image alternate text',
    }),
    display: 'CROPPED',
  }));
  conv.ask('Which response would you like to see next?');
  // [END asdk_js_basic_card]
};

const browsingCarousel = (conv) => {
  // [START asdk_js_browse_caro]
  if (!conv.screen
    || !conv.surface.capabilities.has('actions.capability.WEB_BROWSER')) {
    conv.ask('Sorry, try this on a phone or select the ' +
      'phone surface in the simulator.');
      conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask(`Here's an example of a browsing carousel.`);
  conv.ask(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'Title of item 1',
        url: 'https://example.com',
        description: 'Description of item 1',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Image alternate text',
        }),
        footer: 'Item 1 footer',
      }),
      new BrowseCarouselItem({
        title: 'Title of item 2',
        url: 'https://example.com',
        description: 'Description of item 2',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Image alternate text',
        }),
        footer: 'Item 2 footer',
      }),
    ],
  }));
  // [END asdk_js_browse_caro]
};

const suggestionChips = (conv) => {
  // [START asdk_js_suggestion_chips]
  if (!conv.screen) {
    conv.ask('Chips can be demonstrated on screen devices.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask('These are suggestion chips.');
  conv.ask(new Suggestions('Suggestion 1'));
  conv.ask(new Suggestions(['Suggestion 2', 'Suggestion 3']));
  conv.ask(new LinkOutSuggestion({
    name: 'Suggestion Link',
    url: 'https://assistant.google.com/',
  }));
  conv.ask('Which type of response would you like to see next?');
  // [END asdk_js_suggestion_chips]
};

const mediaResponse = (conv) => {
  // [START asdk_js_media_response]
  if (!conv.surface.capabilities
    .has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
      conv.ask('Sorry, this device does not support audio playback.');
      conv.ask('Which response would you like to see next?');
      return;
  }

  conv.ask('This is a media response example.');
  conv.ask(new MediaObject({
    name: 'Jazz in Paris',
    url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
    description: 'A funky Jazz tune',
    icon: new Image({
      url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
      alt: 'Album cover of an ocean view',
    }),
  }));
  conv.ask(new Suggestions(['Basic Card', 'List',
    'Carousel', 'Browsing Carousel']));
  // [END asdk_js_media_response]
};

// [START asdk_js_media_status]
app.intent('actions.intent.MEDIA_STATUS', (conv) => {
  const mediaStatus = conv.arguments.get('MEDIA_STATUS');
  let response = 'Unknown media status received.';
  if (mediaStatus && mediaStatus.status === 'FINISHED') {
    response = 'Hope you enjoyed the tune!';
  }
  conv.ask(response);
  conv.ask('Which response would you like to see next?');
});
// [END asdk_js_media_status]

const simpleTable = (conv) => {
  // [START asdk_js_table_simple]
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask('This is a simple table example.');
  conv.ask(new Table({
    dividers: true,
    columns: ['header 1', 'header 2', 'header 3'],
    rows: [
      ['row 1 item 1', 'row 1 item 2', 'row 1 item 3'],
      ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
    ],
  }));
  conv.ask('Which response would you like to see next?');
  // [END asdk_js_table_simple]
};

const advancedTable = (conv) => {
  // [START asdk_js_table_complex]
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask('This is a table with all the possible fields.');
  conv.ask(new Table({
    title: 'Table Title',
    subtitle: 'Table Subtitle',
    image: new Image({
      url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
      alt: 'Alt Text',
    }),
    columns: [
      {
        header: 'header 1',
        align: 'CENTER',
      },
      {
        header: 'header 2',
        align: 'LEADING',
      },
      {
        header: 'header 3',
        align: 'TRAILING',
      },
    ],
    rows: [
      {
        cells: ['row 1 item 1', 'row 1 item 2', 'row 1 item 3'],
        dividerAfter: false,
      },
      {
        cells: ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
        dividerAfter: true,
      },
      {
        cells: ['row 3 item 1', 'row 3 item 2', 'row 3 item 3'],
      },
    ],
    buttons: new Button({
      title: 'Button Text',
      url: 'https://assistant.google.com',
    }),
  }));
  conv.ask('Which response would you like to see next?');
  // [END asdk_js_table_complex]
};

const list = (conv) => {
  // [START asdk_js_list]
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }

  conv.ask('This is a list example.');
  // Create a list
  conv.ask(new List({
    title: 'List Title',
    items: {
      // Add the first item to the list
      'SELECTION_KEY_ONE': {
        synonyms: [
          'synonym 1',
          'synonym 2',
          'synonym 3',
        ],
        title: 'Title of First List Item',
        description: 'This is a description of a list item.',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Image alternate text',
        }),
      },
      // Add the second item to the list
      'SELECTION_KEY_GOOGLE_HOME': {
        synonyms: [
          'Google Home Assistant',
          'Assistant on the Google Home',
      ],
        title: 'Google Home',
        description: 'Google Home is a voice-activated speaker powered by ' +
          'the Google Assistant.',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Google Home',
        }),
      },
      // Add the third item to the list
      'SELECTION_KEY_GOOGLE_PIXEL': {
        synonyms: [
          'Google Pixel XL',
          'Pixel',
          'Pixel XL',
        ],
        title: 'Google Pixel',
        description: 'Pixel. Phone by Google.',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Google Pixel',
        }),
      },
    },
  }));
  // [END asdk_js_list]
};

// [START asdk_js_item_selected]
app.intent('actions.intent.OPTION', (conv, params, option) => {
  const SELECTED_ITEM_RESPONSES = {
    'SELECTION_KEY_ONE': 'You selected the first item',
    'SELECTION_KEY_GOOGLE_HOME': 'You selected the Google Home!',
    'SELECTION_KEY_GOOGLE_PIXEL': 'You selected the Google Pixel!',
  };
  conv.ask(SELECTED_ITEM_RESPONSES[option]);
  conv.ask('Which response would you like to see next?');
});
// [END asdk_js_item_selected]

const carousel = (conv) => {
  // [START asdk_js_caro]
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }

  conv.ask('This is a carousel example.');
  // Create a carousel
  conv.ask(new Carousel({
    title: 'Carousel Title',
    items: {
      // Add the first item to the carousel
      'SELECTION_KEY_ONE': {
        synonyms: [
          'synonym 1',
          'synonym 2',
          'synonym 3',
        ],
        title: 'Title of First Carousel Item',
        description: 'This is a description of a carousel item.',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Image alternate text',
        }),
      },
      // Add the second item to the carousel
      'SELECTION_KEY_GOOGLE_HOME': {
        synonyms: [
          'Google Home Assistant',
          'Assistant on the Google Home',
      ],
        title: 'Google Home',
        description: 'Google Home is a voice-activated speaker powered by ' +
          'the Google Assistant.',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Google Home',
        }),
      },
      // Add the third item to the carousel
      'SELECTION_KEY_GOOGLE_PIXEL': {
        synonyms: [
          'Google Pixel XL',
          'Pixel',
          'Pixel XL',
        ],
        title: 'Google Pixel',
        description: 'Pixel. Phone by Google.',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Google Pixel',
        }),
      },
    },
  }));
  // [END asdk_js_caro]
};

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
