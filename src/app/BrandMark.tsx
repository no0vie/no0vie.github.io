import React from 'react';
import { basePath } from './routes';

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-mark${className ? ` ${className}` : ''}`} aria-hidden="true">
      <img src={basePath('branding/logo.svg')} alt="" />
    </span>
  );
}
