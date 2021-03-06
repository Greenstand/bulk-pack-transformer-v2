const axios = require('axios').default;

const config = require('../../config/config');

const WalletRegistration = ({
  wallet,
  first_name,
  last_name,
  phone = null,
  email = null,
  lat,
  lon,
  id,
  user_photo_url,
  v1_legacy_organization = null,
  key,
  registered_at = new Date().toISOString(),
}) =>
  Object.freeze({
    id,
    wallet,
    user_photo_url,
    first_name,
    last_name,
    phone,
    email,
    lat,
    lon,
    v1_legacy_organization,
    registered_at,
    bulk_pack_file_name: key,
  });

const createWalletRegistration = async (walletRegistrationObject) => {
  const {
    wallet,
    user_photo_url,
    first_name,
    last_name,
    phone,
    email,
    registered_at,
    lat,
    lon,
    bulk_pack_file_name,
  } = walletRegistrationObject;

  // put request to the treetracker api microservice
  const growerAccountObject = {
    wallet,
    first_name,
    last_name,
    email,
    phone,
    lat,
    lon,
    image_url: user_photo_url,
    first_registration_at: registered_at,
    bulk_pack_file_name,
  };

  const response = await axios.put(
    `${config.treetrackerApiUrl}/grower_accounts`,
    growerAccountObject,
  );
  const grower_account_id = response.data.id;

  // post to the field-data microservice
  await axios.post(`${config.treetrackerFieldDataUrl}/wallet-registration`, {
    ...walletRegistrationObject,
    grower_account_id,
  });
};

module.exports = {
  createWalletRegistration,
  WalletRegistration,
};
