import React from 'react'
import { Icon } from '@iconify/react';

export default function ResultRow({ type, url }) {
  function copyUrl(u) {
    navigator.clipboard.writeText(u)
  }

  const truncateUrl = u => {
    let letters = u.split('');
    if (letters.length > 20) {
      letters.splice(30, letters.length - 20, '...');
    }
    return letters.join('');
  }

  const dynamicIcon = i => `fa-brands:${i}`

  return (
    <div className="result-row">
      <div className="badge">
        <Icon icon={dynamicIcon(type)} />
      </div>
      <div className="url">{truncateUrl(url)}</div>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => copyUrl(url)}
        className="clipboard">
        {<Icon icon="bi:clipboard-check" />}
      </div>
    </div>
  )
}