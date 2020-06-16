require('dotenv').config();

exports.getAutocomplete = async (req, res, next) => {
  const { startName } = req.params;
  const filteredData = module.exports.test_DB.filter((entry) => {
    // Some items have not translations yet
    return (entry.french !== undefined && entry.french.toString().startsWith(startName));
  });
  return res.send({ items: filteredData });
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
            image: trimmedImageURL ? trimmedImageURL[0] : null,
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

  Promise.all(promises).then(async () => {

    module.exports.test_DB = masterDIC;

    // Compute french translations
    const translationSheets = [`Furniture`, `Craft`, `ETC`, `Event Items`, `Art`,
      `Floors`, `Walls`, `Rugs`, `Fence`, `Bugs`, `Fish`, `Fossils`,
      `Dinosaurs`, `Shells`, `Accessories`, `Bags`, `Bottoms`, `Umbrella`,
      `Caps`, `Masks`, `Dresses`, `Shoes`, `Socks`, `Tops`, `Doorplates`, `Posters`, `Pictures`,
      `K.K. Albums`, `Tools`, `Plants`, `Bugs Models`, `Fish Models`, `House Door`, `House Roof`,
      `House Wall`, `House Mailbox`];
    const translationPromises = [];
    for (let i = 0; i < translationSheets.length; i++) {
      console.log(translationSheets[i])

      const opt = {
        spreadsheetId: '1BjqVeqIrfEezvyrWLUrwMjmK_UbY2LXkZ12mttamTtk',
        ranges: [`${translationSheets[i]}!H2:H`, `${translationSheets[i]}!A2:A`],
      }
      let data = gsapi.spreadsheets.values.batchGet(opt);
      translationPromises.push(data);
      await data.then((data3) => {
        const frenchTranslationsArray = data3.data.valueRanges[0].values;
        const itemsIdsArray = data3.data.valueRanges[1].values;
        frenchTranslationsArray.forEach((translatedText, index) => {
          const computeId = parseInt(itemsIdsArray[index].toString().split("_")[1]);
          module.exports.test_DB.forEach((item) => {
            if (item.id === computeId) {
              item["french"] = translatedText[0];
            }
          });
        });
      });
    }
    Promise.all(translationPromises).then(() => {
      return res.send(module.exports.test_DB);
    });
  });
}


exports.getDB = async (req, res, next) => {
  return res.send(module.exports.test_DB);
};

