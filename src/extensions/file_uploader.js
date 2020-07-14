import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from '../base';

export default class FileUploader extends Extension {
  get name() {
    return 'file_uploader';
  }

  get plugins() {
    return [
      new Plugin({
        key: new PluginKey(this.name)
      })
    ];
  }
}
