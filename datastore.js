const ds = require('@google-cloud/datastore');
const datastore = ds({projectId: process.env['GCLOUD_PROJECT']})

module.exports = datastore
