import type { FirebaseError } from 'firebase/app';

export function toUserMessage(err: unknown): string {
  const code = (err as FirebaseError)?.code;
  const msg = (err as FirebaseError)?.message;

  switch (code) {
    case 'functions/unauthenticated':
      return 'Please sign in to spin the wheel.';
    case 'functions/deadline-exceeded':
    case 'functions/unavailable':
      return 'Network issue. Please try again.';
    case 'functions/invalid-argument':
      return 'Invalid request. Please try again.';
    case 'functions/failed-precondition':
      return 'Service is not ready. Please try again later.';
    default:
      return msg || 'Unexpected error. Please try again.';
  }
}
