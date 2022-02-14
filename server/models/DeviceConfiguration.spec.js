const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { default: axios } = require('axios');
chai.use(sinonChai);

const expect = chai.expect;
const {
  DeviceConfiguration,
  createDeviceConfiguration,
} = require('./DeviceConfiguration');
const config = require('../../config/config');

describe('DeviceConfiguration Model', () => {
  it('DeviceConfiguration Models should return defined fields', () => {
    const deviceConfiguration = DeviceConfiguration({});
    expect(deviceConfiguration).to.have.keys([
      'id',
      'device_identifier',
      'brand',
      'model',
      'device',
      'serial',
      'hardware',
      'manufacturer',
      'app_build',
      'app_version',
      'os_version',
      'sdk_version',
      'logged_at',
    ]);
  });

  it('should make a call to the deviceConfiguration external API endpoint', async () => {
    const deviceObject = { micCheck: '1 2' };

    let axiosStub, fieldDataUrlStub;

    axiosStub = sinon.stub(axios, 'post');
    fieldDataUrlStub = sinon.stub(config, 'treetrackerFieldDataUrl');

    fieldDataUrlStub.get(() => 'fieldDataUrl');
    await createDeviceConfiguration(deviceObject);
    expect(axiosStub).calledWith(
      'fieldDataUrl/device-configuration',
      deviceObject,
    );
    axiosStub.restore();
    fieldDataUrlStub.restore();
  });
});
