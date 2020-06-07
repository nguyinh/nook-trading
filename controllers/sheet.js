require('dotenv').config();

exports.getAutocomplete = async (req, res, next) => {
  var sheet_client = require('../app.js').sheet_client;
  const { startName } = req.params;

  const { google } = require('googleapis');

  const gsapi = google.sheets({ version: 'v4', auth: sheet_client });
    
  const allMatches = [];

  const frenchColumns = new Map();
  frenchColumns.set("Furniture", "H");
  frenchColumns.set("Furniture Variants", "I");
  frenchColumns.set("Furniture Patterns", "I");
  frenchColumns.set("Craft", "H");
  frenchColumns.set("ETC", "H");
  frenchColumns.set("Event Items", "H");
  frenchColumns.set("Art", "H");
  frenchColumns.set("Floors", "H");
  frenchColumns.set("Walls", "H");
  frenchColumns.set("Rugs", "H");
  frenchColumns.set("Fence", "H");
  frenchColumns.set("Bugs", "H");
  frenchColumns.set("Fish", "H");
  frenchColumns.set("Fossils", "H");

  const getPromises = [];


  frenchColumns.forEach((element, index) => {
    const opt = {
      spreadsheetId: '1BjqVeqIrfEezvyrWLUrwMjmK_UbY2LXkZ12mttamTtk',
      ranges: [`${index}!${element}2:${element}`, `${index}!A2:A`]
    }
    let data = gsapi.spreadsheets.values.batchGet(opt);
    getPromises.push(data);
    data.then((data2) => {
      // data2.data.valuesRanges contains an array [{values, range,...}, {{values, range,...}}]: [0] French names, [1] id's
      const frenchTranslationsArray = data2.data.valueRanges[0].values;
      const itemsIdsArray = data2.data.valueRanges[1].values;

      frenchTranslationsArray.forEach((translatedText, index) => {
        if (translatedText.toString().startsWith(startName)) {
          const computeId = parseInt(itemsIdsArray[index].toString().split("_")[1]);
          allMatches.push({id: computeId,  text: translatedText[0] });
        }
      });
    })
  });

  await Promise.all(getPromises);
  //console.log(allMatches);
  return res.send({ items: allMatches });

};
