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
      //console.log(allMatches);

      frenchTranslationsArray.forEach((translatedText, index) => {
        if (translatedText.toString().startsWith(startName)) {
          const computeId = parseInt(itemsIdsArray[index].toString().split("_")[1]);
          allMatches.push({id: computeId,  text: translatedText[0]});
        }
      });
    })
  });

  await Promise.all(getPromises);
  if (module.exports.test_DB) {
    allMatches.forEach((match) => {
      const filteredData = module.exports.test_DB.filter((item) => item.id === match.id);
      match.data = filteredData;
    });
    console.log(module.exports.test_DB);
  }
  return res.send({ items: allMatches });
};

// Feeds the GIANT DICTIONNARY


exports.generateDB = async (req, res, next) => {
  var sheet_client = require('../app.js').sheet_client;
  
  const { google } = require('googleapis');
  
  const gsapi = google.sheets({ version: 'v4', auth: sheet_client });
  const promises = [];

  const normalSheets = [`Housewares`, `Miscellaneous`, `Wall-mounted`, `Wallpaper`, `Floors`, `Rugs`, `Photos`, `Posters`, `Tools`, `Fencing`, `Fossils`, `Art`];
  const dressSheets = [`Tops`, `Bottoms`, `Dress-Up`, `Headwear`, `Accessories`, `Socks`, `Shoes`, `Bags`, `Umbrellas`];
  const musicSheet = `Music`;
  const animalSheets = [`Insects`, `Fish`];
  const otherSheet = `Other`;

  const allSheets = [...normalSheets, ...dressSheets, musicSheet, ...animalSheets, otherSheet];
  const masterDIC = [];
  allSheets.forEach((sheetName) => {
    const opt = {
      spreadsheetId: '1HnwVzCewf-b1MQ5Fj2FDfFsQqnFk6UQ5GpMkrAzsM6U',
      range: `${sheetName}`,
      valueRenderOption: "FORMULA"
    }
    let data = gsapi.spreadsheets.values.get(opt);
    promises.push(data);
    data.then((data2) => {
      const rawData = data2.data.values;
      let imgIndex = null;
      let buyIndex = null;
      let sellIndex = null;
      let idIndex = null;
      let idVariantIndex = null;
      rawData.forEach((row, index) => {
  
        if (index === 0) {
          // Some sheets have multiple Image rows
          let imageTag = `Image`;
          if (dressSheets.indexOf(sheetName) !== -1) {
            imageTag = `Storage Image`;
          } else if (animalSheets.indexOf(sheetName) !== -1) {
            imageTag = `Icon Image`;
          } else if (sheetName === musicSheet) {
            imageTag = `Album Image`;
          } else if (sheetName === otherSheet) {
            imageTag = `Inventory Image`
          }

          imgIndex = row.indexOf(imageTag);

          buyIndex = row.indexOf(`Buy`);
          sellIndex = row.indexOf(`Sell`);
          idIndex = row.indexOf(`Internal ID`);
          idVariantIndex = row.indexOf(`Variant ID`);
        } else {
          const trimmedImageURL = row[imgIndex].match(/https?:\/\/[\w\S][^"]+/);

          const objToAdd = {
            image: trimmedImageURL ? trimmedImageURL [0] : null,
            price: row[buyIndex],
            sell: row[sellIndex],
            id: row[idIndex],
          };
  
          if (idVariantIndex !== -1) {
            objToAdd.idVariant = row[idVariantIndex];
          }
          
          masterDIC.push(objToAdd);
        }
  
      }); 
    });
  });

  Promise.all(promises).then(() => {
    module.exports.test_DB = masterDIC;
    return res.send("OK");
  });

};
