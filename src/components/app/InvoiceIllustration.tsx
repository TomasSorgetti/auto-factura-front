import { useId } from 'react'

const paper =
  'M4 0H107Q111 0 111 4V141L105 137L99 141L93 137L87 141L81 137L75 141L69 137L63 141L57 137L51 141L45 137L39 141L33 137L27 141L21 137L15 141L9 137L0 141V4Q0 0 4 0Z'

export function InvoiceIllustration() {
  const id = useId()
  return (
    <svg className="invoice-art" viewBox="0 0 300 230" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="110" y2="141" gradientUnits="userSpaceOnUse">
          <stop stopColor="#315c48" />
          <stop offset=".54" stopColor="#1c3e30" />
          <stop offset="1" stopColor="#122c22" />
        </linearGradient>
      </defs>
      <g stroke="#5de1a3" opacity=".21" strokeDasharray="3 5">
        <path d="m5 157 126 52 160-94M31 95l150 60 108-62M50 184l153-88M98 210l150-87" />
      </g>
      {[52, 35, 18, 0].map((offset, i) => (
        <g key={offset} transform={`translate(0 ${offset})`}>
          <g className={`invoice-sheet sheet-${i}`}>
            <g transform="matrix(1.02 .43 -.76 .6 151 24)">
              <path
                d={paper}
                fill={i === 3 ? `url(#${id})` : ['#13271e', '#173527', '#204532'][i]}
                stroke={['#315a44', '#437558', '#639b76', '#93dbad'][i]}
                strokeWidth="1.5"
              />
              {i === 3 && (
                <g stroke="#9bd9b2">
                  <rect x="12" y="12" width="22" height="22" rx="3" />
                  <text
                    x="23"
                    y="28"
                    textAnchor="middle"
                    fill="#c6f7d5"
                    stroke="none"
                    fontSize="16"
                    fontWeight="600"
                  >
                    C
                  </text>
                  <text
                    x="44"
                    y="23"
                    fill="#bce9c9"
                    stroke="none"
                    fontFamily="monospace"
                    fontSize="9"
                    letterSpacing="1"
                  >
                    FACTURA
                  </text>
                  <path d="M45 30h44M12 45h86M12 94h86" opacity=".55" />
                  <path d="M12 56h37m26 0h23M12 66h53m11 0h22M12 76h32m32 0h22" strokeWidth="2" opacity=".65" />
                  <path d="M12 106h28m34 0h24" strokeWidth="3" />
                  {[0, 3, 6, 10, 14, 17, 21, 25, 29, 32].map((x) => (
                    <path key={x} d={`M${12 + x} 117v10`} strokeWidth={x % 2 ? 2.4 : 1.2} />
                  ))}
                </g>
              )}
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}
