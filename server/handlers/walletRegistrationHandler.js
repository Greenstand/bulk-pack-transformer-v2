const log = require('loglevel');
const convertStringToUuid = require('uuid-by-string');

const {
  createWalletRegistration,
  WalletRegistration,
} = require('../models/WalletRegistration');

const walletRegistrationPost = async function (req, res, next) {
  log.log('/wallet_registrations');
  try {
    const { body } = req;
    await createWalletRegistration(WalletRegistration(body));
    log.log('/wallet_registrations done');
    res.status(200).json();
  } catch (e) {
    next(e);
  }
};

const LegacyPlanterPost = async function (req, res, next) {
  log.log('/v1/planter');
  try {
    const {
      planter_identifier,
      first_name,
      last_name,
      organization,
      device_identifier,
      image_url,
      lat,
      lon,
      key,
    } = req.body;

    let { phone } = req.body;
    let { email } = req.body;

    if (!phone && !email) {
      // digits regex expression, to check if identifier is a phone or email
      const reg = new RegExp('^\\d+$');

      if (reg.test(planter_identifier)) {
        phone = planter_identifier;
      } else {
        email = planter_identifier;
      }
    }

    const defaultImageUrl =
      'https://greenstand.org/fileadmin/02-graphics/12-externally-linked/no-planter-image.png';

    await createWalletRegistration(
      WalletRegistration({
        wallet: planter_identifier,
        id: convertStringToUuid(device_identifier + planter_identifier),
        first_name,
        last_name,
        phone,
        email,
        lat,
        lon,
        user_photo_url: image_url || defaultImageUrl,
        v1_legacy_organization: organization,
        key,
      }),
    );
    log.log('/v1/planter done');
    res.status(200).json();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  walletRegistrationPost,
  LegacyPlanterPost,
};
