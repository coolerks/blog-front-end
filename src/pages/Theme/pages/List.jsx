import Editor from '@monaco-editor/react';

function List(props) {
  return (
    <>
      <Editor
        height="90vh"
        defaultLanguage="html"
        defaultValue="// some comment"
      />
    </>
  );
}

export default List;
