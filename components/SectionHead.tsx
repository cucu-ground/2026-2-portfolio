import Link from 'next/link';
import { DecryptText } from './DecryptText';
import { ArrowRight } from './icons';

export function SectionHead({
  index,
  title,
  desc,
  action,
  as = 'h2',
}: {
  index?: string;
  title: string;
  desc?: string;
  action?: { href: string; label: string };
  as?: 'h1' | 'h2';
}) {
  return (
    <div className="sec-head">
      <div>
        {index && <span className="sec-index">{index}</span>}
        <DecryptText as={as} text={title} className="sec-title" />
        {desc && <p className="sec-desc">{desc}</p>}
      </div>
      {action && (
        <Link href={action.href} className="more-link">
          {action.label} <ArrowRight />
        </Link>
      )}
    </div>
  );
}
