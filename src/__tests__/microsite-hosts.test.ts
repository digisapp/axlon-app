import { describe, it, expect } from 'vitest';
import { isAppHost, normalizeHost } from '@/lib/microsites/config';

// This pair decides whether a request renders the marketplace or a microsite.
// A false positive here 404s a lead-gen domain; a false negative routes
// axleyard.com into the microsite resolver and takes the whole app down.

describe('normalizeHost', () => {
  it('lowercases, strips the port and strips www', () => {
    expect(normalizeHost('XLTrailers.com')).toBe('xltrailers.com');
    expect(normalizeHost('www.xltrailers.com')).toBe('xltrailers.com');
    expect(normalizeHost('WWW.XLTrailers.com:443')).toBe('xltrailers.com');
    expect(normalizeHost('xltrailers.com:3000')).toBe('xltrailers.com');
  });

  it('does not eat a label that merely starts with "www"', () => {
    expect(normalizeHost('wwwtrailers.com')).toBe('wwwtrailers.com');
  });

  it('keeps an IPv6 literal intact rather than truncating at the first colon', () => {
    expect(normalizeHost('[::1]:3000')).toBe('[::1]');
  });

  it('handles missing input', () => {
    expect(normalizeHost(null)).toBe('');
    expect(normalizeHost(undefined)).toBe('');
    expect(normalizeHost('')).toBe('');
  });
});

describe('isAppHost', () => {
  it('claims the marketplace and AXLON hosts', () => {
    expect(isAppHost('axleyard.com')).toBe(true);
    expect(isAppHost('www.axleyard.com')).toBe(true);
    expect(isAppHost('axlon.ai')).toBe(true);
    expect(isAppHost('www.axlon.ai')).toBe(true);
  });

  it('claims preview and local hosts, so previews never resolve as microsites', () => {
    expect(isAppHost('axlon-app-git-main-digis.vercel.app')).toBe(true);
    expect(isAppHost('localhost:3000')).toBe(true);
    expect(isAppHost('127.0.0.1:3000')).toBe(true);
  });

  it('treats owned lead-gen domains as microsites', () => {
    expect(isAppHost('xltrailers.com')).toBe(false);
    expect(isAppHost('www.tagtrailers.com')).toBe(false);
    expect(isAppHost('haletrailers.com')).toBe(false);
  });

  it('fails closed to the app when there is no Host header', () => {
    expect(isAppHost(null)).toBe(true);
    expect(isAppHost('')).toBe(true);
  });

  it('is not fooled by a host that merely ends with an app domain', () => {
    expect(isAppHost('notaxleyard.com')).toBe(false);
    expect(isAppHost('axleyard.com.evil.test')).toBe(false);
    expect(isAppHost('fakevercel.app')).toBe(false);
  });
});
