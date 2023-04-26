import { Tree } from 'antd';
import { useEffect, useState } from 'react';
import { getCategoryByParentId } from '../../../api/category';

function Category(props) {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  useEffect(() => {
    loadingCategory(props.root);
  }, []);

  async function loadingCategory(id) {
    const result = await getCategoryByParentId(id);
    const { data } = result;
    setTreeData(() =>
      data.map((it) => ({
        title: it.name,
        key: it.id,
        isLeaf: it.childCount === 0,
      })),
    );
  }

  function dfs(obj, key) {
    for (let o of obj) {
      if (o.key === key) {
        return o;
      }
    }
    for (let o of obj) {
      if (o.children) {
        return dfs(o.children, key);
      }
    }
  }

  const onLoadData = ({ key, children }) => {
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      getCategoryByParentId(key).then((res) => {
        const { data } = res;
        setTreeData((pre) => {
          const child = data.map((it) => {
            return {
              title: it.name,
              key: it.id,
              isLeaf: it.childCount === 0,
            };
          });
          dfs(pre, key).children = child;
          return [...pre];
        });
      });
      resolve();
    });
  };

  return (
    <>
      <Tree
        checkable={props.checkable}
        onSelect={props.select}
        loadData={onLoadData}
        defaultCheckedKeys={checkedKeys}
        onCheck={props.onCheck}
        treeData={treeData}
      />
    </>
  );
}

export default Category;
