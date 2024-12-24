import { Html, useProgress } from '@react-three/drei';

const CanvasLoader = () => {
  const { progress, loaded, total } = useProgress();
  
  return (
    <Html
      as='div'
      center
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <span className='canvas-loader'></span>
      <p
        style={{
          fontSize: 14,
          color: '#F1F1F1',
          fontWeight: 800,
          marginTop: 20,
          textAlign: 'center'
        }}
      >
        {progress.toFixed(2)}%
        <br />
        {loaded} / {total} assets loaded
      </p>
    </Html>
  );
};

export default CanvasLoader;