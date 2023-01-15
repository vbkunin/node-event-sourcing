import User from './models/User'
import Purchase from './models/Purchase'
import Debt from './models/Debt'

export const USERS: User[] = [
  {
    'id': 'f9147b15-b526-4816-ac54-86bbab378bea',
    'username': 'vladimir',
  },
  {
    'id': '6fb53e09-65c0-49c6-ae2d-aa4396146ffb',
    'username': 'ilya',
  },
  {
    'id': 'ce6331ff-004f-4d63-9c4d-d9e8e6e8d542',
    'username': 'vadim',
  },
]

export const PURCHASES: Purchase[] = [
  {
    'id': '83d77b7e-f7ab-4fa3-a42e-4ba1bf69deac',
    'title': 'Булочки',
    'date': '2023-01-09T12:33:17.313Z',
    'amount': 100.5,
    'payer': {
      'id': 'f9147b15-b526-4816-ac54-86bbab378bea',
      'username': 'vladimir',
    },
  },
]

export const DEBTS: Debt[] = [
  {
    'id': '2b6934fd-f4ef-43dc-8cb2-06a7947f9bf3',
    'purchaseId': '83d77b7e-f7ab-4fa3-a42e-4ba1bf69deac',
    'purchaseTitle': 'Булочки',
    'purchaseDate': '2023-01-09T12:33:17.313Z',
    'creditor': {
      'id': 'f9147b15-b526-4816-ac54-86bbab378bea',
      'username': 'vladimir',
    },
    'debtor': {
      'id': '6fb53e09-65c0-49c6-ae2d-aa4396146ffb',
      'username': 'ilya',
    },
    'amount': 33.5,
    'remains': 33.5,
    'accepted': false,
  },
  {
    'id': 'ae13089d-f3ea-49f5-ab2e-cf43c8d1cc89',
    'purchaseId': '83d77b7e-f7ab-4fa3-a42e-4ba1bf69deac',
    'purchaseTitle': 'Булочки',
    'purchaseDate': '2023-01-09T12:33:17.313Z',
    'creditor': {
      'id': 'f9147b15-b526-4816-ac54-86bbab378bea',
      'username': 'vladimir',
    },
    'debtor': {
      'id': 'ce6331ff-004f-4d63-9c4d-d9e8e6e8d542',
      'username': 'vadim',
    },
    'amount': 33.5,
    'remains': 33.5,
    'accepted': false,
  },
  {
    'id': '385a40a4-db30-486b-ac95-20b3750a6b5c',
    'purchaseId': '83d77b7e-f7ab-4fa3-a42e-4ba1bf69deac',
    'purchaseTitle': 'Булочки',
    'purchaseDate': '2023-01-09T12:33:17.313Z',
    'creditor': {
      'id': 'f9147b15-b526-4816-ac54-86bbab378bea',
      'username': 'vladimir',
    },
    'debtor': {
      'id': 'f9147b15-b526-4816-ac54-86bbab378bea',
      'username': 'vladimir',
    },
    'amount': 33.5,
    'remains': 0,
    'accepted': true,
  },
  {
    'id': '2b6934fd-f4ef-43dc-8cb2-06a7947f9bf4',
    'purchaseId': '83d77b7e-f7ab-4fa3-a42e-4ba1bf69deac',
    'purchaseTitle': 'Булочки',
    'purchaseDate': '2023-01-09T12:33:17.313Z',
    'creditor': {
      'id': '6fb53e09-65c0-49c6-ae2d-aa4396146ffb',
      'username': 'ilya',
    },
    'debtor': {
      'id': 'f9147b15-b526-4816-ac54-86bbab378bea',
      'username': 'vladimir',
    },
    'amount': 33.5,
    'remains': 33.5,
    'accepted': false,
  },
  {
    'id': '2b6934fd-f4ef-43dc-8cb2-06a7947f9bf5',
    'purchaseId': '83d77b7e-f7ab-4fa3-a42e-4ba1bf69deac',
    'purchaseTitle': 'Стики',
    'purchaseDate': '2023-01-09T12:33:17.313Z',
    'creditor': {
      'id': '6fb53e09-65c0-49c6-ae2d-aa4396146ffb',
      'username': 'ilya',
    },
    'debtor': {
      'id': 'f9147b15-b526-4816-ac54-86bbab378bea',
      'username': 'vladimir',
    },
    'amount': 710,
    'remains': 500,
    'accepted': false,
  },
]