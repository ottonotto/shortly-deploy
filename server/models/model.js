/**
 * You're not gonna need this file anymore after refactoring
 * since mongoose will provide you with a model
 */

const _ = require('lodash');
const { db } = require('../db');

const parseData = options => {
  return _.reduce(options, (parsed, value, key) => {
    parsed.string.push(`${key} = ?`);
    parsed.values.push(value);
    return parsed;
  }, { string: [], values: [] });
};

/**
 * Base class for all database models, written in ES6 class format. You should NOT refer
 * to this interface directly unless you are creating a new model subclass.
 * @param {string} tablename - The name of the table (as defined by table schema).
 */
class Model {
  constructor(tablename) {
    this.tablename = tablename;
  }

  /**
   * Gets all records in the table matching the specified conditions.
   * @param {Object} [options] - An object where the keys are column names and the
   * values are the current values to be matched.
   * @returns {Promise<Array>} A promise that is fulfilled with an array of objects
   * matching the conditions or is rejected with the the error that occurred during
   * the query.
   */
  getAll(options) {
    if (!options) {
      const queryString = `SELECT * FROM ${this.tablename}`;
      return db.query(queryString);
    }
    const parsedOptions = parseData(options);
    const queryString = `SELECT * FROM ${this.tablename} WHERE ${parsedOptions.string.join(' AND ')}`;
    return db.query(queryString, parsedOptions.values);
  }

  /**
   * Gets one record in the table matching the specified conditions.
   * @param {Object} options - An object where the keys are column names and the
   * values are the current values to be matched.
   * @returns {Promise<Object>} A promise that is fulfilled with one object
   * containing the object matching the conditions or is rejected with the the
   * error that occurred during the query. Note that even if multiple objects match
   * the conditions provided, only one will be provided upon fulfillment.
   */
  get(options) {
    const parsedOptions = parseData(options);
    const queryString = `SELECT * FROM ${this.tablename} WHERE ${parsedOptions.string.join(' AND ')} LIMIT 1`;
    return db.query(queryString, parsedOptions.values).then(results => results[0]);
  }

  /**
   * Creates a new record in the table.
   * @param {Object} options - An object with key/value pairs, where the keys should match
   * the column names and the values should be of the correct type for that table. See model
   * class definition for additional information about the schema.
   * @returns {Promise<Object>} A promise that is fulfilled with an object
   * containing the results of the query or is rejected with the the error that occurred
   * during the query.
   */
  create(options) {
    const queryString = `INSERT INTO ${this.tablename} SET ?`;
    return db.query(queryString, options);
  }

  /**
   * Updates a record(s) in the table.
   * @param {Object} options - An object where the keys are column names and the
   * values are the current values. All records in the table matching the options will be
   * updated.
   * @param {Object} values - An object where the keys are column names and the values
   * are the new values.
   * @returns {Promise<Object>} A promise that is fulfilled with an object
   * containing the results of the query or is rejected with the the error that occurred
   * during the query.
   */
  update(options, values) {
    const parsedOptions = parseData(options);
    const queryString = `UPDATE ${this.tablename} SET ? WHERE ${parsedOptions.string.join(' AND ')}`;
    return db.query(queryString, Array.prototype.concat(values, parsedOptions.values));
  }

  /**
   * Deletes a record or records in the table.
   * @param {Object} options - An object where the keys are column names and
   * the values are the current values. All rows in the table matching options will be
   * deleted.
   * @returns {Promise<Object>} A promise that is fulfilled with an object
   * containing the results of the query or is rejected with the the error that occurred
   * during the query.
   */
  delete(options) {
    const parsedOptions = parseData(options);
    const queryString = `DELETE FROM ${this.tablename} WHERE ${parsedOptions.string.join(' AND ')}`;
    return db.query(queryString, parsedOptions.values);
  }

  /**
   * Deletes all records in the table.
   * @returns {Promise<Object>} A promise that is fulfilled with an object
   * containing the results of the query or is rejected with the the error that occurred
   * during the query.
   */
  deleteAll() {
    const queryString = `TRUNCATE TABLE ${this.tablename}`;
    return db.query(queryString);
  }
}

module.exports = Model;
