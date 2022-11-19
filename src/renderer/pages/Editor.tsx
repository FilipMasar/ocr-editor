import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';

const Editor: FC = () => {
  const [urlSearchParams] = useSearchParams();

  return (
    <div>
      <h1>Editor</h1>
      <p>index: {urlSearchParams.get('index')}</p>
      <p>image: {urlSearchParams.get('image')}</p>
      <p>alto: {urlSearchParams.get('alto')}</p>
    </div>
  );
};

export default Editor;
