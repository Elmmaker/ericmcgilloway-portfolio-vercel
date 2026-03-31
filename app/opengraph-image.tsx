import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Eric McGilloway — Senior Motion Graphics Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [profileData, playfairBold, jetbrainsMono] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/profile-og.jpg')),
    readFile(join(process.cwd(), 'public/fonts/playfair-bold.woff')),
    readFile(join(process.cwd(), 'public/fonts/jetbrains-mono.woff')),
  ]);

  const profileSrc = `data:image/jpeg;base64,${profileData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #141210 0%, #0D0C0A 55%, #080705 100%)',
          padding: '64px 72px',
        }}
      >
        {/* Gold left-edge accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: 'linear-gradient(180deg, transparent 0%, #C5A455 30%, #C5A455 70%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* LEFT: Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            paddingRight: 56,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 3,
                height: 28,
                backgroundColor: '#C5A455',
                marginRight: 14,
                borderRadius: 2,
                flexShrink: 0,
                display: 'flex',
              }}
            />
            <span
              style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 11,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: '#C5A455',
              }}
            >
              Senior Motion Graphics Designer
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              fontFamily: '"Playfair Display"',
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 0.93,
              color: '#F0EDE6',
              marginBottom: 32,
              letterSpacing: '-1px',
              display: 'flex',
            }}
          >
            Eric McGilloway
          </div>

          {/* Gold rule */}
          <div
            style={{
              width: 160,
              height: 2,
              backgroundColor: '#C5A455',
              marginBottom: 28,
              display: 'flex',
            }}
          />

          {/* Tagline line 1 */}
          <div
            style={{
              fontSize: 19,
              color: '#8A8579',
              lineHeight: 1,
              marginBottom: 8,
              display: 'flex',
            }}
          >
            15+ years in broadcast television.
          </div>

          {/* Tagline line 2 */}
          <div
            style={{
              fontSize: 19,
              color: '#8A8579',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            Late night, documentary, streaming.
          </div>

          {/* URL */}
          <div
            style={{
              marginTop: 48,
              fontFamily: '"JetBrains Mono"',
              fontSize: 11,
              letterSpacing: '2.5px',
              color: '#55524C',
              display: 'flex',
            }}
          >
            ericmcgilloway.com
          </div>
        </div>

        {/* RIGHT: Profile photo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 256,
          }}
        >
          {/* Gold ring */}
          <div
            style={{
              width: 248,
              height: 248,
              borderRadius: '50%',
              border: '2px solid #C5A455',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
            }}
          >
            <img
              src={profileSrc}
              style={{
                width: 236,
                height: 236,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Playfair Display',
          data: playfairBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'JetBrains Mono',
          data: jetbrainsMono,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
}
