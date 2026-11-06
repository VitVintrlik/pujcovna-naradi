import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from './lib/utils';

const HEADING_TAGS = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;

const headingVariants = cva('tracking-tight text-foreground', {
  variants: {
    level: {
      1: 'text-3xl font-bold',
      2: 'text-xl font-semibold',
      3: 'text-sm font-semibold',
    },
  },
  defaultVariants: {
    level: 1,
  },
});

type HeadingProps = ComponentProps<'h1'> & VariantProps<typeof headingVariants>;

export const Heading = ({ className, level, ...props }: HeadingProps) => {
  const Tag = HEADING_TAGS[level ?? 1];

  return <Tag className={cn(headingVariants({ level }), className)} {...props} />;
};
