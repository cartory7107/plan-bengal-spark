const EDGE_FUNCTION_NETWORK_ERROR = 'Failed to send a request to the Edge Function';

export function normalizeEdgeFunctionError(error: unknown, fallbackMessage: string): string {
  const message = error instanceof Error ? error.message : String(error ?? '');

  if (message.includes(EDGE_FUNCTION_NETWORK_ERROR)) {
    return 'Could not reach the server right now. Please check your internet connection and try again.';
  }

  if (message.toLowerCase().includes('fetch')) {
    return 'Network request failed. Please retry in a moment.';
  }

  return message || fallbackMessage;
}
