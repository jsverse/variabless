import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import ts from 'typescript';

// @ts-ignore
import variablessTypes from '!!raw-loader!@ngneat/variabless/types.d.ts';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { buildVariables } from '@ngneat/variabless/buildVariables';
import * as monaco from 'monaco-editor';
import { MarkerSeverity } from 'monaco-editor';

import { exampleCode } from './example';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('tsEditor', { static: true }) private tsEditorContainer: ElementRef;
  @ViewChild('cssEditor', { static: true }) private cssEditorContainer: ElementRef;
  animateArrows = false;
  copyText = 'Copy code';

  private tsEditor: monaco.editor.IStandaloneCodeEditor;
  private cssEditor: monaco.editor.IStandaloneCodeEditor;
  private previousResult: string;

  ngOnInit() {
    this.initEditors();
    this.listenToValueChanges();
    this.listenToResize();
    this.buildVariables();
  }

  copyCode() {
    this.copyText = 'Copied!';
    navigator.clipboard.writeText(this.tsEditor.getValue()).then(() => {
      setTimeout(() => {
        this.copyText = 'Copy code';
      }, 1000);
    });
  }

  private initEditors() {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(variablessTypes.replace(/export\s/g, ''));
    this.tsEditor = monaco.editor.create(this.tsEditorContainer.nativeElement, {
      value: exampleCode,
      language: 'typescript',
      theme: 'vs-dark'
    });
    this.cssEditor = monaco.editor.create(this.cssEditorContainer.nativeElement, {
      value: '',
      language: 'css',
      theme: 'vs-dark',
      readOnly: true
    });
  }

  private listenToValueChanges() {
    const valueChange = new Subject();
    const decoratorsChange = new Subject();
    const observable = decoratorsChange.asObservable();
    this.tsEditor.onDidChangeModelContent(() => valueChange.next());
    this.tsEditor.onDidChangeModelDecorations(() => decoratorsChange.next());
    valueChange
      .asObservable()
      .pipe(
        switchMap(() => observable),
        debounceTime(500),
        filter(() => {
          const model = this.tsEditor.getModel();
          if (model === null || model.getModeId() !== 'typescript') {
            return false;
          }
          const owner = model.getModeId();
          const markers = monaco.editor.getModelMarkers({ owner });

          return markers.filter(({ severity }) => severity === MarkerSeverity.Error).length === 0;
        })
      )
      .subscribe(() => this.buildVariables());
  }

  private buildVariables() {
    this.loadCodeAsModule().then(rules => {
      const css = buildVariables(rules);
      if (this.previousResult !== css) {
        this.animateArrows = true;
        this.previousResult = css;
        this.cssEditor.setValue(css);
        setTimeout(() => {
          this.animateArrows = false;
        }, 1000);
      }
    });
  }

  private listenToResize() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.cssEditor.layout();
        this.tsEditor.layout();
      });
  }

  private transpileTsContentToJS() {
    return ts.transpileModule(this.tsEditor.getValue(), {
      compilerOptions: { module: ts.ModuleKind.ES2015, removeComments: true }
    }).outputText;
  }

  private loadCodeAsModule() {
    const moduleString = this.transpileTsContentToJS();
    const inlineModule = `data:text/javascript;base64,${btoa(moduleString)}`;

    return import(/* webpackIgnore: true */ inlineModule);
  }
}
