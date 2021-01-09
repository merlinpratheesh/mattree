import {FlatTreeControl} from '@angular/cdk/tree';
import {Component} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface MainSection {
  name: string;
  section?: MainSection[];
}

const TREE_DATA: MainSection[] = [
  {
    name: 'Fruit',
    section: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, 
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
private _transformer = (node: MainSection, level: number) => {
  return {
    expandable: !!node.section && node.section.length > 0,
    name: node.name,
    level: level,
  };
}

treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.section);

dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

constructor() {
  this.dataSource.data = TREE_DATA;
}

hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}


/**  Copyright 2020 Google LLC. All Rights Reserved.
  Use of this source code is governed by an MIT-style license that
  can be found in the LICENSE file at http://angular.io/license */