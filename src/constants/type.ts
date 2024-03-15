export interface IUserInfo {
  key: string;
  name: string;
  sex: number | '';
  age: number | '';
  createdAt: string;
}

export interface IUserDialogOptions {
  onOk?: (record: IUserInfo) => void;
}

export interface IUserDialogMethodProps {
  options?: IUserDialogOptions;
  record?: IUserInfo;
}

export interface IUserDialogRef {
  create: (data: IUserDialogMethodProps) => void;
  edit: (data: IUserDialogMethodProps) => void;
  show: (data: IUserDialogMethodProps) => void;
}
