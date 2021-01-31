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

    const dbUser = process.env.DB_USER ?? 'postgres'
    const dbPass = process.env.DB_PASS ?? 'docker'
    const dbHost = process.env.DB_HOST ?? 'localhost'
    const dbPort = process.env.DB_PORT ?? 5432
    const dbName = process.env.DB_NAME ?? 'umbriel-dev'

    this.schema = `test_${uuid()}`
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`
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
