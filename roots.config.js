const path = require('path')

module.exports = {
    originDir: path.resolve(__dirname, 'src/roots'),
    localizedDir: path.resolve(__dirname, 'src/app/(routes)'),
    locales: ['en-US', 'fr-FR'],
    defaultLocale: 'en-US',
    prefixDefaultLocale: false, // serves "en-US" locale on / instead of /en-US
}
