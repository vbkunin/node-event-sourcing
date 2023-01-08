import Ajv2019 from 'ajv/dist/2019.js'
import addFormats from 'ajv-formats'
import { Path } from '../../path.js'
import { ErrorObject } from 'ajv/dist/types/index.js'
import { ValidationError } from 'ajv'
// note: import assertions still are experimental
import purchaseCreateBodySchema from './schemas/v1/purchase-create-body.schema.json' assert { type: 'json' }
import purchaseUpdateBodySchema from './schemas/v1/purchase-update-body.schema.json' assert { type: 'json' }
import debtsAcceptBodySchema from './schemas/v1/debts-accept-body.schema.json' assert { type: 'json' }
import debtsPayoffBodySchema from './schemas/v1/debts-payoff-body.schema.json' assert { type: 'json' }

const ajv = new Ajv2019.default({ allErrors: true, strict: 'log' })
addFormats.default(ajv)
ajv.addSchema(purchaseCreateBodySchema, Path.v1_purchase_create)
ajv.addSchema(purchaseUpdateBodySchema, Path.v1_purchase_update)
ajv.addSchema(debtsAcceptBodySchema, Path.v1_debts_accept)
ajv.addSchema(debtsPayoffBodySchema, Path.v1_debts_payoff)

export const validate = (schemaKey: string, data: any): void  => {
  const validate = ajv.getSchema(schemaKey)
  if (!validate) {
    throw new Error(`Validation schema '${schemaKey}' not found`)
  }
  if (!validate(data)) {
    throw new ValidationError(validate.errors as ErrorObject[])
  }
}

export { ValidationError } from 'ajv'