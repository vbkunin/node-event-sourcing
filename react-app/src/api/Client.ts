import User from '../models/User'
import Debt from '../models/Debt'
import Purchase from '../models/Purchase'

interface ListResponseBody<T> {
  entries: Array<T>
}

interface SingleResponseBody<T> {
  entry: T
}

interface AcceptedResponseBody {
  acceptedAt: string|Date
}

interface ErrorResponseBody {
  message: string,
  error?: Array<object>
}

export class ClientError extends Error {
  private readonly _error: ErrorResponseBody

  constructor(message: string, error: ErrorResponseBody) {
    super(message)
    this._error = error
  }

  get error(): ErrorResponseBody {
    return this._error
  }
}

async function validateResponse(res: Response): Promise<Response> {
  if (!res.ok) {
    const error: ErrorResponseBody = await res.json()
    throw new ClientError(error.message, error)
  }
  return res
}

export async function authUser(username: string): Promise<User> {
  const res: Response = await fetch(`${process.env.REACT_APP_QUERY_API_URL}/v1/user/${username}/login`)
    .then(validateResponse)
  const body: SingleResponseBody<User> = await res.json()

  return body.entry
}

export async function getUserCredits(user: User, includeAccepted = false): Promise<Debt[]> {
  const accepted = includeAccepted ? 'true' : 'false'
  const res: Response = await fetch(`${process.env.REACT_APP_QUERY_API_URL}/v1/debt?accept=${accepted}&creditor-id=${user.id}`)
    .then(validateResponse)
  const body: ListResponseBody<Debt> = await res.json()

  return body.entries
}

export async function getUserDebts(user: User, includeAccepted = false): Promise<Debt[]> {
  const accepted = includeAccepted ? 'true' : 'false'
  const res: Response = await fetch(`${process.env.REACT_APP_QUERY_API_URL}/v1/debt?accept=${accepted}&debtor-id=${user.id}`)
    .then(validateResponse)
  const body: ListResponseBody<Debt> = await res.json()

  return body.entries
}

export async function getUsers(): Promise<User[]> {
  const res: Response = await fetch(`${process.env.REACT_APP_QUERY_API_URL}/v1/user`)
    .then(validateResponse)
  const body: ListResponseBody<User> = await res.json()

  return body.entries
}

export async function createPurchase(purchase: Purchase, payer: User, debtors: User[]): Promise<boolean> {
  const data = {
    ...purchase,
    payer: payer.username,
    debtors: debtors.map(debtor => debtor.username)
  }

  const res: Response = await fetch(`${process.env.REACT_APP_COMMAND_API_URL}/v1/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(validateResponse)

  const body: AcceptedResponseBody = await res.json()

  return !!body.acceptedAt
}

export async function payoffDebts(user: User, debts: Debt[]): Promise<boolean> {
  const data = { debts: debts.map<string>(debt => debt.id) }

  const res: Response = await fetch(`${process.env.REACT_APP_COMMAND_API_URL}/v1/payoff-debts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(validateResponse)

  const body: AcceptedResponseBody = await res.json()

  return !!body.acceptedAt
}

export async function acceptDebts(user: User, debts: Debt[]): Promise<boolean> {
  const data = { debts: debts.map<string>(debt => debt.id) }

  const res: Response = await fetch(`${process.env.REACT_APP_COMMAND_API_URL}/v1/accept-debts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(validateResponse)

  const body: AcceptedResponseBody = await res.json()

  return !!body.acceptedAt
}

const Client = { authUser, getUsers, getUserCredits, getUserDebts, createPurchase, payoffDebts, acceptDebts }
export default Client
