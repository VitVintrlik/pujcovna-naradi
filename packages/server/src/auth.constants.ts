import { errors } from 'jose';

export enum JwtAlgorithm {
  EdDSA = 'EdDSA',
}

export enum JwtCurve {
  Ed25519 = 'Ed25519',
}

export const UNAUTHORIZED_MESSAGE = 'Pro tuto akci se musíte přihlásit.';
export const FORBIDDEN_MESSAGE = 'K této akci nemáte oprávnění.';

export const BEARER_SCHEME = 'bearer';
export const JWKS_REQUEST_TIMEOUT_MS = 5_000;
export const REQUIRED_CLAIMS = ['exp'];

// Only these mean "the caller's token is bad"; anything else (key set unreachable, ...) is a server fault.
export const INVALID_TOKEN_ERRORS = [
  errors.JWTExpired,
  errors.JWTClaimValidationFailed,
  errors.JWSSignatureVerificationFailed,
  errors.JWTInvalid,
  errors.JWSInvalid,
  errors.JOSEAlgNotAllowed,
  errors.JOSENotSupported,
  errors.JWKSNoMatchingKey,
  errors.JWKSMultipleMatchingKeys,
];
