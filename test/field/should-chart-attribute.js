QUnit.module('shouldChartAttribute');

// the year I didn't get what I wanted for xmas
var startDate = new Date(1990, 11, 25);

QUnit.test('shouldChartAttribute returns false if no stats', function (assert) {
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeString', undefined);
  assert.notOk(result);
  // TODO: test other field types here?
});

QUnit.test('shouldChartAttribute returns false if duration <= 0', function (assert) {
  const stats = {
    duration: 0
  };
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeString', stats);
  assert.notOk(result);
  // TODO: test other field types/counts here?
});

QUnit.test('shouldChartAttribute returns false if count === 0', function (assert) {
  const stats = {
    count: 0,
    duration: 543
  };
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeString', stats);
  assert.notOk(result);
  // TODO: test other field types/durations here?
});

QUnit.test('shouldChartAttribute returns false for date/time fields that have supportsSqlExpression=false', function (assert) {
  const stats = {
    count: 1234,
    duration: 543
  };
  const options = {
    advancedQueryCapabilities: {
      supportsSqlExpression: false
    }
  };
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeDate', stats, options);
  assert.notOk(result);
});

QUnit.test('shouldChartAttribute returns true for date/time fields that have supportsSqlExpression=true && pass timeHeuristics', function (assert) {
  const stats = {
    count: 1234,
    duration: 543,
    min: startDate,
    max: new Date(2005, 11, 25)
  };
  const options = {
    advancedQueryCapabilities: {
      supportsSqlExpression: true
    }
  };
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeDate', stats, options);
  assert.ok(result);
});

QUnit.test(`shouldChartAttribute returns true for date/time fields that do not have supportsSqlExpression,
  but that have a maxRecordCount < 10000 && recordCount < maxRecordCount && pass timeHeuristics`, function (assert) {
  const stats = {
    count: 1234,
    duration: 543,
    min: startDate,
    max: new Date(2005, 11, 25)
  };
  const options = {
    maxRecordCount: 6000,
    recordCount: 5000
  };
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeDate', stats, options);
  assert.ok(result);
});

QUnit.test(`shouldChartAttribute returns false when recordCount exceeds 10000`, function (assert) {
  const stats = {
    count: 1234,
    duration: 543,
    min: startDate,
    max: new Date(2005, 11, 25)
  };
  const options = {
    maxRecordCount: 50000,
    recordCount: 10001
  };
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeDate', stats, options);
  assert.notOk(result);
});

QUnit.test(`shouldChartAttribute returns false when recordCount exceeds maxRecordCount`, function (assert) {
  const stats = {
    count: 1234,
    duration: 543,
    min: startDate,
    max: new Date(2005, 11, 25)
  };
  const options = {
    maxRecordCount: 1000,
    recordCount: 5000
  };
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeDate', stats, options);
  assert.notOk(result);
});

QUnit.test('shouldChartAttribute returns true for string field w/ duration > 0 and count < 20', function (assert) {
  const stats = {
    count: 20,
    duration: 543
  };
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeString', stats);
  assert.ok(result);
});

QUnit.test('shouldChartAttribute returns true for numeric field w/ duration > 0 and count < 0', function (assert) {
  const stats = {
    count: 1234,
    duration: 543
  };
  // integer
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeInteger', stats);
  assert.ok(result);
  // double
  result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeDouble', stats);
  assert.ok(result);
});

QUnit.test('shouldChartAttribute returns false for numeric field w/ min and max 0', function (assert) {
  const stats = {
    count: 1234,
    duration: 543,
    min: 0,
    max: 0
  };
  // integer
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeInteger', stats);
  assert.notOk(result);
});

QUnit.test('shouldChartAttribute returns true when either min/max is non-zero', function (assert) {
  const stats = {
    count: 1234,
    duration: 543,
    min: 0,
    max: 123456
  };
  // integer
  let result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeInteger', stats);
  assert.ok(result);
  stats.max = 0;
  stats.min = -12345;
  // double
  result = opendataChartUtils.field.shouldChartAttribute('esriFieldTypeDouble', stats);
  assert.ok(result);
});
