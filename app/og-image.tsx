import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'black',
          color: 'white',
          fontSize: 60,
          fontWeight: 'bold',
        }}
      >
        Deshawn Goodwyn
        <div style={{ fontSize: 30, marginTop: 20 }}>
          Basketball • Piano • Tech
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}