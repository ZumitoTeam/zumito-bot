// src/remotion/Video.tsx
import { Composition } from 'remotion';
import { MyTextVideo } from './MyTextVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyTextVideo"
        component={MyTextVideo}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ text: 'Hello World' }}
      />
    </>
  );
};
