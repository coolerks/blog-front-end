// import {Modal, Popconfirm, Space} from "antd";
// import {Tag} from "antd";
//
//
// export const columns = [
//   {
//     title: '名称',
//     dataIndex: 'title',
//     formItemProps: {
//       rules: [
//         {
//           required: true,
//           message: '名称为必填项',
//         },
//       ],
//     }
//   },
//   {
//     title: '分类',
//     search: false,
//     dataIndex: 'category',
//     render: categories => {
//       return (
//         <>
//           {
//             categories.length === 0 ? (
//               <>无</>
//             ) : (
//               categories.map(it =>
//                 <Tag
//                   color={it.color === null ? "cyan" : it.color}
//                   key={it.id}>
//                   {it.name}
//                 </Tag>)
//             )
//           }
//         </>
//       )
//     }
//   },
//   {
//     title: '标签',
//     search: false,
//     dataIndex: 'tag',
//     render: tags => {
//       return (
//         <>
//           {
//             tags.length === 0 ? (
//               <>无</>
//             ) : (
//               tags.map(it =>
//                 <Tag
//                   color={it.color === null ? "volcano" : it.color}
//                   key={it.id}>
//                   {it.name}
//                 </Tag>)
//             )
//           }
//         </>
//       )
//     }
//   },
//   {
//     title: '时间',
//     search: false,
//     dataIndex: 'updateTime'
//   },
//   {
//     title: '操作',
//     search: false,
//     dataIndex: 'id',
//     render: (id, record) => {
//       record.isDelete = false;
//       function handlerDelete(id) {
//         console.log(id)
//       }
//       return (
//         <>
//           <Space size="middle">
//             <a>编辑</a>
//             <Popconfirm title="确定删除?" onConfirm={() => handlerDelete(id)}>
//               <a>删除</a>
//             </Popconfirm>
//           </Space>
//         </>
//       )
//     }
//   }
// ]
