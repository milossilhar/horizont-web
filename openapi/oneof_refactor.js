const _ = require('lodash');
const crypto = require('crypto');
const fs = require('fs');

class OpenAPIOneOfRefactor {
  constructor(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    this.openApiDoc = JSON.parse(fileContent);

    // Ensure components/schemas exists
    _.set(this.openApiDoc, 'components.schemas', _.get(this.openApiDoc, 'components.schemas', {}));

    this.oneOfSchemas = new Map();
    this.schemaNameCounter = 1;
  }

  // Generate hash for oneOf schema to identify duplicates
  generateSchemaHash(schema) {
    const normalized = this.normalizeSchema(schema);
    return crypto.createHash('md5').update(JSON.stringify(normalized)).digest('hex');
  }

  // Normalize schema for comparison using lodash
  normalizeSchema(obj) {
    if (_.isArray(obj)) {
      return _.sortBy(obj.map(item => this.normalizeSchema(item)), JSON.stringify);
    }

    if (_.isObject(obj)) {
      const normalized = {};
      _.keys(obj).sort().forEach(key => {
        normalized[key] = this.normalizeSchema(obj[key]);
      });
      return normalized;
    }

    return obj;
  }

  // Generate meaningful name for oneOf schema
  generateSchemaName(schema) {
    const refNames = [];

    if (schema.oneOf) {
      schema.oneOf.forEach(item => {
        if (item.$ref) {
          const refName = _.last(item.$ref.split('/'))?.replace(/DTO$/, '');
          if (refName) refNames.push(refName);
        }
      });
    }

    if (refNames.length > 0) {
      if (_.includes(refNames, 'EnumerationItem')) {
        return 'EnumerationItemAggregateDTO';
      }

      const baseName = refNames.join('Or');
      let schemaName = `${baseName}DTO`;
      let counter = 1;

      while (_.has(this.openApiDoc, `components.schemas.${schemaName}`)) {
        schemaName = `${baseName}DTO${counter}`;
        counter++;
      }

      return schemaName;
    }

    // Fallback to generic name
    let schemaName = `OneOfSchema${this.schemaNameCounter}`;
    while (_.has(this.openApiDoc, `components.schemas.${schemaName}`)) {
      this.schemaNameCounter++;
      schemaName = `OneOfSchema${this.schemaNameCounter}`;
    }
    this.schemaNameCounter++;

    return schemaName;
  }

  // Recursively find and collect all oneOf schemas
  collectOneOfSchemas(obj, path = '') {
    if (!_.isObject(obj)) return;

    if (_.isArray(obj)) {
      obj.forEach((item, index) => {
        this.collectOneOfSchemas(item, `${path}[${index}]`);
      });
      return;
    }

    // Check if the current object is a oneOf schema
    if (_.has(obj, 'oneOf') && _.isArray(obj.oneOf)) {
      const hash = this.generateSchemaHash(obj);

      if (!this.oneOfSchemas.has(hash)) {
        const schemaName = this.generateSchemaName(obj);
        this.oneOfSchemas.set(hash, { schema: obj, hash, name: schemaName });

        // Add to components/schemas
        _.set(this.openApiDoc, `components.schemas.${schemaName}`, _.cloneDeep(obj));

        console.log(`Found oneOf schema at ${path}, created: ${schemaName}`);
      }
    }

    // Recursively process all properties
    _.forEach(obj, (value, key) => {
      const newPath = path ? `${path}.${key}` : key;
      this.collectOneOfSchemas(value, newPath);
    });
  }

  // Replace oneOf schemas with $ref references
  replaceOneOfWithRef(obj) {
    if (!_.isObject(obj)) return obj;

    if (_.isArray(obj)) {
      return obj.map(item => this.replaceOneOfWithRef(item));
    }

    // Check if current object is a oneOf schema that should be replaced
    if (_.has(obj, 'oneOf') && _.isArray(obj.oneOf)) {
      const hash = this.generateSchemaHash(obj);

      // Find the schema name for this hash
      const schemaEntry = this.oneOfSchemas.get(hash);
      if (schemaEntry) {
        console.log(`Replacing oneOf with $ref to ${schemaEntry.name}`);
        return { $ref: `#/components/schemas/${schemaEntry.name}` };
      }
    }

    // Recursively process all properties using lodash mapValues
    return _.mapValues(obj, value => this.replaceOneOfWithRef(value));
  }

  // Process the OpenAPI document
  process() {
    console.log('Collecting oneOf schemas...');
    this.collectOneOfSchemas(this.openApiDoc.paths);

    console.log(`Found ${this.oneOfSchemas.size} unique oneOf schemas`);

    console.log('Replacing oneOf instances with $ref...');
    this.openApiDoc.paths = this.replaceOneOfWithRef(this.openApiDoc.paths);

    console.log('Processing complete!');
  }

  // Save the processed OpenAPI document
  save(outputPath) {
    const outputContent = JSON.stringify(this.openApiDoc, null, 2);
    fs.writeFileSync(outputPath, outputContent, 'utf8');
    console.log(`Saved processed OpenAPI document to: ${outputPath}`);
  }

  // Get statistics about the processing
  getStats() {
    return {
      uniqueOneOfSchemas: this.oneOfSchemas.size,
      totalSchemas: _.keys(_.get(this.openApiDoc, 'components.schemas', {})).length
    };
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node oneof-refactor.js <input-file> [output-file]');
    console.error('Example: node oneof-refactor.js input.json output.json');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || inputFile;

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' does not exist`);
    process.exit(1);
  }

  try {
    console.log(`Processing OpenAPI file: ${inputFile}`);

    const refactor = new OpenAPIOneOfRefactor(inputFile);
    refactor.process();
    refactor.save(outputFile);

    const stats = refactor.getStats();
    console.log(`\nStatistics:`);
    console.log(`- Unique oneOf schemas found: ${stats.uniqueOneOfSchemas}`);
    console.log(`- Total schemas in components/schemas: ${stats.totalSchemas}`);

  } catch (error) {
    console.error('Error processing file:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = { OpenAPIOneOfRefactor };