import moment, { Moment } from "moment";
import React, { RefObject } from "react";
import { DataNode } from "antd/lib/tree";
import { Menu } from "config/menu";
import { Model } from "react3l-common";

export class TreeNode<T extends Model> implements DataNode {
  public title: string;
  public key: number;
  public item: Model;
  public children: TreeNode<T>[];
  public disabled: boolean;

  constructor(model?: T) {
    if (model) {
      this.key = model.id;
      this.item = { ...model };
      this.children = [];
      this.title = model.name;
      this.disabled = model.disabled;
    } else {
      this.title = "";
      this.key = null;
      this.children = [];
      this.item = {};
      this.disabled = false;
    }
  }
}

export enum ValidateStatus {
  success = "success",
  warning = "warning",
  error = "error",
  validating = "validating",
}

export const utilService = {
  useClickOutside(ref: RefObject<any>, callback: () => void) {
    const handleClickOutside = React.useCallback(
      (event) => {
        if (ref?.current && !ref?.current?.contains(event.target)) {
          if (typeof callback === "function") {
            callback();
          }
        }
      },
      [callback, ref]
    );

    React.useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return function cleanup() {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [callback, handleClickOutside, ref]);
  },

  buildTree<T extends Model>(
    listItem: T[],
    parent?: TreeNode<T>,
    keyNodes?: number[],
    tree?: TreeNode<T>[]
  ): [TreeNode<T>[], number[]] {
    tree = typeof tree !== "undefined" ? tree : [];
    parent = typeof parent !== "undefined" ? parent : new TreeNode();
    keyNodes = typeof keyNodes !== "undefined" ? keyNodes : [];

    var children = listItem
      .filter((child) => {
        return child.parentId === parent!.key;
      })
      .map((currentItem) => new TreeNode(currentItem));

    if (children && children.length) {
      if (parent.key === null) {
        tree = children;
      } else {
        parent.children = children;
        keyNodes.push(parent.key);
      }
      children.forEach((child) => {
        this.buildTree(listItem, child, keyNodes);
      });
    }

    return [tree, keyNodes];
  },

  setDisabledNode<T extends Model>(nodeId: number, tree: TreeNode<T>[]) {
    var filteredNode = tree.filter(
      (currentNode) => currentNode.key === nodeId
    )[0];
    if (filteredNode) {
      let index = tree.indexOf(filteredNode);
      tree[index].disabled = true;
      if (filteredNode.children && filteredNode.children.length > 0) {
        filteredNode.children.forEach((currentChildren) => {
          this.setDisabledNode(currentChildren.key, filteredNode.children);
        });
      }
    } else {
      tree.forEach((currentTree) => {
        if (currentTree.children && currentTree.children.length > 0) {
          this.setDisabledNode(nodeId, currentTree.children);
        }
      });
    }
  },

  setOnlySelectLeaf<T extends Model>(tree: TreeNode<T>[]) {
    if (tree && tree.length) {
      tree.forEach((currentNode) => {
        if (currentNode.item.hasChildren) {
          currentNode.disabled = true;
          this.setOnlySelectLeaf(currentNode.children);
        } else {
          currentNode.disabled = false;
        }
      });
    }
  },

  searchTreeNode(element: TreeNode<Model>, key: number): TreeNode<Model> {
    if (element.key === key) {
      return element;
    } else if (element.children != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = this.searchTreeNode(element.children[i], key);
      }
      return result;
    }
    return null;
  },

  searchTree(
    treeNodes: TreeNode<Model>[],
    listKeys: number[]
  ): TreeNode<Model>[] {
    const nodes: TreeNode<Model>[] = [];

    treeNodes.forEach((currentTree) => {
      listKeys.forEach((currentKey) => {
        const node = this.searchTreeNode(currentTree, currentKey);
        if (node) nodes.push(node);
      });
    });
    return nodes;
  },

  toMomentDate(date: string): Moment {
    return moment(date);
  },

  isEmpty(obj: any) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  },

  limitWord(input: string, max: number) {
    if (input?.length > max) {
      input = input.slice(0, max);
      const output: string = input + "...";
      return output;
    }
    return input;
  },

  uniqueArray(array: any[]) {
    return array.reduce((acc, current) => {
      const x = acc.find((item: any) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  },

  getValidateStatus(model: Model, field: string) {
    if (typeof model?.errors === "object" && model?.errors !== null) {
      if (Object.prototype.hasOwnProperty.call(model.errors, field)) {
        if (
          typeof model.errors[field] === "string" &&
          model.errors[field] !== ""
        ) {
          return ValidateStatus.error;
        }
      }
    }
    if (typeof model?.warnings === "object" && model?.warnings !== null) {
      if (Object.prototype.hasOwnProperty.call(model.warnings, field)) {
        if (
          typeof model.warnings[field] === "string" &&
          model.warnings[field] !== ""
        ) {
          return ValidateStatus.warning;
        }
      }
    }
    return null;
  },

  checkVisibleMenu(
    ...urls: string[]
  ): (object: Record<string, number>) => boolean {
    return (object: Record<string, number>) => {
      let display = false;
      if (urls.length > 0) {
        urls.forEach((item) => {
          if (Object.prototype.hasOwnProperty.call(object, item))
            display = true;
        });
      }
      return display;
    };
  },

  mapTreeMenu(tree: Menu[], mapper: Record<string, number>) {
    if (tree && tree.length > 0) {
      tree.forEach((item: Menu) => {
        const { link, children } = item;
        const regex = new RegExp("\\:\\w+");
        const modifiedLink = link.replace(regex, "*");
        item.show = false;

        if (children && children.length > 0) {
          const isShow = this.mapTreeMenu(children, mapper);
          item.show = isShow;
        } else {
          if (Object.prototype.hasOwnProperty.call(mapper, modifiedLink)) {
            item.show = true;
          } else {
            item.show = false;
          }
        }
      });
      return tree.filter((current) => current.show)[0] ? true : false;
    }
  },

  convertPathString(
    path: string,
    obj: { [x: string]: any } = {},
    value: string
  ): { [x: string]: any } {
    path = path.replace(/\[(\w+)\]/g, ".$1");
    const listPath = path.split(".");
    const lastIndex = listPath.length > 0 ? listPath.length - 1 : 0;
    listPath.reduce(function (o: any, s: string, index: number) {
      if (index === lastIndex) {
        return (o[s] = value);
      }
      if (s in o) {
        return o[s];
      }
      return (o[s] = {});
    }, obj);
    return obj;
  },
};
