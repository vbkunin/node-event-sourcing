import User from '../models/User'
import Debt from '../models/Debt'

interface ListResponseBody<T> {
  entries: Array<T>
}

interface SingleResponseBody<T> {
  entry: T
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
  if (res.status !== 200) {
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

const Client = { authUser, getUserCredits, getUserDebts }
export default Client
