import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const printCss = readFileSync(new URL('../src/styles/print.css', import.meta.url), 'utf8');

describe('print theme', () => {
  it('defines the centralized light print palette without obsolete blue accents', () => {
    expect(printCss).toContain('--print-background: #ffffff');
    expect(printCss).toContain('--print-text: var(--color-graphite)');
    expect(printCss).toContain('--print-muted: var(--color-slate)');
    expect(printCss).toContain('--print-accent: var(--color-copper)');
    expect(printCss).toContain('--print-link: var(--color-graphite)');
    expect(printCss).toContain('--print-border: var(--color-nickel)');
    expect(printCss).not.toMatch(/#(?:084daf|1769e0|dceaff|853f20)|deep-copper/i);
  });

  it('adds CV dynamics with a restrained Copper experience marker', () => {
    expect(printCss).toMatch(
      /#cv-experience::before\s*\{[^}]*background:\s*var\(--print-accent\)/s,
    );
  });

  it('removes availability from print while preserving the shared web markup', () => {
    expect(printCss).toMatch(/\.availability-status\s*\{[^}]*display:\s*none\s*!important/s);
  });

  it('uses compact text treatments for technologies, stages, contacts, and links', () => {
    expect(printCss).toMatch(/\.tags\s*\{[^}]*display:\s*block/s);
    expect(printCss).toMatch(/\.tags li\s*\{[^}]*display:\s*inline/s);
    expect(printCss).toContain(".contact-chip[href^='mailto:']::after");
    expect(printCss).toMatch(/\.stage\s*\{[^}]*border:\s*0/s);
    expect(printCss).toMatch(/\.project-card\s*\{[^}]*break-inside:\s*auto/s);
  });
});
