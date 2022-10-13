import notification, { ArgsProps } from "antd/lib/notification";
import { BehaviorSubject, Observable, Subject } from "rxjs";

notification.config({
  placement: "bottomRight",
});

export enum messageType {
  SUCCESS,
  WARNING,
  ERROR,
}

export interface IMessage {
  title?: string;
  description?: string;
  type?: messageType;
}

export class AppMessageService {
  success$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // success subject for app message
  error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // error subject for app message
  message$: Subject<IMessage> = new Subject(); // message subject for app message

  _success: () => Observable<boolean> = () =>
    this.success$ as Observable<boolean>; // expose get success$ Observable
  _error: () => Observable<boolean> = () => this.error$ as Observable<boolean>; // expose get error$ as Observable
  setSuccess: () => void = () => {
    this.success$.next(true);
  };
  setError: () => void = () => {
    this.error$.next(true);
  };

  setMessage: (message: IMessage) => void = (message: IMessage) => {
    this.message$.next(message);
  };

  messageFactory(content: IMessage) {
    const { type, description, title } = content;
    if (type === messageType.SUCCESS) {
      return notification.success({
        message: title,
        description,
      });
    }
    if (type === messageType.WARNING) {
      return notification.warn({
        message: title,
        description,
      });
    }
    if (type === messageType.ERROR) {
      return notification.error({
        message: title,
        description,
      });
    }
  }

  handleNotify(message: IMessage) {
    return (value: boolean) => {
      if (value) {
        this.messageFactory(message);
      }
    };
  }

  useCRUDMessage() {
    const notifyUpdateItemSuccess = (
      argsProps: ArgsProps = { message: "Cập nhật thành công" }
    ) => {
      return notification.success({
        ...argsProps,
      });
    }; // updateSuccess method

    const notifyUpdateItemError = (
      argsProps: ArgsProps = { message: "Cập nhật có lỗi" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // updateSuccess method

    const notifyBadRequest = (
      argsProps: ArgsProps = { message: "Lỗi dữ liệu" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyBadRequest method (400)

    const notifyUnAuthorize = (
      argsProps: ArgsProps = { message: "Lỗi phân quyền" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyUnAuthorize method (401)

    const notifyServerError = (argsProps?: ArgsProps) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyServerError method (502, 500)

    const notifyBEError = (
      argsProps: ArgsProps = { message: "Lỗi máy chủ" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyBEError method (420)

    const notifyIdleError = (
      argsProps: ArgsProps = { message: "Lỗi gateway" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyIdleError method (504)

    return {
      notifyUpdateItemSuccess,
      notifyUpdateItemError,
      notifyBadRequest,
      notifyUnAuthorize,
      notifyServerError,
      notifyBEError,
      notifyIdleError,
    };
  }
}

const appMessageService = new AppMessageService();
export default appMessageService;
