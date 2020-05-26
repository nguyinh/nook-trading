const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const cred = require('../client_secret.json');



/* exports.TEST = async (req, res, next) => {
    try {
        const doc = new GoogleSpreadsheet('1BjqVeqIrfEezvyrWLUrwMjmK_UbY2LXkZ12mttamTtk');

        await promisify(doc.useServiceAccountAuth)(cred);
    
        const info = await promisify(doc.getInfo)();
        const sheet = info.worksheets[2];
      
      const rows = await promisify(sheet.getRows)({
        offset: 1
      });
  
      const test = rows.filter((row) => {
        return row.french.startsWith("b");
      });

      console.log(test);
      return res.send();
    } catch (err) {
      return next(err);
  }
}; */

exports.TEST = async (req, res, next) => {

  const { google } = require('googleapis');
  const keys = require('../client_secret.json');

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );

  // TODO AUTHORIZE ONLY ONCE
  client.authorize(async (err, tokens) => {
    if (err) {
      console.log(err);
    } else {
      console.log("SUCCES");
      const gsapi = google.sheets({ version: 'v4', auth: client });
    
      const opt = {
        spreadsheetId: '1BjqVeqIrfEezvyrWLUrwMjmK_UbY2LXkZ12mttamTtk',
        range: 'Rugs!H:H'
      }
    
      let data = await gsapi.spreadsheets.values.get(opt);
      const allRugs = [...data.data.values];
      console.log(allRugs.filter((rug) => rug.toString().startsWith('tapis T')));
    }
  });


};