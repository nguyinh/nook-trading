const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const cred = require('../models/client_secret.json');



exports.TEST = async (req, res, next) => {
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
  };