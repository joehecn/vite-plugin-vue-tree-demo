<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";

import { getNodeSize } from "vite-plugin-vue-tree";

// ---- mock data ----
let mockId = 10000;

const { width, height } = getNodeSize();
type Node = {
  id: string;
  parent: string | null;
  children: string[];
  width: number;
  height: number;
  label: string;
  data: {
    id: string;
    name: string;
    path: string;
    categoryId?: string;
  };
};
type Edge = {
  source: string;
  target: string;
  router: {
    name: string;
  };
};

type Model = {
  nodes: Node[];
  edges: Edge[];
};

const model = ref<Model>({
  // 节点
  nodes: [
    // category
    {
      // Cell
      id: "head_3", // String，可选，节点的唯一标识
      parent: null, // String，可选，节点的父节点标识
      children: [], // Array，可选，节点的子节点标识数组
      // tools: NODE_TOOLS, // Array，可选，节点的工具集合
      // Node
      width, // Number，可选，节点大小的 width 值
      height, // Number，可选，节点大小的 height 值
      // Rect
      label: "全部区域",
      // Cell 业务数据
      data: {
        id: "3",
        path: "3",
        name: "全部区域",
      },
    },

    // tree
    {
      // Cell
      id: "node_63", // String，可选，节点的唯一标识
      parent: null, // String，可选，节点的父节点标识
      children: [], // Array，可选，节点的子节点标识数组
      // tools: NODE_TOOLS, // Array，可选，节点的工具集合
      // Node
      width, // Number，可选，节点大小的 width 值
      height, // Number，可选，节点大小的 height 值
      // Rect
      label: "小区",
      // Cell 业务数据
      data: {
        id: "63",
        path: "63",
        name: "小区",
        categoryId: "3",
      },
    },
  ],
  // 边
  edges: [
    // {
    //   source: 'head_3',
    //   target: 'head_1001',
    //   router: {
    //     name: 'manhattan',
    //   }
    // },
  ],
});

const dialogFormVisible = ref(false);
const form = reactive({
  id: "",
  isHead: false,
  categoryId: "",
  name: "",
});

const findNode = (id: string) => {
  for (let i = 0; i < model.value.nodes.length; i++) {
    if (model.value.nodes[i].id === id) {
      return { node: model.value.nodes[i], index: i };
    }
  }

  return { node: null, index: -1 };
};

const removeEdge = (source: any, target: any) => {
  for (let i = 0; i < model.value.edges.length; i++) {
    if (
      model.value.edges[i]["source"] === source &&
      model.value.edges[i]["target"] === target
    ) {
      model.value.edges.splice(i, 1);
      return;
    }
  }
};

const onError = (error: Error) => {
  console.log("app catched from j-tree-view onError:");
  console.error(error);
};

const onRemove = ({ id }: { id: string }) => {
  // console.log("app catched from j-tree-view onRemove:", id);
  // // 这里可以有一些异步逻辑
  // const { node, index } = findNode(id);

  // if (node) {
  //   const parent = findNode(node.parent!);
  //   // 边 - 父 - 子
  //   // 1 删除边
  //   removeEdge(parent.node!.id, node.id);
  //   // 2 父节点 children
  //   parent.node!.children = parent.node!.children.filter(
  //     (child) => child !== node.id
  //   );
  //   // 3 删除节点
  //   model.value.nodes.splice(index, 1);
  // }
  console.log("app catched from j-tree-view onRemove:", id);
  ElMessageBox.confirm(
    "proxy will permanently delete the file. Continue?",
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      // 这里可以有一些异步逻辑
      const { node, index } = findNode(id);

      if (node) {
        const parent = findNode(node.parent!);
        // 边 - 父 - 子
        // 1 删除边
        removeEdge(parent.node!.id, node.id);
        // 2 父节点 children
        parent.node!.children = parent.node!.children.filter(
          (child) => child !== node.id
        );
        // 3 删除节点
        model.value.nodes.splice(index, 1);
      }
      ElNotification({
        type: "success",
        message: "Delete completed",
        position: "bottom-right",
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "Delete canceled",
        position: "bottom-right",
      });
    });
};

const appendNameCancel = () => {
  dialogFormVisible.value = false;

  ElNotification({
    type: "info",
    message: "Append canceled",
    position: "bottom-right",
  });
};
const appendName = () => {
  const { id, isHead, categoryId, name } = form;

  // 这里可以有一些异步逻辑
  const { node } = findNode(id);

  if (node) {
    const newId = ++mockId;
    const newNode: Node = {
      id: '',
      parent: id,
      children: [],
      width,
      height,
      label: name,
      data: {
        id: newId.toString(),
        name,
        path: `${node.data.path}.${newId}`,
      },
    };

    if (isHead) {
      newNode.id = `head_${newId}`;
    } else {
      newNode.id = `node_${newId}`;
      newNode.data.categoryId = categoryId;
    }

    const edge = {
      source: id,
      target: newNode.id,
      router: {
        name: "manhattan",
      },
    };
    // 子 - 父 - 边
    // 1 新节点
    model.value.nodes.push(newNode);
    // 2 父节点
    node.children.push(newNode.id);
    // 3 边
    model.value.edges.push(edge);
  }

  dialogFormVisible.value = false;

  ElNotification({
    type: "success",
    message: "Append completed",
    position: "bottom-right",
  });

  form.name = "";
};
const onAppend = async ({
  id,
  isHead,
  categoryId,
}: {
  id: string;
  isHead: boolean;
  categoryId: string;
}) => {
  // console.log("app catched from j-tree-view onAppend:", id);
  // // 这里可以有一些异步逻辑
  // const { node } = findNode(id);

  // if (node) {
  //   const newNode = JSON.parse(JSON.stringify(node));
  //   const newId = ++mockId;

  //   if (isHead) {
  //     newNode.id = `head_${newId}`;
  //   } else {
  //     newNode.id = `node_${newId}`;
  //     newNode.data.categoryId = categoryId;
  //   }
  //   newNode.parent = id;
  //   newNode.label = newNode.id;
  //   newNode.data.id = newId;
  //   newNode.data.path = `${node.data.path}.${newId}`;
  //   newNode.data.name = newNode.id;

  //   const edge = {
  //     source: id,
  //     target: newNode.id,
  //     router: {
  //       name: "manhattan",
  //     },
  //   };
  //   // 子 - 父 - 边
  //   // 1 新节点
  //   model.value.nodes.push(newNode);
  //   // 2 父节点
  //   node.children.push(newNode.id);
  //   // 3 边
  //   model.value.edges.push(edge);
  // }
  console.log("app catched from j-tree-view onAppend:", id);
  form.id = id;
  form.isHead = isHead;
  form.categoryId = categoryId;

  dialogFormVisible.value = true;
};
const onUpdate = async ({ id, value }: { id: string; value: string }) => {
  console.log("app catched from j-tree-view onUpdate:", id, value);
  // 这里可以有一些异步逻辑
  const { node } = findNode(id);

  if (node) {
    node.label = value;
  }
};
</script>

<template>
  <j-tree-view
    :model="model"
    @on-error="onError"
    @on-remove="onRemove"
    @on-append="onAppend"
    @on-update="onUpdate"
  ></j-tree-view>

  <el-dialog v-model="dialogFormVisible" title="Append">
    <el-form :model="form">
      <el-form-item label="Name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="appendNameCancel">Cancel</el-button>
        <el-button type="primary" @click="appendName">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>
