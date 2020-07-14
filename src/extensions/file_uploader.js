import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from '../base';

import {
  insertUploadPlaceholder,
  replaceUploadPlaceholder,
  removeUploadPlaceholder
} from '../commands';

export default class FileUploader extends Extension {
  fileUploader = null;

  get name() {
    return 'file_uploader';
  }

  get defaultOptions() {
    return {
      progressContainerNode: null,
      locale: null,
      uploadEndpoint: null,
      uploadHeaders: null
    };
  }

  async init() {
    const { default: ShikiFileUploader } = await import(
      process.env.VUE_APP_USER === 'morr' ?
        '../../../shiki-utils/src/file_uploader' :
        'shiki-utils/src/file_uploader'
    );

    this.fileUploader = this.buildFileUploader(ShikiFileUploader);
    this.fileUploader
      .on('upload:file:added', (_e, uppyFile) =>
        insertUploadPlaceholder(
          this.editor,
          { uploadId: uppyFile.id, file: uppyFile.data }
        )
      )
      .on('upload:file:success', (_e, { uppyFile, response }) =>
        replaceUploadPlaceholder(
          this.editor,
          { uploadId: uppyFile.id, response }
        )
      )
      .on('upload:file:error', (_e, { uppyFile }) =>
        removeUploadPlaceholder(
          this.editor,
          { uploadId: uppyFile.id }
        )
      );
  }

  get isUploading() {
    return !!(this.fileUploader?.isUploading);
  }

  addFiles(files) {
    this.fileUploader.addFiles(files);
  }

  enable() {
    this.fileUploader.enable();
  }

  disable() {
    this.fileUploader.disable();
  }

  buildFileUploader(ShikiFileUploader) {
    return new ShikiFileUploader({
      node: this.editor.view.dom,
      progressContainerNode: this.options.progressContainerNode,
      locale: this.options.locale,
      xhrEndpoint: this.options.uploadEndpoint,
      xhrHeaders: this.options.uploadHeaders,
      maxNumberOfFiles: 10
    });
  }

  get plugins() {
    return [
      new Plugin({
        key: new PluginKey(this.name)
      })
    ];
  }

  destroy() {
    this.fileUploader.destroy();
  }
}
