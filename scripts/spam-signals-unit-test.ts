// node --test --experimental-strip-types scripts/spam-signals-unit-test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spamReasonIn, isRandomWord, hasStuffedGmailDots } from '../src/lib/spam-signals.ts';

const person = { firstName: 'Maria', lastName: 'DeLaCruz', email: 'maria.delacruz@gmail.com', company: 'DeLaCruz Roofing', message: 'I would like Brett to speak at our event.' };

test('the Nov 8 2026 spam lead is caught', () => {
  assert.equal(spamReasonIn({ ...person, email: 'l.e.k.uv.i.m.o.v.u.j353@gmail.com', message: 'cveyQWXcRnQplXSeWVxDI' }), 'gmail-dot-stuffing');
  assert.equal(spamReasonIn({ ...person, contactEmail: 'l.e.k.uv.i.m.o.v.u.j353@gmail.com' }), 'gmail-dot-stuffing');
  assert.equal(spamReasonIn({ ...person, message: 'cveyQWXcRnQplXSeWVxDI' }), 'random-text-message');
  assert.equal(spamReasonIn({ name: 'RWxHkaUBcnVnHJPjsCHU', email: 'a@b.com' }), 'random-text-name');
  assert.equal(spamReasonIn({ ...person, firstName: 'qLpZmXwTyVbNrKs' }), 'random-text-firstName');
  assert.equal(spamReasonIn({ ...person, company: 'xQwErTyUiOpAsDf' }), 'random-text-company');
});

test('real people get through', () => {
  assert.equal(spamReasonIn(person), null);
  for (const name of ['McDonald', 'DeLaCruz', 'LaShawnDa', "O'Brien", 'Van Der Beek', 'MacKenzie-Smith', 'CHRISTOPHER', 'lechtenberg', 'Manny Torres']) {
    assert.equal(spamReasonIn({ ...person, name, firstName: name, lastName: name }), null, name);
  }
  for (const company of ['PricewaterhouseCoopers', 'YouTube', 'GoHighLevel', 'JPMorganChase', 'Total Success AI', 'eBay', 'LinkedIn']) {
    assert.equal(spamReasonIn({ ...person, company, business: company, organization: company }), null, company);
  }
  for (const message of ['', 'We use ChatGPT, PowerPoint and QuickBooks.', 'INTERESTED IN A WORKSHOP', 'See https://www.brettlechtenberg.com/masters-edge/workbookInfoPage']) {
    assert.equal(spamReasonIn({ ...person, message }), null, message);
  }
  for (const email of ['mary.j.van.dyke@gmail.com', 'j.r.smith+bl@gmail.com', 'a.b.c.d.e@company.com', 'brett@brettlechtenberg.com']) {
    assert.equal(spamReasonIn({ ...person, email }), null, email);
  }
});

test('fields that are not typed by a person are ignored, and odd input never throws', () => {
  assert.equal(spamReasonIn({ ...person, answers: { q1: 'aBcDeFgHiJkL' }, form_id: 'gewBookAbCdEfGh', result: 'xYzAbCdEfGh' }), null);
  assert.equal(spamReasonIn({}), null);
  assert.equal(spamReasonIn({ name: 42, email: null, message: undefined }), null);
  assert.equal(isRandomWord(''), false);
  assert.equal(hasStuffedGmailDots('not an email'), false);
});
