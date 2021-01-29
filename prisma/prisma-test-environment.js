const { exec } = require('child_process')
const NodeEnvironment = require('jest-environment-node')
const { Client } = require('pg')
const util = require('util')
const { v4: uuid } = require('uuid')

const execSync = util.promisify(exec)

const prismaBinary = './node_modules/.bin/prisma'

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)

    this.schema = `test_${uuid()}`
    this.connectionString = `postgresql://postgres:docker@localhost:5432/umbriel-dev?schema=${this.schema}`
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    await execSync(`${prismaBinary} migrate deploy --preview-feature`)

    return super.setup()
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    })

    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
  }
}

module.exports = PrismaTestEnvironment
