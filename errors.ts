export class TaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskError';
  }
}

export class TaskParseError extends TaskError {
  constructor(message: string) {
    super(message);
    this.name = 'TaskParseError';
  }
}

export class TaskValidationError extends TaskError {
  constructor(message: string) {
    super(message);
    this.name = 'TaskValidationError';
  }
}

export class TaskFileError extends TaskError {
  constructor(message: string) {
    super(message);
    this.name = 'TaskFileError';
  }
}

export class VaultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VaultError';
  }
}