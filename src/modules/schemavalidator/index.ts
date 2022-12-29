import Ajv2019 from 'ajv/dist/2019.js'
import addFormats from 'ajv-formats'
import { Path } from '../../path.js'
// note: import assertions still are experimental
import payoffDebtsSchema from './schemas/v1/payoff-debts.schema.json' assert { type: 'json' }
import acceptDebtsSchema from './schemas/v1/accept-debts.schema.json' assert { type: 'json' }

export const ajv = new Ajv2019.default({ allErrors: true, strict: 'log' })
addFormats.default(ajv)
ajv.addSchema(payoffDebtsSchema, Path.v1_payoff_debts)
ajv.addSchema(acceptDebtsSchema, Path.v1_accept_debts)
