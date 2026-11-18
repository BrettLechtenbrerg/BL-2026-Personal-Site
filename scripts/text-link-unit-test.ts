// Unit tests for src/lib/messaging/text-link.ts:  node --test --experimental-strip-types scripts/text-link-unit-test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isApple, showPhone, smsHref, telHref, twentyPhone, twentyPhoneValue, usPhone } from '../src/lib/messaging/text-link.ts';

test('US numbers in any common format become +1XXXXXXXXXX', () => {
  for (const raw of ['(801) 555-1234', '801.555.1234', '801-555-1234', '+1 801 555 1234', '18015551234', ' 8015551234 '])
    assert.equal(usPhone(raw), '+18015551234', raw);
});

test('anything that is not a real US number is refused', () => {
  for (const raw of ['', '555-1234', '801555123', '0015551234', '8011551234', '+44 20 7946 0958', 'call me', '801-555-1234 ext 5', null, 8015551234])
    assert.equal(usPhone(raw as unknown), null, String(raw));
});

test('Twenty phones field: US only, and missing pieces are fine', () => {
  assert.equal(twentyPhone({ primaryPhoneNumber: '8015551234', primaryPhoneCallingCode: '+1', primaryPhoneCountryCode: 'US' }), '+18015551234');
  assert.equal(twentyPhone({ primaryPhoneNumber: '8015551234' }), '+18015551234');
  assert.equal(twentyPhone({ primaryPhoneNumber: '2079460958', primaryPhoneCallingCode: '+44' }), null);
  assert.equal(twentyPhone({ primaryPhoneNumber: '' }), null);
  assert.equal(twentyPhone(null), null);
  assert.deepEqual(twentyPhoneValue('+18015551234'), { primaryPhoneNumber: '8015551234', primaryPhoneCountryCode: 'US', primaryPhoneCallingCode: '+1', additionalPhones: [] });
});

test('the Text link: Apple uses &body=, others ?body=, text is encoded, empty text adds nothing', () => {
  assert.equal(smsHref('+18015551234', 'Hi Sam, it\'s Brett & co. 100%?', true), 'sms:+18015551234&body=Hi%20Sam%2C%20it\'s%20Brett%20%26%20co.%20100%25%3F');
  assert.equal(smsHref('+18015551234', 'Hi', false), 'sms:+18015551234?body=Hi');
  assert.equal(smsHref('+18015551234', '   ', true), 'sms:+18015551234');
  assert.equal(telHref('+18015551234'), 'tel:+18015551234');
  assert.equal(showPhone('+18015551234'), '(801) 555-1234');
});

test('Apple devices are spotted from the browser', () => {
  assert.equal(isApple('Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X)'), true);
  assert.equal(isApple('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'), true);
  assert.equal(isApple('Mozilla/5.0 (Linux; Android 15; Pixel 9)'), false);
});
