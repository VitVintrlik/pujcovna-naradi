import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const CONTAINER_CLASS_NAME = 'mx-auto w-full max-w-6xl px-4 sm:px-6';

type AppShellProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export const AppShell = ({ header, footer, children }: AppShellProps) => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <header className="border-b border-border bg-card">
      <div className={cn(CONTAINER_CLASS_NAME, 'py-4')}>{header}</div>
    </header>
    <main className={cn(CONTAINER_CLASS_NAME, 'flex-1 py-10 sm:py-14')}>{children}</main>
    <footer className="border-t border-border bg-card">
      <div className={cn(CONTAINER_CLASS_NAME, 'py-5 text-sm text-muted-foreground')}>{footer}</div>
    </footer>
  </div>
);
