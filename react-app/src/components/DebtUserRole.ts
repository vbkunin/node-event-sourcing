export enum DebtUserRoleEnum {
  creditor = 'creditor',
  debtor = 'debtor'
}

export type DebtUserRole = DebtUserRoleEnum.creditor | DebtUserRoleEnum.debtor