import Editor from "@monaco-editor/react";

function ThemeDevelopment(props) {
  return (
    <>
      <Editor
        height="90vh"
        defaultLanguage="html"
        defaultValue="// some comment"
      />
    </>
  )
}

export default ThemeDevelopment;
