'use client';

import { SiNike, SiAdidas, SiPuma, SiNewbalance, SiJordan, SiReebok } from 'react-icons/si';
import styles from './BrandPattern.module.css';

export default function BrandPattern() {
  const brands = [
    { Icon: SiNike, color: '#FF0000' },
    { Icon: SiAdidas, color: '#000000' },
    { Icon: SiPuma, color: '#0066FF' },
    { Icon: SiNewbalance, color: '#CC0000' },
    { Icon: SiJordan, color: '#FF6600' },
    { Icon: SiReebok, color: '#EE1C25' },
  ];

  return (
    <div className={styles.pattern}>
      {Array.from({ length: 80 }).map((_, i) => {
        const Brand = brands[i % brands.length];
        const row = Math.floor(i / 10);
        const col = i % 10;
        return (
          <Brand.Icon
            key={i}
            className={styles.icon}
            style={{ 
              color: Brand.color,
              left: `${col * 200}px`,
              top: `${row * 200}px`
            }}
          />
        );
      })}
    </div>
  );
}
