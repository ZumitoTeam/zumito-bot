export const MyTextVideo: React.FC<{ text: string }> = ({ text }) => {
    return (
      <div style={{ fontSize: 100, color: 'white', background: 'black', height: '100%' }}>
        {text}
      </div>
    );
};